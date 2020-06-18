import { getData, writeData, getDirectoryList } from "./util";
import fs from "fs";
import path from "path";
import flatten from "lodash.flatten";
import express from "express";
import graphqlHTTP from "express-graphql";
import cors from "cors";
import { codegen } from "@graphql-codegen/core";
import { plugin as typescriptPlugin } from "@graphql-codegen/typescript";
import { plugin as typescriptOperationsPlugin } from "@graphql-codegen/typescript-operations";
import {
  parse,
  getNamedType,
  GraphQLBoolean,
  GraphQLError,
  GraphQLInputType,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
  GraphQLNonNull,
  printSchema,
  GraphQLType,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLFieldResolver,
} from "graphql";
import camelCase from "lodash.camelcase";
import kebabcase from "lodash.kebabcase";
import upperFist from "lodash.upperfirst";
import { pluginsList } from "./plugins";

type DirectorySection = {
  type: "directory";
  label: string;
  path: string;
  create: "documents" | "all";
  match: string;
  new_doc_ext: string;
  templates: string[];
};
type HeadingSection = {
  type: "heading";
  label: string;
};
type DocumentSection = {
  type: "document";
  label: string;
  path: string;
};
type Section = DirectorySection | HeadingSection | DocumentSection;
type Settings = {
  data: { sections: Section[] };
};

const arrayToObject = <T>(
  array: T[],
  func: (accumulator: { [key: string]: any }, item: T) => void
) => {
  const accumulator = {};
  array.forEach((item) => {
    func(accumulator, item);
  });

  return accumulator;
};
const getSectionFmtTypes = (
  settings: Settings,
  templateObjectTypes: Templates
) => {
  const sectionTemplates = flatten(
    settings.data.sections
      .filter(isDirectorySection)
      .map(({ templates }) => templates)
  );
  return (
    sectionTemplates
      .map((sectionTemplate) => templateObjectTypes[sectionTemplate])
      ?.filter(isNotNull) || [
      new GraphQLObjectType({ name: "Woops", fields: {} }), // FIXME fallback to providing a type
    ]
  );
};
const getSectionFmtTypes2 = (
  section: string,
  sectionFmts: {
    name: string;
    templates: string[];
  }[],
  templateObjectTypes: Templates
) => {
  const activeSectionTemplates = sectionFmts.find(
    ({ name }) => name === section
  );
  const types = activeSectionTemplates?.templates
    .map((templateName: string) => templateObjectTypes[templateName])
    ?.filter(isNotNull) || [
    new GraphQLObjectType({ name: "Woops", fields: {} }), // FIXME fallback to providing a type
  ];

  return types;
};

const getBlockFmtTypes = (
  templateTypes: string[],
  templateDataObjectTypes: TemplatesData
) => {
  return templateTypes.map((template) => templateDataObjectTypes[template]);
};
const getPagesForSection = (
  section: string,
  sectionFmts: {
    name: string;
    templates: string[];
  }[],
  templatePages: {
    name: string;
    pages: string[];
  }[]
) => {
  const templates = sectionFmts.find(
    (sectionFmt) => sectionFmt.name === section
  )?.templates;
  return flatten(
    templates?.map((templateName) => {
      return templatePages?.find(({ name }) => name === templateName)?.pages;
    })
  );
};
const getFmtForDocument = (
  itemPath: string,
  templatePages: {
    name: string;
    pages: string[];
  }[]
) => {
  return templatePages.find(({ pages }) => {
    return pages?.includes(itemPath);
  });
};
const getSectionFmtInputTypes = (
  settings: Settings,
  templateInputObjectTypes: {
    [key: string]: GraphQLInputObjectType;
  }
) => {
  const sectionTemplates = flatten(
    settings.data.sections
      .filter(isDirectorySection)
      .map(({ templates }) => templates)
  );

  return arrayToObject<GraphQLInputObjectType>(
    sectionTemplates
      .map((sectionTemplate) => templateInputObjectTypes[sectionTemplate])
      ?.filter(isNotNull),
    (obj: any, item: any) => {
      obj[(getNamedType(item) || "").toString()] = { type: item };
    }
  );
};

const getDocument = async (
  templatePages: {
    name: string;
    pages: string[];
  }[],
  args: {
    [argName: string]: any;
  },
  config: any
): Promise<DocumentType> => {
  const activeTemplate = templatePages.find(({ pages }) => {
    return pages?.includes(args.path);
  });

  const document = await getData<DocumentType>(
    config.rootPath + "/" + args.path
  );

  return {
    ...document,
    path: args.path,
    template: activeTemplate?.name || "",
  };
};

function isDirectorySection(section: Section): section is DirectorySection {
  return section.type === "directory";
}

function isSelectField(field: FieldType): field is SelectField {
  return field.type === "select";
}
function isSectionSelectField(field: FieldType): field is SectionSelect {
  if (!isSelectField(field)) {
    return false;
  }
  return field?.config?.source?.type === "pages";
}

function isListField(field: FieldType): field is SelectField {
  return field.type === "list";
}
function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null;
}
function isString(arg: string | string[]): arg is string {
  return typeof arg === "string";
}

function isSectionListField(field: FieldType): field is SectionList {
  if (!isListField(field)) {
    return false;
  }
  return field?.config?.source?.type === "pages";
}

type BaseDocumentType = {
  content: string;
  isEmpty: boolean;
  excerpt: string;
};

type DocumentType = BaseDocumentType & {
  path: string;
  template: string;
  data: object;
};
type WithFields = {
  label: string;
  name: string;
  type: string;
  fields: FieldType[];
};
type FMT = BaseDocumentType & {
  data: WithFields & {
    label: string;
    hide_body: boolean;
    display_field: string;
    pages: string[];
  };
};

type TextField = {
  label: string;
  name: string;
  type: "text";
  default: string;
  config?: {
    required?: boolean;
  };
};
type TextareaField = {
  label: string;
  name: string;
  type: "textarea";
  config: {
    required: boolean;
    wysiwyg: boolean;
    schema: { format: "markdown" };
  };
};
type TagListField = {
  label: string;
  name: string;
  type: "tag_list";
  default: string[];
  config?: {
    required?: boolean;
  };
};
type BooleanField = {
  label: string;
  name: string;
  type: "boolean";
  config?: {
    required?: boolean;
  };
};
type NumberField = {
  label: string;
  name: string;
  type: "number";
  config?: {
    required?: boolean;
  };
};
type DateField = {
  label: string;
  name: string;
  type: "datetime";
  hidden: boolean;
  default: "now";
  config: {
    date_format: string;
    export_format: string;
    required: boolean;
  };
};
type BlocksField = {
  label: string;
  name: string;
  type: "blocks";
  template_types: string[];
  config?: {
    min: string;
    max: string;
  };
};
type FieldGroupField = WithFields & {
  label: string;
  name: string;
  type: "field_group";
  config?: {
    required?: boolean;
  };
};
type FieldGroupListField = WithFields & {
  label: string;
  name: string;
  type: "field_group_list";
  config?: {
    required?: boolean;
  };
};
type FileField = {
  label: string;
  name: string;
  type: "file";
  config?: {
    required?: boolean;
    maxSize: null | number;
  };
};
type GalleryField = {
  label: string;
  name: string;
  type: "image_gallery";
  config: {
    required?: boolean;
    maxSize: null | number;
  };
};
type BaseListField = {
  label: string;
  name: string;
  type: "list";
};
type SimpleList = BaseListField & {
  config: {
    required?: boolean;
    use_select: boolean;
    min: null | number;
    max: null | number;
  };
};
type SectionList = BaseListField & {
  config?: {
    required?: boolean;
    use_select: boolean;
    min: null | number;
    max: null | number;
    source: {
      type: "pages";
      section: string;
    };
  };
};
type ListField = SectionList | SimpleList;

type BaseSelectField = {
  label: string;
  name: string;
  type: "select";
};
type SectionSelect = BaseSelectField & {
  config: {
    required: boolean;
    source: {
      type: "pages";
      section: string;
      file: string;
      path: string;
    };
  };
};
type SimpleSelect = BaseSelectField & {
  default: string;
  config: {
    options: string[];
    required: boolean;
    source: {
      type: "simple";
    };
  };
};
type SelectField = SectionSelect | SimpleSelect;
type FieldType =
  | TextField
  | TextareaField
  | BlocksField
  | DateField
  | NumberField
  | BooleanField
  | TagListField
  | SelectField
  | ListField
  | GalleryField
  | FileField
  | FieldGroupField
  | FieldGroupListField;

type TemplatePage = { name: string; pages: string[] };

type Templates = {
  [key: string]: null | GraphQLObjectType;
};
type TemplatesData = { [key: string]: GraphQLObjectType };

export type PluginFieldArgs = {
  fmt: string;
  field: FieldType;
  templatePages: TemplatePage[];
  templates: Templates;
  rootPath: string;
  sectionFmts: {
    name: string;
    templates: string[];
  }[];
};

type FieldSourceType = {
  [key: string]: string | string[];
};
type FieldContextType = {};
export type Plugin = {
  matches: (string: FieldType["type"], field: FieldType) => boolean;
  run: (
    string: FieldType["type"],
    stuff: PluginFieldArgs
  ) => GraphQLFieldConfig<FieldSourceType, FieldContextType>;
};

/**
 * this function is used to help recursively set the `setter` for groups.
 * it currently treats groups and group-lists similarly which should be fixed
 */
const buildGroupSetter = ({
  name,
  setters,
  field,
}: {
  name: string;
  setters: {
    [key: string]: GraphQLFieldConfig<
      FieldSourceType,
      FieldContextType,
      {
        [argName: string]: GraphQLType;
      }
    >;
  };
  field: WithFields;
}) => {
  return new GraphQLObjectType({
    name: name,
    fields: {
      label: {
        type: GraphQLString,
        resolve: () => {
          return field.label;
        },
      },
      key: {
        type: GraphQLString,
        resolve: () => {
          return camelCase(field.label);
        },
      },
      name: { type: GraphQLString, resolve: () => field.name },
      component: {
        type: GraphQLString,
        resolve: () => {
          return field.type === "field_group_list" ? "group-list" : "group";
        },
      },
      fields: {
        type: GraphQLList(
          new GraphQLUnionType({
            name: name + "_component_config",
            types: () => {
              const array = Object.values(setters);
              const meh = Array.from(
                new Set(array.map((item: any) => item.type))
              );
              return meh;
            },
            // @ts-ignore
            resolveType: (val) => {
              return setters[val.name]?.type;
            },
          })
        ),
        resolve: async (source, args, context, info) => {
          return Promise.all(
            field.fields.map(async (field) => {
              // FIXME: calling resolve manually here, probably a sign that this is in the wrong place
              const res = setters[field.name];
              // @ts-ignore
              return res?.resolve(field, args, context, info);
            })
          );
        },
      },
    },
  });
};

/**
 * This is the main function in this script, it returns all the types
 */
const buildSchema = async (config: any) => {
  const FMT_BASE = ".forestry/front_matter/templates";
  const SETTINGS_PATH = "/.forestry/settings.yml";
  const PATH_TO_TEMPLATES = config.rootPath + "/" + FMT_BASE;

  const shortFMTName = (path: string) => {
    return path.replace(`${PATH_TO_TEMPLATES}/`, "").replace(".yml", "");
  };
  const friendlyName = (name: string, options = { suffix: "" }) => {
    const delimiter = "_";

    return upperFist(
      camelCase(
        shortFMTName(name) + (options.suffix && delimiter + options.suffix)
      )
    );
  };
  const friendlyFMTName = (path: string, options = { suffix: "" }) => {
    const delimiter = "_";

    return upperFist(
      camelCase(
        shortFMTName(path) + (options.suffix && delimiter + options.suffix)
      )
    );
  };

  const replaceFMTPathWithSlug = (path: string) => {
    // FIXME: we reference the slug in "select" fields
    return path.replace(config.sectionPrefix, "");
  };
  const settings = await getData<Settings>(config.rootPath + SETTINGS_PATH);

  const fmtList = await getDirectoryList(PATH_TO_TEMPLATES);

  const templateDataInputObjectTypes: {
    [key: string]: GraphQLInputObjectType;
  } = {};
  const templateInputObjectTypes: {
    [key: string]: GraphQLInputObjectType;
  } = {};
  const templateFormObjectTypes: { [key: string]: GraphQLObjectType } = {};
  const templateDataObjectTypes: TemplatesData = {};
  const templateObjectTypes: Templates = {};

  fmtList.forEach((path) => {
    templateObjectTypes[shortFMTName(path)] = null;
  });

  const templatePages = await Promise.all(
    fmtList.map(async (fmt) => {
      return {
        name: shortFMTName(fmt),
        pages: (await getData<FMT>(fmt)).data.pages,
      };
    })
  );

  const sectionFmts = settings.data.sections
    .filter(isDirectorySection)
    .map(({ path, templates }) => ({
      name: replaceFMTPathWithSlug(path),
      templates,
    }));

  const baseInputFields = {
    name: { type: GraphQLString },
    label: { type: GraphQLString },
    description: { type: GraphQLString },
    component: { type: GraphQLString },
  };

  const textInput = new GraphQLObjectType({
    name: "TextFormField",
    fields: {
      ...baseInputFields,
    },
  });

  const selectInput = new GraphQLObjectType({
    name: "SelectFormField",
    fields: {
      ...baseInputFields,
      options: { type: GraphQLList(GraphQLString) },
    },
  });

  const imageInput = new GraphQLObjectType({
    name: "ImageFormField",
    fields: {
      ...baseInputFields,
    },
  });

  const tagInput = new GraphQLObjectType({
    name: "TagsFormField",
    fields: {
      ...baseInputFields,
    },
  });

  const text = ({ field }: { fmt: string; field: TextField }) => ({
    getter: {
      type: field?.config?.required
        ? GraphQLNonNull(GraphQLString)
        : GraphQLString,
    },
    setter: {
      type: textInput,
      resolve: () => {
        return {
          name: field.name,
          label: field.label,
          component: field.type,
        };
      },
    },
    mutator: {
      type: GraphQLString,
    },
  });

  const textarea = ({ field }: { fmt: string; field: TextareaField }) => ({
    getter: {
      type: field?.config?.required
        ? GraphQLNonNull(GraphQLString)
        : GraphQLString,
    },
    setter: {
      type: textInput,
      resolve: () => {
        return {
          name: field.name,
          label: field.label,
          component: field.type,
        };
      },
    },
    mutator: {
      type: GraphQLString,
    },
  });
  const number = ({ field }: { fmt: string; field: NumberField }) => ({
    getter: {
      // TODO: can be either Int or Float
      type: field?.config?.required ? GraphQLNonNull(GraphQLInt) : GraphQLInt,
    },
    setter: {
      type: textInput,
      resolve: () => {
        return {
          name: field.name,
          label: field.label,
          component: field.type,
        };
      },
    },
    mutator: {
      type: GraphQLInt,
    },
  });
  const boolean = ({ field }: { fmt: string; field: BooleanField }) => ({
    getter: {
      type: field?.config?.required
        ? GraphQLNonNull(GraphQLBoolean)
        : GraphQLBoolean,
    },
    setter: {
      type: textInput,
      resolve: () => {
        return "hi";
      },
    },
    mutator: {
      type: GraphQLBoolean,
    },
  });
  const select = ({ fmt, field }: { fmt: string; field: SelectField }) => {
    if (pluginsList.matches("select", field)) {
      return {
        getter: pluginsList.run("select", {
          fmt,
          rootPath: config.rootPath,
          field,
          templates: templateObjectTypes,
          sectionFmts,
          templatePages,
        }),
        setter: {
          type: selectInput,
          resolve: (value: any) => {
            return {
              name: field.name,
              label: field.label,
              component: "select",
              options: value?.config?.options || [],
            };
          },
        },
        mutator: {
          type: GraphQLString,
        },
      };
    } else {
      if (isSectionSelectField(field)) {
        return {
          getter: {
            type: new GraphQLUnionType({
              name: friendlyName(field.name + "_select_" + fmt),
              types: () => {
                return getSectionFmtTypes2(
                  field.config.source.section,
                  sectionFmts,
                  templateObjectTypes
                );
              },
              resolveType: async (val) => {
                return templateObjectTypes[val.template];
              },
            }),
            resolve: async (val: FieldSourceType) => {
              const path = val[field.name];
              if (isString(path)) {
                const res = await getData<DocumentType>(
                  config.rootPath + "/" + path
                );
                const activeTemplate = getFmtForDocument(path, templatePages);
                return {
                  ...res,
                  path: val[field.name],
                  template: activeTemplate?.name,
                };
              } else {
                return {};
              }
            },
          },
          setter: {
            type: selectInput,
            resolve: () => {
              if (field?.config?.source?.type === "pages") {
                const options = getPagesForSection(
                  field.config.source.section,
                  sectionFmts,
                  templatePages
                );
                return {
                  ...field,
                  component: "select",
                  options,
                };
              }

              return {
                name: field.name,
                label: field.label,
                component: "select",
                options: ["this shouldn", "be seen"],
              };
            },
          },
          mutator: {
            type: GraphQLString,
          },
        };
      }

      const options: { [key: string]: { value: string } } = {};
      field.config?.options.forEach(
        (option) => (options[option] = { value: option })
      );

      return {
        getter: {
          // type: new GraphQLEnumType({
          //   name: friendlyName(field.name + "_select_" + fmt),
          //   values: options,
          // }),
          type: GraphQLString,
          resolve: (value: any) => {
            return value[field.name] || field.default;
          },
        },
        setter: {
          type: selectInput,
          resolve: () => {
            return {
              name: field.name,
              label: field.label,
              component: "select",
              options: field.config.options,
            };
          },
        },
        mutator: {
          type: new GraphQLEnumType({
            name: friendlyName(field.name + "_select_" + fmt),
            values: options,
          }),
        },
      };
    }
  };
  const datetime = ({ fmt, field }: { fmt: string; field: DateField }) => ({
    getter: {
      type: GraphQLString,
    },
    setter: {
      type: textInput,
      resolve: () => {
        return "hi";
      },
    },
    mutator: {
      type: GraphQLString,
    },
  });
  const tag_list = ({ field }: { fmt: string; field: TagListField }) => ({
    getter: {
      type: GraphQLList(GraphQLString),
    },
    setter: {
      type: tagInput,
      resolve: () => {
        return {
          name: field.name,
          label: field.label,
          component: "tags",
        };
      },
    },
    mutator: {
      type: GraphQLList(GraphQLString),
    },
  });
  const list = ({ fmt, field }: { fmt: string; field: ListField }) => {
    if (isSectionListField(field)) {
      return {
        getter: {
          type: GraphQLList(
            new GraphQLUnionType({
              name: friendlyName(field.name + "_list_" + fmt),
              types: () => {
                return getSectionFmtTypes2(
                  field.config?.source.section || "",
                  sectionFmts,
                  templateObjectTypes
                );
              },
              resolveType: async (val: DocumentType) => {
                return templateObjectTypes[val.template];
              },
            })
          ),
          resolve: async (val: FieldSourceType) => {
            let paths = val[field.name];
            paths = Array.isArray(paths) ? paths : [];

            return await Promise.all(
              paths.map(async (itemPath) => {
                const res = await getData<DocumentType>(
                  config.rootPath + "/" + itemPath
                );
                const activeTemplate = getFmtForDocument(
                  itemPath,
                  templatePages
                );
                return {
                  ...res,
                  path: itemPath,
                  template: activeTemplate?.name,
                };
              })
            );
          },
        },
        setter: {
          type: new GraphQLObjectType({
            name: friendlyName(field.name + "_list_" + fmt + "_config"),
            fields: {
              ...baseInputFields,
              component: { type: GraphQLString },
              itemField: {
                type: new GraphQLObjectType({
                  name: friendlyName(
                    field.name + "_list_" + fmt + "_config_item"
                  ),
                  fields: {
                    name: { type: GraphQLString },
                    label: { type: GraphQLString },
                    component: { type: GraphQLString },
                    options: { type: GraphQLList(GraphQLString) },
                  },
                }),
              },
            },
          }),
          resolve: () => {
            const possiblePages = getPagesForSection(
              field.config?.source.section || "",
              sectionFmts,
              templatePages
            );

            return {
              name: field.name,
              label: field.label,
              component: "list",
              itemField: {
                label: field.label + " Item",
                name: "path",
                component: "select",
                options: possiblePages,
              },
            };
          },
        },
        mutator: {
          type: GraphQLList(GraphQLString),
        },
      };
    }

    return {
      getter: { type: GraphQLList(GraphQLString) },
      setter: {
        type: new GraphQLObjectType({
          name: friendlyName(field.name + "_list_" + fmt + "_config"),
          fields: {
            ...baseInputFields,
            component: { type: GraphQLString },
            itemField: {
              type: new GraphQLObjectType({
                name: friendlyName(
                  field.name + "_list_" + fmt + "_config_item"
                ),
                fields: {
                  name: { type: GraphQLString },
                  label: { type: GraphQLString },
                  component: { type: GraphQLString },
                },
              }),
            },
          },
        }),
        resolve: () => {
          return {
            name: field.name,
            label: field.label,
            component: "list",
            itemField: {
              label: field.label + " Item",
              component: "text",
            },
          };
        },
      },
      mutator: {
        type: GraphQLList(GraphQLString),
      },
    };
  };
  const file = ({ fmt, field }: { fmt: string; field: FileField }) => {
    return {
      getter: {
        type: new GraphQLObjectType({
          name: friendlyName(field.name + "_gallery_" + fmt),
          fields: {
            path: {
              type: GraphQLNonNull(GraphQLString),
              resolve: async (val) => {
                return val;
              },
            },
            absolutePath: {
              type: GraphQLNonNull(GraphQLString),
              resolve: async (val) => {
                return config.rootPath + val;
              },
            },
          },
        }),
      },
      setter: {
        type: imageInput,
        resolve: () => {
          return {
            name: field.name,
            label: field.label,
            component: "file",
          };
        },
      },
      mutator: {
        type: GraphQLString,
      },
    };
  };
  const image_gallery = ({
    fmt,
    field,
  }: {
    fmt: string;
    field: GalleryField;
  }) => {
    return {
      getter: {
        type: GraphQLList(
          new GraphQLObjectType({
            name: friendlyName(field.name + "_gallery_" + fmt),
            fields: {
              path: {
                type: GraphQLNonNull(GraphQLString),
                resolve: async (val) => {
                  return val;
                },
              },
              absolutePath: {
                type: GraphQLNonNull(GraphQLString),
                resolve: async (val) => {
                  return config.rootPath + val;
                },
              },
            },
          })
        ),
      },
      setter: {
        type: imageInput,
        resolve: () => {
          return {
            name: field.name,
            component: "image",
          };
        },
      },
      mutator: {
        type: GraphQLList(GraphQLString),
      },
    };
  };
  const field_group = ({
    fmt,
    field,
  }: {
    fmt: string;
    field: FieldGroupField;
  }) => {
    const { getters, setters, mutators } = generateFields({
      fmt: `${fmt}_${field.name}`,
      fields: field.fields,
    });
    return {
      getter: {
        type: new GraphQLObjectType({
          name: friendlyName(field.name + "_fields_" + fmt),
          fields: getters,
        }),
      },
      setter: {
        type: buildGroupSetter({
          name: friendlyName(field.name + "_fields_list_" + fmt + "_config"),
          setters: setters,
          field,
        }),
        resolve: (value: any) => {
          return value;
        },
      },
      mutator: {
        type: new GraphQLInputObjectType({
          name: friendlyName(field.name + "_fields_" + fmt + "_input"),
          fields: mutators,
        }),
      },
    };
  };
  const field_group_list = ({
    fmt,
    field,
  }: {
    fmt: string;
    field: FieldGroupListField;
  }) => {
    const { getters, setters, mutators } = generateFields({
      fmt: `${fmt}_${field.name}`,
      fields: field.fields,
    });
    return {
      getter: {
        type: GraphQLList(
          new GraphQLObjectType({
            name: friendlyName(field.name + "_fields_list_" + fmt),
            fields: getters,
          })
        ),
      },
      setter: {
        type: buildGroupSetter({
          name: friendlyName(field.name + "_fields_list_" + fmt + "_config"),
          setters,
          field,
        }),
        resolve: (value: any) => {
          return value;
        },
      },
      mutator: {
        type: GraphQLList(
          new GraphQLInputObjectType({
            name: friendlyName(field.name + "_fields_list_" + fmt + "_input"),
            fields: mutators,
          })
        ),
      },
    };
  };
  const blocks = ({ field }: { fmt: string; field: BlocksField }) => {
    return {
      getter: {
        type: GraphQLList(
          new GraphQLUnionType({
            name: friendlyName(field.name + "_union"),
            types: () => {
              return getBlockFmtTypes(
                field.template_types,
                templateDataObjectTypes
              );
            },
            resolveType: (val) => {
              return templateDataObjectTypes[val.template];
            },
          })
        ),
      },
      setter: {
        type: new GraphQLObjectType({
          name: friendlyName(field.name + "_fieldConfig"),
          fields: {
            ...baseInputFields,
            templates: {
              type: new GraphQLObjectType({
                name: friendlyName(field.name + "_templates"),
                fields: () => {
                  return arrayToObject(
                    field.template_types.map(
                      (template) => templateFormObjectTypes[template]
                    ),
                    (obj, item) => {
                      obj[item.name] = {
                        type: item,
                        resolve: (val: any) => {
                          return val;
                        },
                      };
                    }
                  );
                },
              }),
            },
          },
        }),
        resolve: async (value: any) => {
          return {
            ...field,
            component: field.type,
            templates: arrayToObject(field.template_types, (obj, item) => {
              obj[item] = { name: item };
            }),
          };
        },
      },
      mutator: {
        type: GraphQLList(
          new GraphQLInputObjectType({
            name: friendlyName(field.name + "_input"),
            fields: () => {
              return arrayToObject(field.template_types, (obj, item) => {
                obj[friendlyName(item + "_input")] = {
                  type: templateDataInputObjectTypes[shortFMTName(item)],
                };
              });
            },
          })
        ),
      },
    };
  };

  type fieldTypeType = {
    getter: GraphQLFieldConfig<
      FieldSourceType,
      FieldContextType,
      {
        [argName: string]: GraphQLType;
      }
    >;
    setter: GraphQLFieldConfig<
      FieldSourceType,
      FieldContextType,
      {
        [argName: string]: GraphQLType;
      }
    >;
    mutator: { type: GraphQLInputType };
  };

  const getFieldType = ({
    fmt,
    field,
  }: {
    fmt: string;
    field: FieldType;
  }): fieldTypeType => {
    switch (field.type) {
      case "text":
        return text({ fmt, field });
      case "textarea":
        return textarea({ fmt, field });
      case "number":
        return number({ fmt, field });
      case "boolean":
        return boolean({ fmt, field });
      case "select":
        return select({ fmt, field });
      case "datetime":
        return datetime({ fmt, field });
      case "tag_list":
        return tag_list({ fmt, field });
      case "list":
        return list({ fmt, field });
      case "file":
        return file({ fmt, field });
      case "image_gallery":
        return image_gallery({ fmt, field });
      case "field_group":
        return field_group({ fmt, field });
      case "field_group_list":
        return field_group_list({ fmt, field });
      case "blocks":
        return blocks({ fmt, field });
      default:
        // FIXME just a placeholder
        return text({ fmt, field });
    }
  };

  type generatedFieldsType = {
    getters: {
      [key: string]: GraphQLFieldConfig<
        FieldSourceType,
        FieldContextType,
        {
          [argName: string]: GraphQLType;
        }
      >;
    };
    setters: {
      [key: string]: GraphQLFieldConfig<
        FieldSourceType,
        FieldContextType,
        {
          [argName: string]: GraphQLType;
        }
      >;
    };
    mutators: {
      [key: string]: { type: GraphQLInputType };
    };
  };

  const generateFields = ({
    fmt,
    fields,
  }: {
    fmt: string;
    fields: FieldType[];
  }): generatedFieldsType => {
    const accumulator: generatedFieldsType = {
      getters: {},
      setters: {},
      mutators: {},
    };

    fields.forEach((field) => {
      const { getter, setter, mutator } = getFieldType({ fmt, field });
      accumulator.getters[field.name] = getter;
      accumulator.setters[field.name] = setter;
      accumulator.mutators[field.name] = mutator;
    });

    return {
      getters: accumulator.getters,
      setters: accumulator.setters,
      mutators: accumulator.mutators,
    };
  };

  await Promise.all(
    fmtList.map(async (path) => {
      const fmt = await getData<FMT>(path);

      const { getters, setters, mutators } = generateFields({
        fmt: friendlyFMTName(path),
        fields: fmt.data.fields,
      });

      const templateDataInputObjectType = new GraphQLInputObjectType({
        name: friendlyFMTName(path + "_data_input"),
        fields: mutators,
      });

      const templateInputObjectType = new GraphQLInputObjectType({
        name: friendlyFMTName(path + "_input"),
        fields: {
          data: { type: templateDataInputObjectType },
          content: { type: GraphQLString },
        },
      });

      const templateFormObjectType = buildGroupSetter({
        name: friendlyFMTName(path, { suffix: "field_config" }),
        setters,
        field: fmt.data,
      });

      const templateDataObjectType = new GraphQLObjectType({
        name: friendlyFMTName(path, { suffix: "data" }),
        fields: {
          _template: {
            type: GraphQLString,
            resolve: () => friendlyFMTName(path, { suffix: "field_config" }),
          },
          ...getters,
        },
      });

      const templateObjectType = new GraphQLObjectType({
        name: friendlyFMTName(path),
        fields: {
          form: {
            type: templateFormObjectType,
            resolve: (value: DocumentType) => {
              return value;
            },
          },
          absolutePath: { type: GraphQLNonNull(GraphQLString) },
          path: { type: GraphQLNonNull(GraphQLString) },
          content: {
            type: GraphQLNonNull(GraphQLString),
          },
          excerpt: { type: GraphQLString },
          data: { type: GraphQLNonNull(templateDataObjectType) },
        },
      });

      templateDataInputObjectTypes[
        shortFMTName(path)
      ] = templateDataInputObjectType;
      templateInputObjectTypes[shortFMTName(path)] = templateInputObjectType;
      templateFormObjectTypes[shortFMTName(path)] = templateFormObjectType;
      templateDataObjectTypes[shortFMTName(path)] = templateDataObjectType;
      templateObjectTypes[shortFMTName(path)] = templateObjectType;
    })
  );

  const documentType = new GraphQLUnionType({
    name: friendlyName("document_union"),
    types: () => getSectionFmtTypes(settings, templateObjectTypes),
    resolveType: (val) => {
      return templateObjectTypes[val.template];
    },
  });

  const documentInputType = {
    type: new GraphQLInputObjectType({
      name: "DocumentInput",
      fields: () => getSectionFmtInputTypes(settings, templateInputObjectTypes),
    }),
  };

  const rootQuery = new GraphQLObjectType({
    name: "Query",
    fields: {
      document: {
        type: documentType,
        args: {
          path: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => getDocument(templatePages, args, config),
      },
    },
  });
  const rootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      document: {
        type: documentType,
        args: {
          path: { type: GraphQLNonNull(GraphQLString) },
          params: documentInputType,
        },
      },
    },
  });

  const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
  });

  const transform = (obj: any): any => {
    const meh: { [key: string]: any } = {};
    Object.keys(obj).map((key) => {
      const val = obj[key];
      if (Array.isArray(val)) {
        meh[key] = val.map((item) => {
          if (typeof item === "string" || typeof item === "number") {
            return item;
          }
          // Get the first item in the object
          const templateBigName = Object.keys(item)[0];

          if (templateBigName.endsWith("Input")) {
            const values = item[templateBigName];
            const accumulator = {
              template: kebabcase(templateBigName.replace("Input", "")),
              ...values,
            };
            return transform(accumulator);
          } else {
            return item;
          }
        });
      } else {
        meh[key] = obj[key];
      }
    });
    return meh;
  };

  const documentMutation = async (payload: { path: string; params: any }) => {
    await writeData(
      payload.path,
      "",
      transform(payload.params.BlockPageInput.data)
    );
  };

  return { schema, documentMutation };
};

const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP(async () => {
    const configPath = path.resolve(process.cwd() + "/.forestry/config.js");
    const userConfig = require(configPath);
    const config = {
      rootPath: process.cwd(),
      ...userConfig,
    };
    const { schema, documentMutation } = await buildSchema(config);
    await fs.writeFileSync(
      __dirname + "/../src/schema.gql",
      printSchema(schema)
    );
    const querySchema = await fs
      .readFileSync(__dirname + "/../src/query.gql")
      .toString();

    const res = await codegen({
      filename: __dirname + "/../src/schema.ts",
      schema: parse(printSchema(schema)),
      documents: [
        {
          location: "operation.graphql",
          document: parse(querySchema),
        },
      ],
      config: {},
      plugins: [{ typescript: {} }, { typescriptOperations: {} }],
      pluginMap: {
        typescript: {
          plugin: typescriptPlugin,
        },
        typescriptOperations: {
          plugin: typescriptOperationsPlugin,
        },
      },
    });
    await fs.writeFileSync(
      process.cwd() + "/.forestry/types.ts",
      `// DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
    ${res}
        `
    );

    const query = await fs.readFileSync(__dirname + "/../src/query.gql");
    await fs.writeFileSync(
      process.cwd() + "/.forestry/query.ts",
      `// DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
export default \`${query}\`
`
    );

    return {
      schema,
      rootValue: {
        document: documentMutation,
      },
      graphiql: true,
      customFormatErrorFn(err: GraphQLError) {
        console.log(err);
        return {
          message: err.message,
          locations: err.locations,
          path: err.path,
        };
      },
    };
  })
);
app.listen(4001);
