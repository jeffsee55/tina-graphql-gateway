### Getting started

Currently this is a monorepo built with Yarn V2, it might just be easier to break this out due to issues with monorepo DX but for now I've kept it in place.

To use, make sure you've got yarn V2 installed [by following these instructions](https://yarnpkg.com/getting-started/install). Then:

```sh
yarn install
# build the builder
yarn workspace @forestry/build run build
# build the GraphQL package
yarn workspace @forestry/graphql run build
# cd to apps/demo, open 2 terminal tabs
# in the first tab run
yarn forestry:serve
# in the other tab run your app dev server
yarn dev
```

Once that's done you should be good to go. Here's a walkthrough of getting started:

https://www.loom.com/share/595b92be7a3f4999a0db0baf82e47dae

## GraphQL Server

`yarn forestry:serve` will start up the GraphQL server, you'll be able to inspect it in more detail at `http://localhost:4001/graphql`.

## NextJS App

`yarn dev` runs the NextJS app and doesn't do much right now, just wraps the app in Tina and fetchs the Forestry query from GraphQL, and applies the provided Typescript type to the result. Note that the `query.ts` and `types.ts` files are generated from the `@forestry/graphql` package automatically (even though the `query.ts` is manually maintained).

### The `.forestry` folder

This demo uses a couple of extra things from the `.forestry` folder:

- **config.js** - This is where we can put site-specific configurations, there's a `sectionPrefix` which we're using as an escape-hatch to fix some issues where we don't know how to lookup a section. Ideally this is fixed in the settings generated by Forestry in the future.
- **types.ts** - This is auto-generated from the Forestry GraphQL package, you can see it being used in the `[page].tsx` file.
- **query.ts** - This is manually maintained for now with the goal for it to be generated automatically in the future. It's the actual GraphQL query that gets run to generate all the data for the page. See the Gotchas section for troubleshooting.

---

## Gotchas

For now there are a lot of footguns when developing in this repo.

### Tina

[Use this branch](https://github.com/tinacms/tinacms/tree/forestry-gql-compatible) locally.

Tina isn't working properly with Yarn V2, I get a few errors depending on what I try but can't pinpoint the issue yet. There is also a custom `list` component in this branch that we make use of. For now, it's easiest to run Tina locally on the branch called `forestry-gql-compatible` and rely on the `next.config.js` aliases.

NOTE: The Tina aliases can be seen in the `demo/next.config.js` file, ensure the paths resolve to your local Tina install and you've built all the necessary Tina packages.

For reference, here is one of the errors we get, which seems to indicate we have 2 React-Beautiful-DND contexts:

```
Error: Could not find "store" in the context of "Connect(Droppable)". Either wrap the root component in a <Provider>, or pass a custom React context provider to <Provider> and the corresponding React context consumer to Connect(Droppable) in connect options.
```

### Maintaining the GraphQL query manually

Since each schema is unique to the site, we can't know ahead of time what that will look like. It should be generated from the schema automatically. There's a lot of work to do for this to work seemlessly, as it stands it's easy to break things if you forget to include a form field in the query (for example: "component") the form won't work and it won't be clear why.

NOTE: this should probably throw a Typescript error from Tina's end

### Using this repo with the Forestry.io app

For demonstation purposes I've put the demos in the `apps` folder. But the Forestry app needs the `.forestry` files to be in the repo root so you can't hook this repo up to the app as it stands.
