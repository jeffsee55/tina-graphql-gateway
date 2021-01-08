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
  /** References another document, used as a foreign key */
  Reference: any;
  JSON: any;
  JSONObject: any;
};

export type Node = {
  id: Scalars['ID'];
};

export type Document = {
  sys?: Maybe<SystemInfo>;
  id: Scalars['ID'];
};

export type FormField = {
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};




export type SystemInfo = {
  __typename?: 'SystemInfo';
  filename?: Maybe<Scalars['String']>;
  basename?: Maybe<Scalars['String']>;
  breadcrumbs?: Maybe<Array<Maybe<Scalars['String']>>>;
  path?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
  section?: Maybe<Section>;
};


export type SystemInfoBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type Section = {
  __typename?: 'Section';
  type?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  create?: Maybe<Scalars['String']>;
  match?: Maybe<Scalars['String']>;
  new_doc_ext?: Maybe<Scalars['String']>;
  templates?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug?: Maybe<Scalars['String']>;
  documents?: Maybe<Array<Maybe<Document>>>;
};

export type SectionDocumentUnion = Pages_Document | Posts_Document | Authors_Document | Menus_Document;

export type SectionParams = {
  pages?: Maybe<Pages_Input>;
  posts?: Maybe<Posts_Input>;
  authors?: Maybe<Authors_Input>;
  menus?: Maybe<Menus_Input>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPendingDocument?: Maybe<Node>;
  updateDocument?: Maybe<SectionDocumentUnion>;
  updatePagesDocument?: Maybe<Pages_Document>;
  updatePostsDocument?: Maybe<Posts_Document>;
  updateAuthorsDocument?: Maybe<Authors_Document>;
  updateMenusDocument?: Maybe<Menus_Document>;
};


export type MutationAddPendingDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
};


export type MutationUpdateDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  params?: Maybe<SectionParams>;
};


export type MutationUpdatePagesDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  params?: Maybe<Pages_Input>;
};


export type MutationUpdatePostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  params?: Maybe<Posts_Input>;
};


export type MutationUpdateAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  params?: Maybe<Authors_Input>;
};


export type MutationUpdateMenusDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
  params?: Maybe<Menus_Input>;
};

export type Query = {
  __typename?: 'Query';
  _queryString?: Maybe<Scalars['String']>;
  node?: Maybe<Node>;
  getDocument?: Maybe<SectionDocumentUnion>;
  getSections?: Maybe<Array<Maybe<Section>>>;
  getSection?: Maybe<Section>;
  getPagesDocument?: Maybe<Pages_Document>;
  getPagesList?: Maybe<Array<Maybe<Pages_Document>>>;
  getPostsDocument?: Maybe<Posts_Document>;
  getPostsList?: Maybe<Array<Maybe<Posts_Document>>>;
  getAuthorsDocument?: Maybe<Authors_Document>;
  getAuthorsList?: Maybe<Array<Maybe<Authors_Document>>>;
  getMenusDocument?: Maybe<Menus_Document>;
  getMenusList?: Maybe<Array<Maybe<Menus_Document>>>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryGetDocumentArgs = {
  section?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetSectionArgs = {
  section?: Maybe<Scalars['String']>;
};


export type QueryGetPagesDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetPostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetMenusDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};

export type Pages_Data = BlockPage_Doc_Data;

export type Pages_Input = {
  blockPage?: Maybe<BlockPage_Doc_Input>;
};

export type Pages_Values = BlockPage_Doc_Values;

export type Pages_Form = BlockPage_Doc_Form;

export type Pages_Document = Node & Document & {
  __typename?: 'Pages_Document';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data?: Maybe<Pages_Data>;
  values?: Maybe<Pages_Values>;
  form?: Maybe<Pages_Form>;
};

export type LongTextValue = {
  __typename?: 'LongTextValue';
  raw?: Maybe<Scalars['String']>;
  markdownAst?: Maybe<Scalars['JSONObject']>;
  html?: Maybe<Scalars['String']>;
};

export type Sidecar_Cta_Data = {
  __typename?: 'Sidecar_Cta_Data';
  header?: Maybe<Scalars['String']>;
};

export type ActionVideo_Data = {
  __typename?: 'ActionVideo_Data';
  url?: Maybe<Scalars['String']>;
};

export type ActionNewsletter_Data = {
  __typename?: 'ActionNewsletter_Data';
  body?: Maybe<LongTextValue>;
  footer?: Maybe<LongTextValue>;
};

export type ActionPageReference_ButtonSettings_Data = {
  __typename?: 'ActionPageReference_ButtonSettings_Data';
  label?: Maybe<Scalars['String']>;
};

export type ActionPageReference_Data = {
  __typename?: 'ActionPageReference_Data';
  page?: Maybe<Pages_Document>;
  button_settings?: Maybe<ActionPageReference_ButtonSettings_Data>;
};

export type Sidecar_Actions_Data = ActionVideo_Data | ActionNewsletter_Data | ActionPageReference_Data;

export type Sidecar_Data = {
  __typename?: 'Sidecar_Data';
  text?: Maybe<LongTextValue>;
  image?: Maybe<Scalars['String']>;
  cta?: Maybe<Sidecar_Cta_Data>;
  actions?: Maybe<Array<Maybe<Sidecar_Actions_Data>>>;
  style?: Maybe<Scalars['String']>;
};

export type ExcerptPost_Data = {
  __typename?: 'ExcerptPost_Data';
  post?: Maybe<Posts_Document>;
  description?: Maybe<LongTextValue>;
  style?: Maybe<Scalars['String']>;
};

export type PostList_Posts_Data = {
  __typename?: 'PostList_Posts_Data';
  post?: Maybe<Posts_Document>;
};

export type PostList_Data = {
  __typename?: 'PostList_Data';
  posts?: Maybe<Array<Maybe<PostList_Posts_Data>>>;
};

export type PriceList_Prices_Data = {
  __typename?: 'PriceList_Prices_Data';
  title?: Maybe<Scalars['String']>;
  description?: Maybe<LongTextValue>;
  bullet_points?: Maybe<Array<Maybe<Scalars['String']>>>;
  category?: Maybe<Scalars['String']>;
};

export type PriceList_Data = {
  __typename?: 'PriceList_Data';
  heading?: Maybe<LongTextValue>;
  prices?: Maybe<Array<Maybe<PriceList_Prices_Data>>>;
};

export type AuthorList_Data = {
  __typename?: 'AuthorList_Data';
  authors?: Maybe<Array<Maybe<Authors_Document>>>;
};

export type SponsorList_Sponsor_Data = {
  __typename?: 'SponsorList_Sponsor_Data';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
};

export type SponsorList_Data = {
  __typename?: 'SponsorList_Data';
  description?: Maybe<LongTextValue>;
  sponsor?: Maybe<Array<Maybe<SponsorList_Sponsor_Data>>>;
};

export type PageReference_Data = {
  __typename?: 'PageReference_Data';
  description?: Maybe<LongTextValue>;
  page?: Maybe<Pages_Document>;
};

export type SectionIndex_Data = {
  __typename?: 'SectionIndex_Data';
  body?: Maybe<LongTextValue>;
  limit?: Maybe<Scalars['Int']>;
  section?: Maybe<Scalars['String']>;
};

export type BlockPage_Blocks_Data = Sidecar_Data | ExcerptPost_Data | PostList_Data | PriceList_Data | AuthorList_Data | SponsorList_Data | PageReference_Data | SectionIndex_Data;

export type BlockPage_Doc_Data = {
  __typename?: 'BlockPage_Doc_Data';
  title?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  blocks?: Maybe<Array<Maybe<BlockPage_Blocks_Data>>>;
  _body?: Maybe<LongTextValue>;
};

export type LongTextInitialValue = {
  __typename?: 'LongTextInitialValue';
  raw?: Maybe<Scalars['String']>;
};

export type Sidecar_Cta_Values = {
  __typename?: 'Sidecar_Cta_Values';
  header?: Maybe<Scalars['String']>;
};

export type ActionVideo_Values = {
  __typename?: 'ActionVideo_Values';
  url?: Maybe<Scalars['String']>;
  _template?: Maybe<Scalars['String']>;
};

export type ActionNewsletter_Values = {
  __typename?: 'ActionNewsletter_Values';
  body?: Maybe<LongTextInitialValue>;
  footer?: Maybe<LongTextInitialValue>;
  _template?: Maybe<Scalars['String']>;
};

export type ActionPageReference_ButtonSettings_Values = {
  __typename?: 'ActionPageReference_ButtonSettings_Values';
  label?: Maybe<Scalars['String']>;
};

export type ActionPageReference_Values = {
  __typename?: 'ActionPageReference_Values';
  page?: Maybe<Scalars['Reference']>;
  button_settings?: Maybe<ActionPageReference_ButtonSettings_Values>;
  _template?: Maybe<Scalars['String']>;
};

export type Sidecar_Actions_Values = ActionVideo_Values | ActionNewsletter_Values | ActionPageReference_Values;

export type Sidecar_Values = {
  __typename?: 'Sidecar_Values';
  text?: Maybe<LongTextInitialValue>;
  image?: Maybe<Scalars['String']>;
  cta?: Maybe<Sidecar_Cta_Values>;
  actions?: Maybe<Array<Maybe<Sidecar_Actions_Values>>>;
  style?: Maybe<Scalars['Reference']>;
  _template?: Maybe<Scalars['String']>;
};

export type ExcerptPost_Values = {
  __typename?: 'ExcerptPost_Values';
  post?: Maybe<Scalars['Reference']>;
  description?: Maybe<LongTextInitialValue>;
  style?: Maybe<Scalars['Reference']>;
  _template?: Maybe<Scalars['String']>;
};

export type PostList_Posts_Values = {
  __typename?: 'PostList_Posts_Values';
  post?: Maybe<Scalars['Reference']>;
};

export type PostList_Values = {
  __typename?: 'PostList_Values';
  posts?: Maybe<Array<Maybe<PostList_Posts_Values>>>;
  _template?: Maybe<Scalars['String']>;
};

export type PriceList_Prices_Values = {
  __typename?: 'PriceList_Prices_Values';
  title?: Maybe<Scalars['String']>;
  description?: Maybe<LongTextInitialValue>;
  bullet_points?: Maybe<Array<Maybe<Scalars['String']>>>;
  category?: Maybe<Scalars['Reference']>;
};

export type PriceList_Values = {
  __typename?: 'PriceList_Values';
  heading?: Maybe<LongTextInitialValue>;
  prices?: Maybe<Array<Maybe<PriceList_Prices_Values>>>;
  _template?: Maybe<Scalars['String']>;
};

export type AuthorList_Values = {
  __typename?: 'AuthorList_Values';
  authors?: Maybe<Array<Maybe<Scalars['String']>>>;
  _template?: Maybe<Scalars['String']>;
};

export type SponsorList_Sponsor_Values = {
  __typename?: 'SponsorList_Sponsor_Values';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
};

export type SponsorList_Values = {
  __typename?: 'SponsorList_Values';
  description?: Maybe<LongTextInitialValue>;
  sponsor?: Maybe<Array<Maybe<SponsorList_Sponsor_Values>>>;
  _template?: Maybe<Scalars['String']>;
};

export type PageReference_Values = {
  __typename?: 'PageReference_Values';
  description?: Maybe<LongTextInitialValue>;
  page?: Maybe<Scalars['Reference']>;
  _template?: Maybe<Scalars['String']>;
};

export type SectionIndex_Values = {
  __typename?: 'SectionIndex_Values';
  body?: Maybe<LongTextInitialValue>;
  limit?: Maybe<Scalars['Int']>;
  section?: Maybe<Scalars['Reference']>;
  _template?: Maybe<Scalars['String']>;
};

export type BlockPage_Blocks_Values = Sidecar_Values | ExcerptPost_Values | PostList_Values | PriceList_Values | AuthorList_Values | SponsorList_Values | PageReference_Values | SectionIndex_Values;

export type BlockPage_Doc_Values = {
  __typename?: 'BlockPage_Doc_Values';
  title?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  blocks?: Maybe<Array<Maybe<BlockPage_Blocks_Values>>>;
  _body?: Maybe<LongTextInitialValue>;
  _template?: Maybe<Scalars['String']>;
};

export type TextField = FormField & {
  __typename?: 'TextField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type DatetimeField = FormField & {
  __typename?: 'DatetimeField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type TextareaField = FormField & {
  __typename?: 'TextareaField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type FileField = FormField & {
  __typename?: 'FileField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type Sidecar_Cta_FormFieldsUnion = TextField;

export type Sidecar_Cta_GroupField = FormField & {
  __typename?: 'Sidecar_Cta_GroupField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Sidecar_Cta_FormFieldsUnion>>>;
};

export type ActionVideo_FormFieldsUnion = TextField;

export type ActionVideo_Form = {
  __typename?: 'ActionVideo_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ActionVideo_FormFieldsUnion>>>;
};

export type ActionNewsletter_FormFieldsUnion = TextareaField;

export type ActionNewsletter_Form = {
  __typename?: 'ActionNewsletter_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ActionNewsletter_FormFieldsUnion>>>;
};

export type SelectField = FormField & {
  __typename?: 'SelectField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ActionPageReference_ButtonSettings_FormFieldsUnion = TextField;

export type ActionPageReference_ButtonSettings_GroupField = FormField & {
  __typename?: 'ActionPageReference_ButtonSettings_GroupField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ActionPageReference_ButtonSettings_FormFieldsUnion>>>;
};

export type ActionPageReference_FormFieldsUnion = SelectField | ActionPageReference_ButtonSettings_GroupField;

export type ActionPageReference_Form = {
  __typename?: 'ActionPageReference_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ActionPageReference_FormFieldsUnion>>>;
};

export type Sidecar_Actions_BlocksFieldTemplates = {
  __typename?: 'Sidecar_Actions_BlocksFieldTemplates';
  actionVideo?: Maybe<ActionVideo_Form>;
  actionNewsletter?: Maybe<ActionNewsletter_Form>;
  actionPageReference?: Maybe<ActionPageReference_Form>;
};

export type Sidecar_Actions_BlocksField = FormField & {
  __typename?: 'Sidecar_Actions_BlocksField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  templates?: Maybe<Sidecar_Actions_BlocksFieldTemplates>;
};

export type Sidecar_FormFieldsUnion = TextareaField | FileField | Sidecar_Cta_GroupField | Sidecar_Actions_BlocksField | SelectField;

export type Sidecar_Form = {
  __typename?: 'Sidecar_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Sidecar_FormFieldsUnion>>>;
};

export type ExcerptPost_FormFieldsUnion = SelectField | TextareaField;

export type ExcerptPost_Form = {
  __typename?: 'ExcerptPost_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ExcerptPost_FormFieldsUnion>>>;
};

export type PostList_Posts_FormFieldsUnion = SelectField;

export type PostList_Posts_GroupListField = FormField & {
  __typename?: 'PostList_Posts_GroupListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<PostList_Posts_FormFieldsUnion>>>;
};

export type PostList_FormFieldsUnion = PostList_Posts_GroupListField;

export type PostList_Form = {
  __typename?: 'PostList_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<PostList_FormFieldsUnion>>>;
};

export type List_FormFieldsUnion = TextField | SelectField;

export type ListField = FormField & {
  __typename?: 'ListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  defaultItem?: Maybe<Scalars['String']>;
  field?: Maybe<List_FormFieldsUnion>;
};

export type PriceList_Prices_FormFieldsUnion = TextField | TextareaField | ListField | SelectField;

export type PriceList_Prices_GroupListField = FormField & {
  __typename?: 'PriceList_Prices_GroupListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<PriceList_Prices_FormFieldsUnion>>>;
};

export type PriceList_FormFieldsUnion = TextareaField | PriceList_Prices_GroupListField;

export type PriceList_Form = {
  __typename?: 'PriceList_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<PriceList_FormFieldsUnion>>>;
};

export type AuthorList_FormFieldsUnion = ListField;

export type AuthorList_Form = {
  __typename?: 'AuthorList_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<AuthorList_FormFieldsUnion>>>;
};

export type SponsorList_Sponsor_FormFieldsUnion = TextField | FileField;

export type SponsorList_Sponsor_GroupListField = FormField & {
  __typename?: 'SponsorList_Sponsor_GroupListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<SponsorList_Sponsor_FormFieldsUnion>>>;
};

export type SponsorList_FormFieldsUnion = TextareaField | SponsorList_Sponsor_GroupListField;

export type SponsorList_Form = {
  __typename?: 'SponsorList_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<SponsorList_FormFieldsUnion>>>;
};

export type PageReference_FormFieldsUnion = TextareaField | SelectField;

export type PageReference_Form = {
  __typename?: 'PageReference_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<PageReference_FormFieldsUnion>>>;
};

export type NumberField = FormField & {
  __typename?: 'NumberField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type SectionIndex_FormFieldsUnion = TextareaField | NumberField | SelectField;

export type SectionIndex_Form = {
  __typename?: 'SectionIndex_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<SectionIndex_FormFieldsUnion>>>;
};

export type BlockPage_Blocks_BlocksFieldTemplates = {
  __typename?: 'BlockPage_Blocks_BlocksFieldTemplates';
  sidecar?: Maybe<Sidecar_Form>;
  excerptPost?: Maybe<ExcerptPost_Form>;
  postList?: Maybe<PostList_Form>;
  priceList?: Maybe<PriceList_Form>;
  authorList?: Maybe<AuthorList_Form>;
  sponsorList?: Maybe<SponsorList_Form>;
  pageReference?: Maybe<PageReference_Form>;
  sectionIndex?: Maybe<SectionIndex_Form>;
};

export type BlockPage_Blocks_BlocksField = FormField & {
  __typename?: 'BlockPage_Blocks_BlocksField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  templates?: Maybe<BlockPage_Blocks_BlocksFieldTemplates>;
};

export type BlockPage_Doc_FormFieldsUnion = TextField | DatetimeField | BlockPage_Blocks_BlocksField | TextareaField;

export type BlockPage_Doc_Form = {
  __typename?: 'BlockPage_Doc_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<BlockPage_Doc_FormFieldsUnion>>>;
};

export type Sidecar_Text_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type Sidecar_Cta_Input = {
  header?: Maybe<Scalars['String']>;
};

export type ActionVideo_Input = {
  url?: Maybe<Scalars['String']>;
};

export type ActionNewsletter_Body_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type ActionNewsletter_Footer_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type ActionNewsletter_Input = {
  body?: Maybe<ActionNewsletter_Body_LongTextInput>;
  footer?: Maybe<ActionNewsletter_Footer_LongTextInput>;
};

export type ActionPageReference_ButtonSettings_Input = {
  label?: Maybe<Scalars['String']>;
};

export type ActionPageReference_Input = {
  page?: Maybe<Scalars['String']>;
  button_settings?: Maybe<ActionPageReference_ButtonSettings_Input>;
};

export type Actions_Input = {
  actionVideo?: Maybe<ActionVideo_Input>;
  actionNewsletter?: Maybe<ActionNewsletter_Input>;
  actionPageReference?: Maybe<ActionPageReference_Input>;
};

export type Sidecar_Input = {
  text?: Maybe<Sidecar_Text_LongTextInput>;
  image?: Maybe<Scalars['String']>;
  cta?: Maybe<Sidecar_Cta_Input>;
  actions?: Maybe<Array<Maybe<Actions_Input>>>;
  style?: Maybe<Scalars['String']>;
};

export type ExcerptPost_Description_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type ExcerptPost_Input = {
  post?: Maybe<Scalars['String']>;
  description?: Maybe<ExcerptPost_Description_LongTextInput>;
  style?: Maybe<Scalars['String']>;
};

export type PostList_Posts_Input = {
  post?: Maybe<Scalars['String']>;
};

export type PostList_Input = {
  posts?: Maybe<Array<Maybe<PostList_Posts_Input>>>;
};

export type PriceList_Heading_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type Description_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type PriceList_Prices_Input = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Description_LongTextInput>;
  bullet_points?: Maybe<Array<Maybe<Scalars['String']>>>;
  category?: Maybe<Scalars['String']>;
};

export type PriceList_Input = {
  heading?: Maybe<PriceList_Heading_LongTextInput>;
  prices?: Maybe<Array<Maybe<PriceList_Prices_Input>>>;
};

export type AuthorList_Input = {
  authors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SponsorList_Description_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type SponsorList_Sponsor_Input = {
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
};

export type SponsorList_Input = {
  description?: Maybe<SponsorList_Description_LongTextInput>;
  sponsor?: Maybe<Array<Maybe<SponsorList_Sponsor_Input>>>;
};

export type PageReference_Description_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type PageReference_Input = {
  description?: Maybe<PageReference_Description_LongTextInput>;
  page?: Maybe<Scalars['String']>;
};

export type SectionIndex_Body_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type SectionIndex_Input = {
  body?: Maybe<SectionIndex_Body_LongTextInput>;
  limit?: Maybe<Scalars['Int']>;
  section?: Maybe<Scalars['String']>;
};

export type Blocks_Input = {
  sidecar?: Maybe<Sidecar_Input>;
  excerptPost?: Maybe<ExcerptPost_Input>;
  postList?: Maybe<PostList_Input>;
  priceList?: Maybe<PriceList_Input>;
  authorList?: Maybe<AuthorList_Input>;
  sponsorList?: Maybe<SponsorList_Input>;
  pageReference?: Maybe<PageReference_Input>;
  sectionIndex?: Maybe<SectionIndex_Input>;
};

export type Body_LongTextInput = {
  raw?: Maybe<Scalars['String']>;
};

export type BlockPage_Doc_Input = {
  title?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  blocks?: Maybe<Array<Maybe<Blocks_Input>>>;
  _body?: Maybe<Body_LongTextInput>;
};

export type Posts_Data = Post_Doc_Data;

export type Posts_Input = {
  post?: Maybe<Post_Doc_Input>;
};

export type Posts_Values = Post_Doc_Values;

export type Posts_Form = Post_Doc_Form;

export type Posts_Document = Node & Document & {
  __typename?: 'Posts_Document';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data?: Maybe<Posts_Data>;
  values?: Maybe<Posts_Values>;
  form?: Maybe<Posts_Form>;
};

export type Post_Doc_Data = {
  __typename?: 'Post_Doc_Data';
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Authors_Document>;
  image?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  _body?: Maybe<LongTextValue>;
};

export type Post_Doc_Values = {
  __typename?: 'Post_Doc_Values';
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['Reference']>;
  image?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  _body?: Maybe<LongTextInitialValue>;
  _template?: Maybe<Scalars['String']>;
};

export type TagListField = FormField & {
  __typename?: 'TagListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
};

export type Post_Doc_FormFieldsUnion = TextField | SelectField | TagListField | TextareaField;

export type Post_Doc_Form = {
  __typename?: 'Post_Doc_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Post_Doc_FormFieldsUnion>>>;
};

export type Post_Doc_Input = {
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  _body?: Maybe<Body_LongTextInput>;
};

export type Authors_Data = Author_Doc_Data;

export type Authors_Input = {
  author?: Maybe<Author_Doc_Input>;
};

export type Authors_Values = Author_Doc_Values;

export type Authors_Form = Author_Doc_Form;

export type Authors_Document = Node & Document & {
  __typename?: 'Authors_Document';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data?: Maybe<Authors_Data>;
  values?: Maybe<Authors_Values>;
  form?: Maybe<Authors_Form>;
};

export type Author_Accolades_Data = {
  __typename?: 'Author_Accolades_Data';
  figure?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type Author_Doc_Data = {
  __typename?: 'Author_Doc_Data';
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']>>>;
  anecdotes?: Maybe<Array<Maybe<Scalars['String']>>>;
  accolades?: Maybe<Array<Maybe<Author_Accolades_Data>>>;
  _body?: Maybe<LongTextValue>;
};

export type Author_Accolades_Values = {
  __typename?: 'Author_Accolades_Values';
  figure?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type Author_Doc_Values = {
  __typename?: 'Author_Doc_Values';
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']>>>;
  anecdotes?: Maybe<Array<Maybe<Scalars['String']>>>;
  accolades?: Maybe<Array<Maybe<Author_Accolades_Values>>>;
  _body?: Maybe<LongTextInitialValue>;
  _template?: Maybe<Scalars['String']>;
};

export type Author_Accolades_FormFieldsUnion = TextField;

export type Author_Accolades_GroupListField = FormField & {
  __typename?: 'Author_Accolades_GroupListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Author_Accolades_FormFieldsUnion>>>;
};

export type Author_Doc_FormFieldsUnion = TextField | ListField | Author_Accolades_GroupListField | TextareaField;

export type Author_Doc_Form = {
  __typename?: 'Author_Doc_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Author_Doc_FormFieldsUnion>>>;
};

export type Author_Accolades_Input = {
  figure?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type Author_Doc_Input = {
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']>>>;
  anecdotes?: Maybe<Array<Maybe<Scalars['String']>>>;
  accolades?: Maybe<Array<Maybe<Author_Accolades_Input>>>;
  _body?: Maybe<Body_LongTextInput>;
};

export type Menus_Data = Menu_Doc_Data;

export type Menus_Input = {
  menu?: Maybe<Menu_Doc_Input>;
};

export type Menus_Values = Menu_Doc_Values;

export type Menus_Form = Menu_Doc_Form;

export type Menus_Document = Node & Document & {
  __typename?: 'Menus_Document';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data?: Maybe<Menus_Data>;
  values?: Maybe<Menus_Values>;
  form?: Maybe<Menus_Form>;
};

export type Menu_MenuItem_Data = {
  __typename?: 'Menu_MenuItem_Data';
  label?: Maybe<Scalars['String']>;
  page?: Maybe<Pages_Document>;
};

export type Menu_Doc_Data = {
  __typename?: 'Menu_Doc_Data';
  logo?: Maybe<Scalars['String']>;
  menu_item?: Maybe<Array<Maybe<Menu_MenuItem_Data>>>;
  _body?: Maybe<LongTextValue>;
};

export type Menu_MenuItem_Values = {
  __typename?: 'Menu_MenuItem_Values';
  label?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Reference']>;
};

export type Menu_Doc_Values = {
  __typename?: 'Menu_Doc_Values';
  logo?: Maybe<Scalars['String']>;
  menu_item?: Maybe<Array<Maybe<Menu_MenuItem_Values>>>;
  _body?: Maybe<LongTextInitialValue>;
  _template?: Maybe<Scalars['String']>;
};

export type Menu_MenuItem_FormFieldsUnion = TextField | SelectField;

export type Menu_MenuItem_GroupListField = FormField & {
  __typename?: 'Menu_MenuItem_GroupListField';
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Menu_MenuItem_FormFieldsUnion>>>;
};

export type Menu_Doc_FormFieldsUnion = FileField | Menu_MenuItem_GroupListField | TextareaField;

export type Menu_Doc_Form = {
  __typename?: 'Menu_Doc_Form';
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Menu_Doc_FormFieldsUnion>>>;
};

export type Menu_MenuItem_Input = {
  label?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
};

export type Menu_Doc_Input = {
  logo?: Maybe<Scalars['String']>;
  menu_item?: Maybe<Array<Maybe<Menu_MenuItem_Input>>>;
  _body?: Maybe<Body_LongTextInput>;
};


