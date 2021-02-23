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

import {
  GraphQLSchema,
  Visitor,
  ASTKindToNode,
  DocumentNode,
  ASTNode,
  getNamedType,
  GraphQLObjectType,
} from "graphql";
import { friendlyName } from "./util";
import { buildSelectionsFields } from "./queryBuilder";

type VisitorType = Visitor<ASTKindToNode, ASTNode>;

/**
 *
 * This generates a query to a "reasonable" depth for the data key of a given section
 * It's not meant for production use
 */
export const queryGenerator = (
  variables: { relativePath: string; section: string },
  schema: GraphQLSchema
): DocumentNode => {
  const t = schema.getQueryType();
  const queryFields = t?.getFields();
  if (queryFields) {
    const queryName = `get${friendlyName(variables.section)}Document`;
    const queryField = queryFields[queryName];

    const returnType = getNamedType(queryField.type);
    if (returnType instanceof GraphQLObjectType) {
      let depth = 0;
      const fields = buildSelectionsFields(
        Object.values(returnType.getFields()).filter(
          (field) => field.name === "data"
        ),
        (fields) => {
          const filteredFieldsList = [
            "sys",
            "__typename",
            "template",
            "html",
            "form",
            "values",
            "markdownAst",
          ];
          depth = depth + 1;
          const filteredFields = fields.filter((field) => {
            return !filteredFieldsList.includes(field.name);
          });

          return { continue: depth < 5, filteredFields };
        }
      );

      return {
        kind: "Document" as const,
        definitions: [
          {
            kind: "OperationDefinition" as const,
            operation: "query",
            name: {
              kind: "Name" as const,
              value: queryName,
            },
            variableDefinitions: [
              {
                kind: "VariableDefinition" as const,
                variable: {
                  kind: "Variable" as const,
                  name: {
                    kind: "Name" as const,
                    value: "relativePath",
                  },
                },
                type: {
                  kind: "NonNullType" as const,
                  type: {
                    kind: "NamedType" as const,
                    name: {
                      kind: "Name" as const,
                      value: "String",
                    },
                  },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: queryName,
                  },
                  arguments: [
                    {
                      kind: "Argument",
                      name: {
                        kind: "Name",
                        value: "relativePath",
                      },
                      value: {
                        kind: "Variable",
                        name: {
                          kind: "Name",
                          value: "relativePath",
                        },
                      },
                    },
                  ],
                  directives: [],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: fields,
                  },
                },
              ],
            },
          },
        ],
      };
    } else {
      throw new Error(
        "Expected return type to be an instance of GraphQLObject"
      );
    }
  } else {
    throw new Error("Unable to find query fields for provided schema");
  }
};

/**
 *
 * This generates a mutation to a "reasonable" depth for the data key of a given section
 * It's not meant for production use
 */
export const mutationGenerator = (
  variables: { relativePath: string; section: string },
  schema: GraphQLSchema
): DocumentNode => {
  const t = schema.getQueryType();
  const queryFields = t?.getFields();
  if (queryFields) {
    const mutationName = `update${friendlyName(variables.section)}Document`;
    const queryName = `get${friendlyName(variables.section)}Document`;
    const queryField = queryFields[queryName];

    const returnType = getNamedType(queryField.type);
    if (returnType instanceof GraphQLObjectType) {
      let depth = 0;
      const fields = buildSelectionsFields(
        Object.values(returnType.getFields()).filter(
          (field) => field.name === "data"
        ),
        (fields) => {
          const filteredFieldsList = [
            "sys",
            "__typename",
            "template",
            "html",
            "form",
            "values",
            "markdownAst",
          ];
          depth = depth + 1;
          const filteredFields = fields.filter((field) => {
            return !filteredFieldsList.includes(field.name);
          });

          return { continue: depth < 5, filteredFields };
        }
      );

      return {
        kind: "Document" as const,
        definitions: [
          {
            kind: "OperationDefinition" as const,
            operation: "mutation",
            name: {
              kind: "Name" as const,
              value: mutationName,
            },
            variableDefinitions: [
              {
                kind: "VariableDefinition" as const,
                variable: {
                  kind: "Variable" as const,
                  name: {
                    kind: "Name" as const,
                    value: "relativePath",
                  },
                },
                type: {
                  kind: "NonNullType" as const,
                  type: {
                    kind: "NamedType" as const,
                    name: {
                      kind: "Name" as const,
                      value: "String",
                    },
                  },
                },
              },
              {
                kind: "VariableDefinition" as const,
                variable: {
                  kind: "Variable" as const,
                  name: {
                    kind: "Name" as const,
                    value: "params",
                  },
                },
                type: {
                  kind: "NonNullType" as const,
                  type: {
                    kind: "NamedType" as const,
                    name: {
                      kind: "Name" as const,
                      value: `${friendlyName(variables.section)}_Input`,
                    },
                  },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: mutationName,
                  },
                  arguments: [
                    {
                      kind: "Argument",
                      name: {
                        kind: "Name",
                        value: "relativePath",
                      },
                      value: {
                        kind: "Variable",
                        name: {
                          kind: "Name",
                          value: "relativePath",
                        },
                      },
                    },
                    {
                      kind: "Argument",
                      name: {
                        kind: "Name",
                        value: "params",
                      },
                      value: {
                        kind: "Variable",
                        name: {
                          kind: "Name",
                          value: "params",
                        },
                      },
                    },
                  ],
                  directives: [],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: fields,
                  },
                },
              ],
            },
          },
        ],
      };
    } else {
      throw new Error(
        "Expected return type to be an instance of GraphQLObject"
      );
    }
  } else {
    throw new Error("Unable to find query fields for provided schema");
  }
};
