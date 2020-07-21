import { friendlyFMTName } from "@forestryio/graphql";

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

  const meh = {};
  Object.keys(rest).forEach((key) => {
    if (Array.isArray(rest[key])) {
      meh[key] = rest[key].map((item) => {
        return transform(item);
      });
    } else {
      meh[key] = transform(rest[key]);
    }
  });

  return meh;
};

export const forestryFetch = async (url: string, { query, path }) => {
  const data = await fetchAPI(url, query, { variables: { path } });

  const formConfig = {
    id: path,
    label: path,
    initialValues: data.document.data,
    fields: data.document.form.fields,
  };

  return {
    data,
    formConfig,
  };
};

const traverse = (fields, customizations) => {
  const customizeComponentNames = Object.keys(customizations);
  return fields.map((field) => {
    // If is group or group-list
    if (field.hasOwnProperty("fields")) {
      return {
        ...field,
        fields: traverse(field.fields, customizations),
      };
    }
    // If is blocks
    if (field.hasOwnProperty("templates")) {
      const templates2: { [key: string]: any } = {};
      Object.keys(field.templates).forEach((templateKey) => {
        templates2[templateKey] = {
          ...field.templates[templateKey],
          fields: traverse(field.templates[templateKey].fields, customizations),
        };
      });
      return {
        ...field,
        templates: templates2,
      };
    }

    if (field.component === "toggle") {
      return {
        ...field,
        // parse: (value: any, name: string, field: any) => {
        //   console.log("parse", name, value);
        //   return value;
        // },
        // format: (value: any, name: string, field: any) => {
        //   console.log("format", name, value);
        //   return value;
        // },
      };
    }

    if (customizeComponentNames.includes(field.component)) {
      return {
        ...customizations[field.component](field),
      };
    }

    return field;
  });
};

export const onUpdateSubmit = async ({
  url,
  path,
  payload,
}: {
  url: string;
  path: string;
  payload: any;
}) => {
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

  await fetchAPI<UpdateVariables>(url, mutation, {
    variables: { path: path, params: transformedPayload },
  });
};

export const onAddSubmit = async ({
  url,
  path,
  payload,
}: {
  url: string;
  path: string;
  payload: any;
}) => {
  const mutation = `mutation addDocumentMutation($path: String!, $template: String!, $params: DocumentInput) {
    addDocument(path: $path, template: $template, params: $params) {
      __typename
    }
  }`;
  const { _template, __typename, ...rest } = payload;

  const transformedPayload = transform({
    _template: friendlyFMTName(_template, { suffix: "field_config" }),
    __typename,
    data: rest,
  });

  await fetchAPI<AddVariables>(url, mutation, {
    variables: {
      path: path,
      template: _template + ".yml",
      params: transformedPayload,
    },
  });
};

export const useForestryForm = (
  { data, formConfig },
  useForm,
  url,
  customizations
) => {
  formConfig.fields = traverse(formConfig.fields, customizations);
  const [formData, form] = useForm({
    ...formConfig,
    onSubmit: (values) => {
      onUpdateSubmit({ url, path: formConfig.id, payload: values });
    },
  });

  const { __typename } = data.document;

  return [
    {
      __typename,
      data: formData,
    },
    form,
  ];
};

interface UpdateVariables {
  path: string;
  params?: any;
}

interface AddVariables {
  path: string;
  template: string;
  params?: any;
}

async function fetchAPI<T>(
  url: string,
  query: string,
  { variables }: { variables: T }
) {
  const res = await fetch(url, {
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
