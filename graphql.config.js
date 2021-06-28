/**
Copyright 2021 Forestry.io Holdings, Inc.
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

module.exports = {
  projects: {
    // tinaCloudStarter: {
    //   schema: ['./examples/tina-cloud-starter/.tina/__generated__/schema.gql'],
    //   documents: './examples/tina-cloud-starter/**/*.{graphql,js,ts,jsx,tsx}',
    // },
    // pageBuilder: {
    //   schema: [
    //     './packages/graphql/src/spec/page-builder/.tina/__generated__/schema.gql',
    //   ],
    //   documents:
    //     './packages/graphql/src/spec/page-builder/**/*.{graphql,gql,js,ts,jsx,tsx}',
    // },
    forestrySample: {
      schema: [
        './packages/graphql/src/spec/forestry-sample/.tina/__generated__/schema.gql',
      ],
      documents:
        './packages/graphql/src/spec/forestry-sample/**/*.{graphql,gql,js,ts,jsx,tsx}',
    },
    // movies: {
    //   schema: [
    //     './packages/graphql/src/spec/movies/.tina/__generated__/schema.gql',
    //   ],
    //   documents:
    //     './packages/graphql/src/spec/movies/**/*.{graphql,gql,js,ts,jsx,tsx}',
    // },
  },
}
