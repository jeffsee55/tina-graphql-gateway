import { successText } from "../../utils/theme";
import { generateTypes } from "../../codegen";
import { printSchema, GraphQLSchema } from "graphql";
import fs from "fs";

export async function genTypes(
  { schema }: { schema: GraphQLSchema },
  next: () => void,
  options
) {
  const typescriptTypes = await generateTypes(schema);
  const typesPath = process.cwd() + "/.tina/types.ts";

  await fs.writeFileSync(
    typesPath,
    `// DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
${typescriptTypes}
`
  );
  console.log("Generated types at" + successText(` ${typesPath}`));

  const schemaString = await printSchema(schema);
  const schemaPath = process.cwd() + "/.tina/schema.gql";

  await fs.writeFileSync(
    schemaPath,
    `# DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
${schemaString}
  `
  );
  console.log("Generated schema at" + successText(` ${schemaPath}`));
  next();
}
