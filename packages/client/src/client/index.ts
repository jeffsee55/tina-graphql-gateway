import { friendlyFMTName, queryBuilder } from "@forestryio/graphql-helpers";
import { getIntrospectionQuery, buildClientSchema, print } from "graphql";

const transform = (obj: any) => {
  if (typeof obj === "boolean") {
    return obj;
  }
  if (!obj) {
    return "";
  }
  if (typeof obj == "string" || typeof obj === "number") {
    return obj;
  }

  // FIXME unreliable
  if (obj.hasOwnProperty("path")) {
    return obj.path;
  }
  const { _template, __typename, ...rest } = obj;
  if (_template) {
    return { [_template.replace("FieldConfig", "Input")]: transform(rest) };
  }

  const accumulator = {};
  Object.keys(rest)
    .filter((key) => rest[key]) // remove items with null values
    .forEach((key) => {
      if (Array.isArray(rest[key])) {
        accumulator[key] = rest[key].map((item) => {
          return transform(item);
        });
      } else {
        accumulator[key] = transform(rest[key]);
      }
    });

  return accumulator;
};

interface AddProps {
  url: string;
  path: string;
  template: string;
  payload: any;
}

interface UpdateVariables {
  path: string;
  params?: any;
}

interface AddVariables {
  path: string;
  template: string;
  params?: any;
}

const DEFAULT_TINA_GQL_SERVER = "http://localhost:4001/api/graphql";

export class ForestryClient {
  serverURL: string;
  query: string;
  constructor() {
    this.serverURL = process.env.TINA_GQL_SERVER || DEFAULT_TINA_GQL_SERVER;
  }

  addContent = async ({ path, template, payload }: AddProps) => {
    const mutation = `mutation addDocumentMutation($path: String!, $template: String!, $params: DocumentInput) {
      addDocument(path: $path, template: $template, params: $params) {
        __typename
      }
    }`;

    const transformedPayload = transform({
      _template: friendlyFMTName(template, { suffix: "field_config" }),
      data: payload,
    });

    await this.request<AddVariables>(mutation, {
      variables: {
        path: path,
        template: template + ".yml",
        params: transformedPayload,
      },
    });
  };

  getQuery = async () => {
    if (!this.query) {
      const data = await this.request(getIntrospectionQuery(), {
        variables: {},
      });

      this.query = print(queryBuilder(buildClientSchema(data)));
    }

    return this.query;
  };

  getContent = async <T>({
    path,
  }: {
    path: string;
  }): Promise<{
    data: T;
    formConfig: any;
  }> => {
    const query = await this.getQuery();
    const data = await this.request(query, {
      variables: { path },
    });

    return data;
  };

  updateContent = async ({ path, payload }: { path: string; payload: any }) => {
    const mutation = `mutation updateDocumentMutation($path: String!, $params: DocumentInput) {
      updateDocument(path: $path, params: $params) {
        __typename
      }
    }`;
    const { _template, __typename, ...rest } = payload;

    const transformedPayload = transform({
      _template,
      __typename,
      data: rest,
    });
    // console.log(JSON.stringify(payload, null, 2));
    // console.log(JSON.stringify(transformedPayload, null, 2));

    await this.request<UpdateVariables>(mutation, {
      variables: { path: path, params: transformedPayload },
    });
  };

  async isAuthorized(): Promise<boolean> {
    return Promise.resolve(true); //TODO - implement me
  }

  async isAuthenticated(): Promise<boolean> {
    return Promise.resolve(false); //TODO - implement me
  }

  private async request<VariableType>(
    query: string,
    { variables }: { variables: VariableType }
  ) {
    const res = await fetch(this.serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();
    if (json.errors) {
      console.error(json.errors);
      throw new Error("Failed to fetch API");
    }
    return json.data;
  }
}

export { useForestryForm } from "./useForestryForm";
