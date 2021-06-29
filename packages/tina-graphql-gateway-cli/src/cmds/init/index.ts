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
import fs from 'fs-extra'
import p from 'path'
import Progress from 'progress'

import { successText, logText, cmdText, warnText } from '../../utils/theme'
import { blogPost, nextPostPage, TinaWrapper } from './setup-files'
import { logger } from '../../logger'

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd): Promise<string> {
  const exec = require('child_process').exec
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

export async function initTina(ctx: any, next: () => void, options) {
  logger.info(successText('Setting up Tina...'))
  next()
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function installDeps(ctx: any, next: () => void, options) {
  const bar = new Progress('Install Tina Dependencies... :prog', 2)
  const deps = [
    'tinacms',
    'styled-components',
    'tina-graphql-gateway',
    'tina-graphql-gateway-cli',
  ]

  bar.tick({
    prog: '',
  })
  const installCMD = `yarn add ${deps.join(' ')}`
  await execShellCommand(installCMD)

  // Fake installed used for dev
  // await delay(2000)
  bar.tick({
    prog: '✅',
  })
  logger.level = 'fatal'
  next()
}

const baseDir = process.cwd()
// TODO: should handle src folder here
const TinaWrapperPathDir = p.join(baseDir, 'components')
const TinaWrapperPath = p.join(TinaWrapperPathDir, 'tina-wrapper.tsx')
const blogContentPath = p.join(baseDir, 'content', 'posts')
const blogPostPath = p.join(blogContentPath, 'HelloWorld.md')
export async function tinaSetup(ctx: any, next: () => void, options) {
  logger.level = 'info'

  // 1. Create a content/blog Folder and add one or two blog posts
  if (!fs.pathExistsSync(blogPostPath)) {
    logger.info(logText('Adding a content folder...'))
    fs.mkdirpSync(blogContentPath)
    fs.writeFileSync(blogPostPath, blogPost)
    // logger.info(`✅ Setup your first post in ${blogPostPath}`)
  }

  // 2. Create a Tina Wrapper
  if (!fs.pathExistsSync(TinaWrapperPath)) {
    logger.info(logText('Adding a tina-wrapper...'))
    fs.mkdirpSync(TinaWrapperPathDir)
    fs.writeFileSync(TinaWrapperPath, TinaWrapper)
  }

  // 3. Create a /page/blog/[slug].tsx file with all of the Tina pieces wrapped up in one file
  const useingSrc = fs.pathExistsSync(p.join(baseDir, 'src'))
  const pagesPath = p.join(baseDir, useingSrc ? 'src' : '', 'pages')
  const tinaBlogPagePath = p.join(pagesPath, 'demo', 'blog')
  const tinaBlogPagePathFile = p.join(tinaBlogPagePath, '[filename].tsx')
  if (!fs.pathExistsSync(tinaBlogPagePathFile)) {
    fs.mkdirpSync(tinaBlogPagePath)
    fs.writeFileSync(tinaBlogPagePathFile, nextPostPage)
    // logger.info(`✅ Setup a blog page in ${tinaBlogPagePathFile}`)
  }
  logger.info('Adding a content folder... ✅')
  next()
}
// const tinaCloudText = `Add Tina Cloud as a Backend
// \t1. Register at https://auth.tina.io
// \t2. Update .env file
// NEXT_PUBLIC_ORGANIZATION_NAME=<get this from the organization you create at auth.tina.io>
// NEXT_PUBLIC_TINA_CLIENT_ID=<get this from the app you create at auth.tina.io>
// NEXT_PUBLIC_USE_LOCAL_CLIENT=0
// `
export async function successMessage(ctx: any, next: () => void, options) {
  const baseDir = process.cwd()
  logger.info(`Tina setup  ✅

Before you get started:

\t1. ${warnText('please add the following scripts to your package.json')}
"dev": "yarn tina-gql server:start -c \\"next dev\\"",
"build": "yarn tina-gql server:start -c \\"next build\\"",
"start": "yarn tina-gql server:start -c \\"next start\\""

\t2. Start your dev server with ${cmdText(
    'yarn dev'
  )} and go to http://localhost:3000/demo/blog/HelloWorld to ${successText(
    'check it out the page that was created for you'
  )}
Enjoy Tina!
`)
  next()
}

// These things can go on the page
// For more information visit our docs and check out our getting started guide

// Docs: https://tina.io/docs/tina-cloud/
// Getting starter guide: https://tina.io/guides/tina-cloud/starter/overview/

// \t3. Update the Schema.ts located ${p.join(
//   baseDir,
//   '.tina',
//   'schema.ts'
// )} to match your content: https://tina.io/docs/tina-cloud/cli/#defineschema
