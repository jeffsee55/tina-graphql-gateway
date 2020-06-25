import express from "express";
import graphqlHTTP from "express-graphql";
import cors from "cors";
import { buildSchema } from "@forestryio/graphql";
import { DatabaseManager } from "./databaseManager";
require("dotenv").config();

const dataSource = new DatabaseManager();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4001", "http://localhost:3000"], // FIXME: for some reason had to be extra specific
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);
app.use(
  "/api/graphql",
  graphqlHTTP(async () => {
    // FIXME: this should probably come from the request, or
    // maybe in the case of the DatabaseManager it's not necessary?
    const config = {
      rootPath: "",
      sectionPrefix: "content/",
      siteLookup: "qms5qlc0jk1o9g",
    };
    const { schema, documentMutation } = await buildSchema(config, dataSource);

    return {
      schema,
      rootValue: {
        document: documentMutation,
      },
      context: { dataSource },
    };
  })
);
app.listen(4002);
