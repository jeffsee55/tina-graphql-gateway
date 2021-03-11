/**
Copyright 2021 Forestry.io Inc
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
import type { TinaCMS, Form } from "tinacms";
import { createFormMachine } from "./form-service";
import { createMachine, spawn, StateSchema, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { ContentCreatorPlugin, OnNewDocument } from "./create-page-plugin";
import set from "lodash.set";
import * as yup from "yup";

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
}

const filterForValidFormNodes = async (payload: object) => {
  const keys = Object.keys(payload);
  const accum = {} as object;
  await Promise.all(
    Object.values(payload).map(async (payloadItem, index) => {
      const containsValidForm = async () => {
        // validate payload
        let dataSchema = yup.object().shape({
          // @ts-ignore
          form: yup.object().required().shape({
            // @ts-ignore
            label: yup.string().required(),
            // @ts-ignore
            name: yup.string().required(),
          }),
        });
        try {
          await dataSchema.validate(payloadItem);
        } catch (e) {
          return false;
        }
        return true;
      };

      if (await containsValidForm()) {
        accum[keys[index]] = payloadItem;
      }
    })
  );

  return accum;
};

const isPayloadPresent = async (context: FormsContext) => {
  const payloadSchema = yup.object().required();
  try {
    await payloadSchema.validate(context.payload);
  } catch {
    return false;
  }
  return true;
};

const formsMachine = createMachine<FormsContext, FormsEvent, FormsState>({
  id: "forms",
  initial: "initializing",
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
      invoke: {
        src: async (context, event) => {
          if (!(await isPayloadPresent(context))) {
            return null; // data may not be fetched yet so don't throw error
          }

          // TODO maybe a bit of a code smell here
          // Should we instead only pass in relevant info
          // into this function? (instead of implictly filtering them out)
          const result = await filterForValidFormNodes(context.payload);
          if (Object.keys(result).length === 0) {
            throw new Error("No queries could be used as a Tina form");
          }

          return result;
        },
        onDone: {
          target: "active",
          actions: assign({
            formRefs: (context, event) => {
              const accum = {};
              const keys = Object.keys(event.data);
              Object.values(event.data).forEach((item, index) => {
                accum[keys[index]] = spawn(
                  createFormMachine({
                    client: context.cms.api.tina,
                    cms: context.cms,
                    // @ts-ignore
                    node: item,
                    onSubmit: context.onSubmit,
                    queryFieldName: keys[index],
                    queryString: context.queryString,
                  }),
                  `form-${keys[index]}`
                );
              });
              return accum;
            },
          }),
        },
        onError: {
          target: "inactive",
        },
      },
    },
    active: {
      on: {
        FORM_VALUE_CHANGE: {
          actions: assign({
            payload: (context, event) => {
              const temp = { ...context.payload };
              // FIXME: this breaks when adding a block and then populating it, we don't get an event
              // for when a sortable item is added or changed, need this fix to come from OSS
              // TODO: If we didn't query for it, don't populate it.
              // for now this will populate values which we may not have asked for in the data
              // key. But to do this properly we'll need to traverse the query and store the paths
              // which should be populated
              set(temp, event.pathAndValue.path, event.pathAndValue.value);
              return temp;
            },
          }),
        },
      },
    },
  },
});

const useAddSectionDocumentPlugin = (onNewDocument?: OnNewDocument) => {
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
  payload,
  onSubmit,
}: {
  payload: T;
  onSubmit?: (args: { queryString: string; variables: object }) => void;
}) {
  const cms = useCMS();
  // @ts-ignore FIXME: need to ensure the payload has been hydrated with Tina-specific stuff
  const queryString = payload._queryString;
  const [tinaForms, setTinaForms] = React.useState([]);

  const [machineState, send, service] = useMachine(formsMachine, {
    context: {
      payload,
      formRefs: {},
      cms,
      queryString,
      onSubmit: (values) => {
        cms.api.tina.prepareVariables(values).then((variables) => {
          onSubmit
            ? onSubmit({
                queryString: values.mutationString,
                variables,
              })
            : cms.api.tina
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
    retry: () => {
      send({ type: "RETRY", value: { payload, queryString } });
    },
  };
}

export function useForm<T extends object>({
  payload,
  onSubmit,
  onNewDocument,
}: {
  payload: T;
  onSubmit?: (args: { queryString: string; variables: object }) => void;
  onNewDocument?: OnNewDocument;
}): [T, Form[]] {
  // @ts-ignore FIXME: need to ensure the payload has been hydrated with Tina-specific stuff
  const queryString = payload._queryString;

  // TODO - Should we pull this out of this file.
  // Or return it as a factory function which can
  // optionally be called.
  useAddSectionDocumentPlugin(onNewDocument);

  const { data, retry } = useRegisterFormsAndSyncPayload({ payload, onSubmit });

  React.useEffect(() => {
    retry();
  }, [JSON.stringify(payload), queryString]);

  // @ts-ignore
  return [data.payload, data.tinaForms];
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
