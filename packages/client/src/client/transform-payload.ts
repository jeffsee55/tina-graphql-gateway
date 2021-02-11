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

// @ts-ignore
import { friendlyName } from "@forestryio/graphql-helpers";
import {
  GraphQLSchema,
  getNamedType,
  GraphQLInputObjectType,
  isScalarType,
  GraphQLList,
  parse,
} from "graphql";

const getMutationInputType = (  mutation: string, schema: GraphQLSchema) => {
  // FIXME: this is assuming we're passing in a valid mutation with the top-level
  // selection being the mutation
  const parsedMutation = parse(mutation);
  const mutationName = parsedMutation.definitions.find(
    (def) =>
      def.kind === "OperationDefinition" && def.operation === "mutation"
    // @ts-ignore
  ).selectionSet.selections[0].name.value;
  const mutationType = schema.getMutationType();

  if (!mutationType) {
    throw new Error(`Expected to find mutation type in schema`);
  }

  const mutationNameType = mutationType.getFields()[mutationName];
  if (!mutationNameType) {
    throw new Error(`Expected to find mutation type ${mutationNameType}`);
  }

  const paramsArg = mutationNameType.args.find(
    (arg) => arg.name === "params"
  );
  return paramsArg.type;
}

export const transformPayload = ({
  mutation,
  values,
  schema,
  sys,
}: {
  mutation: string;
  values: object;
  schema: GraphQLSchema;
  sys: {
    template: string;
    section: {
      slug: string;
    };
  };
}) => {
  try {
    const accum = {}; // TODO - this name is a bit ambiguous

    const inputType = getMutationInputType(mutation,schema)

    if (inputType instanceof GraphQLInputObjectType) {
      // SectionParams is special because we need to include the seciton
      // and template as the 2 highest keys in the payload
      if (inputType.name === "SectionParams") {
        const section = Object.values(inputType.getFields()).find((field) => {
          return field.name === sys.section.slug;
        });
        if (section.type instanceof GraphQLInputObjectType) {
          const template = Object.values(section.type.getFields()).find(
            (field) => {
              const templateNameString = friendlyName(sys.template, {
                lowerCase: true,
              });
              return field.name === templateNameString;
            }
          );
          if (template) {
            const transformedInput = transformInputObject(
              values,
              accum,
              section.type
            );
            const payload = {
              [section.name]: transformedInput,
            };
            console.log(payload);
            return payload;
          } else {
            throw new Error(
              `Unable to find matching template for ${sys.template} in section ${sys.section.slug}`
            );
          }
        }
      }
      return transformInputObject(values, accum, inputType);
    } else {
      throw new Error(
        `Unable to transform payload, expected param arg to by an instance of GraphQLInputObjectType`
      );
    }
  } catch (e) { 
    // TODO - Shouldn't we bubble up errors like the one above?
    console.log("oh no", e);
  }
};

// TODO - instead of adding onto accum from within this function, can we just return the new value? 
// This function could instead be renamed to something like "getFieldTypesFromTemplate"
const transformInputObject = (
  values: object,
  accum: { [key: string]: unknown },
  payloadType: GraphQLInputObjectType
) => {
  const fields = payloadType.getFields();
  const template = values["_template"];
  // No template for field-group and field-group-list
  // so just return the value as-is
  if (!template) {
    return values;
  }

  const templateNameString = friendlyName(template, {
    lowerCase: true,
  });
  const templateField = fields[templateNameString];

  // FIXME: redundant? Looks like it's handled above
  // Field Groups don't have a _template field
  if (!templateField) {
    // FIXME: sometimes we're sending _template when it's not needed
    // matched by the fields we're supposed to have
    return values;
  }

  const templateType = getNamedType(templateField.type);
  if (templateType instanceof GraphQLInputObjectType) {
    const fieldTypes = {};
    Object.values(templateType.getFields()).map((field) => {
      const fieldType = getNamedType(field.type);

      const valueForField = values[field.name];
      if (isScalarType(fieldType)) {
        fieldTypes[field.name] = valueForField;
      } else {
        if (field.type instanceof GraphQLList) {
          fieldTypes[field.name] = (valueForField || []).map((val) => {
            if (fieldType instanceof GraphQLInputObjectType) {
              // TODO - by creating a blank accum object & returning here, 
              // aren't we losing all our accum properties set before this point?
              return transformInputObject(val, {}, fieldType);
            } else {
              throw new Error(
                `Expected instance of GraphQLInputObjectType but got ${fieldType}`
              );
            }
          });
        } else {
          // Field Groups don't have a _template field
          fieldTypes[field.name] = valueForField;
        }
      }
    });
    accum[templateNameString] = fieldTypes;
  }
  return accum;
};
