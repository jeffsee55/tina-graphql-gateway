/**
Copyright 2021 Forestry.io Holdings, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import { useCMS } from "tinacms";
import type { TinaCMS, Form, FormOptions } from "tinacms";
import { createFormMachine } from "./form-service";
import { createMachine, spawn, StateSchema, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { ContentCreatorPlugin, OnNewDocument } from "./create-page-plugin";
import set from "lodash.set";
import * as yup from "yup";
import gql from "graphql-tag";
import { print } from "graphql";
import type { DocumentNode as GqlDocumentNode } from "graphql";

export interface FormifyArgs {
  formConfig: FormOptions<any>;
  createForm: (formConfig: FormOptions<any>) => Form;
  skip?: () => void;
}

export type formifyCallback = (args: FormifyArgs) => Form | void;

interface FormsMachineSchemaType extends StateSchema {
  states: {
    initializing;
    inactive;
    active;
  };
}

export type toggleMachineStateValue = keyof FormsMachineSchemaType["states"];

type FormsState =
  | {
      value: "inactive";
      context: FormsContext;
    }
  | {
      value: "active";
      context: FormsContext;
    };

type FormsEvent =
  | {
      type: "RETRY";
      value: { payload: object; queryString: string };
    }
  | {
      type: "FORM_VALUE_CHANGE";
      pathAndValue: any;
    };

interface FormsContext {
  payload: object;
  formRefs: object;
  cms: TinaCMS;
  queryString: string;
  onSubmit?: (args: { mutationString: string; variables: object }) => void;
  formify: formifyCallback;
}

const formsMachine = createMachine<FormsContext, FormsEvent, FormsState>({
  id: "forms",
  initial: "inactive",
  states: {
    inactive: {
      on: {
        RETRY: {
          target: "initializing",
          actions: assign({
            payload: (context, event) => {
              return event.value.payload;
            },
            queryString: (context, event) => {
              return event.value.queryString;
            },
          }),
        },
      },
    },
    initializing: {
      always: {
        target: "active",
        actions: assign({
          formRefs: (context, event) => {
            const accum = {};
            const keys = Object.keys(context.payload);
            Object.values(context.payload).forEach((item, index) => {
              if (!item.form) return;
              accum[keys[index]] = spawn(
                createFormMachine({
                  client: context.cms.api.tina,
                  cms: context.cms,
                  // @ts-ignore
                  node: item,
                  onSubmit: context.onSubmit,
                  queryFieldName: keys[index],
                  queryString: context.queryString,
                  formify: context.formify,
                }),
                `form-${keys[index]}`
              );
            });
            return accum;
          },
        }),
      },
    },
    active: {
      on: {
        FORM_VALUE_CHANGE: {
          actions: assign({
            payload: (context, event) => {
              const temp = { ...context.payload };
              // TODO: If we didn't query for it, don't populate it.
              // for now this will populate values which we may not have asked for in the data
              // key. But to do this properly we'll need to traverse the query and store the paths
              // which should be populated
              set(temp, event.pathAndValue.path, event.pathAndValue.value);
              return temp;
            },
          }),
        },
        RETRY: {
          target: "initializing",
          actions: assign({
            payload: (context, event) => {
              return event.value.payload;
            },
            queryString: (context, event) => {
              return event.value.queryString;
            },
          }),
        },
      },
    },
  },
});

export const useDocumentCreatorPlugin = (onNewDocument?: OnNewDocument) => {
  const cms = useCMS();

  React.useEffect(() => {
    const run = async () => {
      const getSectionOptions = async () => {
        const res = await cms.api.tina.request(
          (gql) => gql`
            {
              getSections {
                slug
                templates
              }
            }
          `,
          { variables: {} }
        );
        const options = [];
        res.getSections.forEach((section) => {
          section.templates.map((template) => {
            const optionValue = `${section.slug}.${template}`;
            const optionLabel = `Section: ${section.slug} - Template: ${template}`;
            options.push({ value: optionValue, label: optionLabel });
          });
        });
        return options;
      };

      cms.plugins.add(
        new ContentCreatorPlugin({
          onNewDocument: onNewDocument,
          fields: [
            {
              component: "select",
              name: "sectionTemplate",
              label: "Template",
              description: "Select the section & template",
              options: await getSectionOptions(),
            },
            {
              component: "text",
              name: "relativePath",
              label: "Relative Path",
              description:
                'The path relative to the given section. Example: "my-blog-post.md"',
              placeholder: "...",
            },
          ],
          label: "Add Document",
        })
      );
    };

    run();
  }, [cms]);
};

function useRegisterFormsAndSyncPayload<T extends object>({
  queryString,
  onSubmit,
  formify,
}: {
  queryString: string;
  onSubmit?: (args: { queryString: string; variables: object }) => void;
  formify?: formifyCallback;
}) {
  const cms = useCMS();
  const [tinaForms, setTinaForms] = React.useState([]);

  const [machineState, send, service] = useMachine(formsMachine, {
    context: {
      formRefs: {},
      cms,
      queryString,
      formify,
      onSubmit: async (values) => {
        return cms.api.tina.prepareVariables(values).then(async (variables) => {
          return onSubmit
            ? await onSubmit({
                queryString: values.mutationString,
                variables,
              })
            : await cms.api.tina
                .request(values.mutationString, { variables })
                .then((res) => {
                  if (res.errors) {
                    console.error(res);
                    cms.alerts.error("Unable to update document");
                  }
                });
        });
      },
    },
  });

  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      if (state.matches("active")) {
        const formIds = Object.keys(state.context.formRefs);
        const forms = state.context.cms.plugins
          .all("form")
          .map((formPlugin) => {
            if (formIds.includes(formPlugin.name)) {
              return formPlugin;
            } else {
              return false;
            }
          })
          .filter(Boolean);

        setTinaForms(forms);
      }
    });

    return subscription.unsubscribe;
  }, [service, setTinaForms]); // note: service should never change

  return {
    data: {
      payload: machineState.context.payload,
      tinaForms,
    },
    retry: (payload, queryString) => {
      send({ type: "RETRY", value: { payload, queryString } });
    },
    ready: machineState.matches("active"),
  };
}

export function useGraphqlForms<T extends object>({
  query,
  variables,
  onSubmit,
  formify = null,
}: {
  query: (gqlTag: typeof gql) => GqlDocumentNode;
  variables: object;
  onSubmit?: (args: { queryString: string; variables: object }) => void;
  formify?: formifyCallback;
}): [T, Boolean] {
  const cms = useCMS();

  const queryString = print(query(gql));

  const { data, retry, ready } = useRegisterFormsAndSyncPayload({
    queryString,
    onSubmit,
    formify,
  });

  React.useEffect(() => {
    cms.api.tina
      .requestWithForm(query, { variables })
      .then((payload) => {
        retry(payload, queryString);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [queryString]);

  // @ts-ignore
  return [data.payload, !ready];
}

type Field = {
  __typename: string;
  name: string;
  label: string;
  component: string;
};

export type DocumentNode = {
  // id: string;
  _internalSys: {
    filename: string;
    relativePath: string;
    basename: string;
    path: string;
  };
  form: {
    __typename: string;
    fields: Field[];
    label: string;
    name: string;
  };
  values: {
    [key: string]: string | string[] | object | object[];
  };
  data: {
    [key: string]: string | string[] | object | object[];
  };
};
