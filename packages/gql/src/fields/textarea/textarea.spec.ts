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

import { gql } from "@forestryio/graphql-helpers/dist/test-util";
import { setupRunner } from "../test-util";

const field = {
  label: "My Title",
  name: "title",
  type: "textarea" as const,
  __namespace: "",
};

const run = setupRunner(field);

describe("Text builds", () => {
  test("a union type of type TextareaField", async () => {
    expect(await run("form")).toEqual(gql`
      type TextareaField implements FormField {
        name: String
        label: String
        component: String
      }
      union Sample_FormFieldsUnion = TextareaField
      type Sample_Form {
        label: String
        name: String
        fields: [Sample_FormFieldsUnion]
      }
    `);
  });
  test("a value of type LongTextInitialValue", async () => {
    expect(await run("values")).toEqual(gql`
      type LongTextInitialValue {
        raw: String
      }
      type Sample_Values {
        title: LongTextInitialValue
        _template: String
      }
    `);
  });
  test("a field of type LongTextData", async () => {
    expect(await run("data")).toEqual(gql`
      type LongTextValue {
        raw: String
        markdownAst: JSONObject
        html: String
      }
      type Sample_Data {
        title: LongTextValue
      }
    `);
  });
  test("an input of type String", async () => {
    expect(await run("input")).toEqual(gql`
      input Title_LongTextInput {
        raw: String
      }
      input Sample_Input {
        title: Title_LongTextInput
      }
    `);
  });
});
