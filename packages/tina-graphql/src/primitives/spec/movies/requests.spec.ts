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

import path from 'path'
import { setup, setupFixture } from '../setup'

const rootPath = path.join(__dirname, '/')

const fixtures = [
  'getMovieDocument',
  'getDocument',
  'getDirectorList',
  'addPendingDocument',
  'updateDocument',
  'getDirectorDocument',
  'getCollections',
  'getCollection',
]
import { tinaSchema } from './.tina/schema'

describe('The given configuration', () => {
  it('Matches the expected schema', async () => {
    const { schemaString, expectedSchemaString } = await setup(
      rootPath,
      tinaSchema,
      true
    )
    expect(schemaString).toEqual(expectedSchemaString)
  })
  fixtures.forEach((fixture) => {
    it(`${fixture} works`, async () => {
      const { response, expectedReponse } = await setupFixture(
        rootPath,
        tinaSchema,
        fixture
      )

      expect(response).toEqual(JSON.parse(expectedReponse))
    })
  })
})
