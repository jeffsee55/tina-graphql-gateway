import { graphql, print, buildASTSchema } from "graphql";
import Cors from "cors";
import fs from "fs";
import {
  buildSchema as buildForestrySchema,
  FileSystemManager,
} from "@forestryio/graphql";
import { generateTypes } from "../../src/codegen";

export default async (req, res) => {
  // Forestry-Config header is supplied by bin.js
  // packages/client/bin.js
  const { headers } = req;
  const forestryConfig = JSON.parse(headers["Forestry-Config"]);

  const dataSource = new FileSystemManager(forestryConfig.rootPath);

  const { schema, documentMutation } = await buildForestrySchema(
    forestryConfig,
    dataSource
  );

  const { query, operationName, variables } = req.body;

  /**
   * FIXME: we're generating types here, this should be moved to it's own process
   * that can be called via CLI
   */
  const { typescriptTypes, query: gQuery } = await generateTypes({ schema });
  await fs.writeFileSync(
    process.cwd() + "/.forestry/types.ts",
    `// DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
${typescriptTypes}
`
  );
  await fs.writeFileSync(
    process.cwd() + "/.forestry/query.ts",
    `// DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
export default \`${print(gQuery)}\`
`
  );

  const response = await graphql(
    schema,
    query,
    { document: documentMutation },
    { dataSource },
    variables,
    operationName
  );

  await cors(req, res);

  return res.end(JSON.stringify(response));
};

const cors = (req, res) => {
  new Promise((resolve, reject) => {
    Cors({
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
    })(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};
