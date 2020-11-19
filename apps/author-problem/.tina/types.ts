// DO NOT MODIFY THIS FILE. This file is automatically generated by Forestry
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  JSONObject: any;
};

export type Posts_DocumentUnion = Post;

export type Posts_DocumentNode = {
  __typename?: 'Posts_DocumentNode';
  section?: Maybe<SectionUnion>;
  path?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>;
  basename?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  node?: Maybe<Posts_DocumentUnion>;
};


export type Posts_DocumentNodeBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type Authors_DocumentUnion = Author;

export type Authors_DocumentNode = {
  __typename?: 'Authors_DocumentNode';
  section?: Maybe<SectionUnion>;
  path?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>;
  basename?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  node?: Maybe<Authors_DocumentUnion>;
};


export type Authors_DocumentNodeBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};



export type Query = {
  __typename?: 'Query';
  getPostsDocument?: Maybe<Posts_DocumentNode>;
  getPostsDocuments?: Maybe<Array<Maybe<Posts_DocumentNode>>>;
  getAuthorsDocument?: Maybe<Authors_DocumentNode>;
  getAuthorsDocuments?: Maybe<Array<Maybe<Authors_DocumentNode>>>;
  document?: Maybe<DocumentNode>;
  documents?: Maybe<Array<Maybe<DocumentNode>>>;
  getSections?: Maybe<Array<Maybe<SectionUnion>>>;
  getSection?: Maybe<SectionUnion>;
  documentList?: Maybe<Array<Maybe<Scalars['String']>>>;
  documentListBySection?: Maybe<Array<Maybe<DocumentNode>>>;
  media?: Maybe<Scalars['String']>;
  mediaList?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryGetPostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetPostsDocumentsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryGetAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetAuthorsDocumentsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
};


export type QueryDocumentsArgs = {
  section?: Maybe<Scalars['String']>;
};


export type QueryGetSectionArgs = {
  section?: Maybe<Scalars['String']>;
};


export type QueryDocumentListArgs = {
  directory?: Maybe<Scalars['String']>;
};


export type QueryDocumentListBySectionArgs = {
  section?: Maybe<Scalars['String']>;
};


export type QueryMediaArgs = {
  path?: Maybe<Scalars['String']>;
};


export type QueryMediaListArgs = {
  directory?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateDocument?: Maybe<DocumentNode>;
  addPendingDocument?: Maybe<DocumentNode>;
};


export type MutationUpdateDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  params?: Maybe<DocumentInput>;
};


export type MutationAddPendingDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
};

export type Post_InputData = {
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  reading_time?: Maybe<Scalars['String']>;
};

export type Post_Input = {
  data?: Maybe<Post_InputData>;
  content?: Maybe<Scalars['String']>;
};

export type Author_InputData = {
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']>>>;
  role?: Maybe<Scalars['String']>;
};

export type Author_Input = {
  data?: Maybe<Author_InputData>;
  content?: Maybe<Scalars['String']>;
};

export type DocumentInput = {
  Post_Input?: Maybe<Post_Input>;
  Author_Input?: Maybe<Author_Input>;
};

export type TextField = {
  __typename?: 'TextField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type SelectField = {
  __typename?: 'SelectField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<Scalars['String']>>>;
  refetchPolicy?: Maybe<Scalars['String']>;
};

export type TagListField = {
  __typename?: 'TagListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type Post_FormFields = TextField | SelectField | TagListField;

export type Post_Form = {
  __typename?: 'Post_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Post_FormFields>>>;
};

export type Post_Data = {
  __typename?: 'Post_Data';
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Authors_DocumentNode>;
  image?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  reading_time?: Maybe<Scalars['String']>;
};

export type Post_InitialValues = {
  __typename?: 'Post_InitialValues';
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  reading_time?: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  form?: Maybe<Post_Form>;
  data?: Maybe<Post_Data>;
  initialValues?: Maybe<Post_InitialValues>;
};

export type List_FormFieldsUnion = TextField | SelectField;

export type ListField = {
  __typename?: 'ListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  defaultItem?: Maybe<Scalars['String']>;
  field?: Maybe<List_FormFieldsUnion>;
};

export type Author_FormFields = TextField | ListField | SelectField;

export type Author_Form = {
  __typename?: 'Author_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Author_FormFields>>>;
};

export type Author_Data = {
  __typename?: 'Author_Data';
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']>>>;
  role?: Maybe<Scalars['String']>;
};

export type Author_InitialValues = {
  __typename?: 'Author_InitialValues';
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']>>>;
  role?: Maybe<Scalars['String']>;
};

export type Author = {
  __typename?: 'Author';
  form?: Maybe<Author_Form>;
  data?: Maybe<Author_Data>;
  initialValues?: Maybe<Author_InitialValues>;
};

export type DocumentUnion = Post | Author;

export type DocumentNode = {
  __typename?: 'DocumentNode';
  section?: Maybe<SectionUnion>;
  path?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>;
  basename?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  node?: Maybe<DocumentUnion>;
};


export type DocumentNodeBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type SectionUnion = {
  __typename?: 'SectionUnion';
  type?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  create?: Maybe<Scalars['String']>;
  match?: Maybe<Scalars['String']>;
  templates?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug?: Maybe<Scalars['String']>;
  documents?: Maybe<Array<Maybe<DocumentNode>>>;
};

export type Posts_DocumentNodeUnion = Post;

export type Posts_Section = {
  __typename?: 'Posts_Section';
  path?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>;
  basename?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  node?: Maybe<Posts_DocumentNodeUnion>;
};


export type Posts_SectionBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type Authors_DocumentNodeUnion = Author;

export type Authors_Section = {
  __typename?: 'Authors_Section';
  path?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>;
  basename?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  node?: Maybe<Authors_DocumentNodeUnion>;
};


export type Authors_SectionBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type DocumentNodeUnion = Posts_Section | Authors_Section;


