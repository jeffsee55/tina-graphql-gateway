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

// DO NOT MODIFY THIS FILE. This file is automatically generated by Tina
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** References another document, used as a foreign key */
  Reference: any
  JSON: any
  JSONObject: any
}

export type Node = {
  id: Scalars['ID']
}

export type Document = {
  sys?: Maybe<SystemInfo>
  id: Scalars['ID']
}

export type FormField = {
  label?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
}

export type SystemInfo = {
  __typename?: 'SystemInfo'
  filename?: Maybe<Scalars['String']>
  basename?: Maybe<Scalars['String']>
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>
  path?: Maybe<Scalars['String']>
  relativePath?: Maybe<Scalars['String']>
  extension?: Maybe<Scalars['String']>
  template?: Maybe<Scalars['String']>
  collection?: Maybe<Section>
}

export type SystemInfoBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>
}

export type Section = {
  __typename?: 'Section'
  type?: Maybe<Scalars['String']>
  path?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  create?: Maybe<Scalars['String']>
  match?: Maybe<Scalars['String']>
  new_doc_ext?: Maybe<Scalars['String']>
  templates?: Maybe<Array<Maybe<Scalars['String']>>>
  slug?: Maybe<Scalars['String']>
  documents?: Maybe<Array<Maybe<Document>>>
}

export type SectionDocumentUnion = Authors_Document | Posts_Document

export type SectionParams = {
  authors?: Maybe<Authors_Input>
  posts?: Maybe<Posts_Input>
}

export type Mutation = {
  __typename?: 'Mutation'
  addPendingDocument?: Maybe<Document>
  updateDocument?: Maybe<SectionDocumentUnion>
  updateAuthorsDocument?: Maybe<Authors_Document>
  updatePostsDocument?: Maybe<Posts_Document>
}

export type MutationAddPendingDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>
  collection?: Maybe<Scalars['String']>
  template?: Maybe<Scalars['String']>
}

export type MutationUpdateDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>
  params?: Maybe<SectionParams>
}

export type MutationUpdateAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>
  params?: Maybe<Authors_Input>
}

export type MutationUpdatePostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>
  params?: Maybe<Posts_Input>
}

export type Query = {
  __typename?: 'Query'
  node?: Maybe<Node>
  getDocument?: Maybe<SectionDocumentUnion>
  getCollections?: Maybe<Array<Maybe<Section>>>
  getCollection?: Maybe<Section>
  getAuthorsDocument?: Maybe<Authors_Document>
  getAuthorsList?: Maybe<Array<Maybe<Authors_Document>>>
  getPostsDocument?: Maybe<Posts_Document>
  getPostsList?: Maybe<Array<Maybe<Posts_Document>>>
}

export type QueryNodeArgs = {
  id: Scalars['ID']
}

export type QueryGetDocumentArgs = {
  collection?: Maybe<Scalars['String']>
  relativePath?: Maybe<Scalars['String']>
}

export type QueryGetCollectionArgs = {
  collection?: Maybe<Scalars['String']>
}

export type QueryGetAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>
}

export type QueryGetPostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>
}

export type Authors_Data = Author_Doc_Data

export type Authors_Input = {
  author?: Maybe<Author_Doc_Input>
}

export type Authors_Values = Author_Doc_Values

export type Authors_Form = Author_Doc_Form

export type Authors_Document = Node &
  Document & {
    __typename?: 'Authors_Document'
    id: Scalars['ID']
    sys?: Maybe<SystemInfo>
    data?: Maybe<Authors_Data>
    values?: Maybe<Authors_Values>
    form?: Maybe<Authors_Form>
  }

export type Author_Accolades_Data = {
  __typename?: 'Author_Accolades_Data'
  figure?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type Author_Doc_Data = {
  __typename?: 'Author_Doc_Data'
  name?: Maybe<Scalars['String']>
  isAuthor?: Maybe<Scalars['Boolean']>
  description?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  accolades?: Maybe<Array<Maybe<Author_Accolades_Data>>>
  _body?: Maybe<Scalars['String']>
}

export type Author_Accolades_Values = {
  __typename?: 'Author_Accolades_Values'
  figure?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type Author_Doc_Values = {
  __typename?: 'Author_Doc_Values'
  name?: Maybe<Scalars['String']>
  isAuthor?: Maybe<Scalars['Boolean']>
  description?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  accolades?: Maybe<Array<Maybe<Author_Accolades_Values>>>
  _body?: Maybe<Scalars['String']>
  _template?: Maybe<Scalars['String']>
}

export type TextField = FormField & {
  __typename?: 'TextField'
  name?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
}

export type BooleanField = FormField & {
  __typename?: 'BooleanField'
  name?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
}

export type TextareaField = FormField & {
  __typename?: 'TextareaField'
  name?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
}

export type Author_Accolades_FormFieldsUnion = TextField

export type Author_Accolades_GroupListField = FormField & {
  __typename?: 'Author_Accolades_GroupListField'
  name?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
  fields?: Maybe<Array<Maybe<Author_Accolades_FormFieldsUnion>>>
}

export type Author_Doc_FormFieldsUnion =
  | TextField
  | BooleanField
  | TextareaField
  | Author_Accolades_GroupListField

export type Author_Doc_Form = {
  __typename?: 'Author_Doc_Form'
  label?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  fields?: Maybe<Array<Maybe<Author_Doc_FormFieldsUnion>>>
}

export type Author_Accolades_Input = {
  figure?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type Author_Doc_Input = {
  name?: Maybe<Scalars['String']>
  isAuthor?: Maybe<Scalars['Boolean']>
  description?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  accolades?: Maybe<Array<Maybe<Author_Accolades_Input>>>
  _body?: Maybe<Scalars['String']>
}

export type Posts_Data = Post_Doc_Data

export type Posts_Input = {
  post?: Maybe<Post_Doc_Input>
}

export type Posts_Values = Post_Doc_Values

export type Posts_Form = Post_Doc_Form

export type Posts_Document = Node &
  Document & {
    __typename?: 'Posts_Document'
    id: Scalars['ID']
    sys?: Maybe<SystemInfo>
    data?: Maybe<Posts_Data>
    values?: Maybe<Posts_Values>
    form?: Maybe<Posts_Form>
  }

export type Post_Doc_Data = {
  __typename?: 'Post_Doc_Data'
  title?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  author?: Maybe<Authors_Document>
  _body?: Maybe<Scalars['String']>
}

export type Post_Doc_Values = {
  __typename?: 'Post_Doc_Values'
  title?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  author?: Maybe<Scalars['Reference']>
  _body?: Maybe<Scalars['String']>
  _template?: Maybe<Scalars['String']>
}

export type SelectField = FormField & {
  __typename?: 'SelectField'
  name?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
  options?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type Post_Doc_FormFieldsUnion = TextField | SelectField | TextareaField

export type Post_Doc_Form = {
  __typename?: 'Post_Doc_Form'
  label?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  fields?: Maybe<Array<Maybe<Post_Doc_FormFieldsUnion>>>
}

export type Post_Doc_Input = {
  title?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  author?: Maybe<Scalars['String']>
  _body?: Maybe<Scalars['String']>
}
