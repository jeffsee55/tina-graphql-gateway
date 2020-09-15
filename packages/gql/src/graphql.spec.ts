import path from "path";
import { schemaBuilder } from "./schema-builder";
import { graphqlInit } from "./graphql";
import { FilesystemDataSource } from "./datasources/filesystem-manager";

describe("Document Resolver", () => {
  test("Receives a path and returns the request document object", async () => {
    const query = `query($path: String!) {
      document(path: $path) {
        __typename
        ...on Post {
          form {
            fields {
              ...on textarea {
                name
                label
                description
                component
              }
            }
          }
          content
          data {
            title
            author {
              ...on Author {
                data {
                  name
                }
              }
            }
            sections {
              ...on SectionData {
                description
              }
            }
          }
        }
      }
    }`;

    const projectRoot = path.join(process.cwd(), "src/fixtures/project1");

    const datasource = FilesystemDataSource(projectRoot);
    const schema = await schemaBuilder({ datasource });

    const res = await graphqlInit({
      schema,
      source: query,
      contextValue: { datasource },
      variableValues: { path: "posts/1.md" },
    });
    if (res.errors) {
      console.log(res.errors);
    }

    expect(res).toMatchObject({
      data: {
        document: {
          __typename: "Post",
          form: {
            fields: [
              {
                name: "title",
                label: "Title",
                description: "",
                component: "textarea",
              },
            ],
          },
          content: `
Some content
`,
          data: {
            title: "Some Title",
            author: {
              data: {
                name: "Homer Simpson",
              },
            },
            sections: [{ description: "Some textarea description" }],
          },
        },
      },
    });
  });
});
