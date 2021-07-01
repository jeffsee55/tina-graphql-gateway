// DO NOT MODIFY THIS FILE. This file is automatically generated by Tina
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
  collection?: Maybe<Collection>;
};


export type SystemInfoBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasPreviousPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  endCursor: Scalars['String'];
};

export type Node = {
  id: Scalars['ID'];
};

/** A relay-compliant pagination connection */
export type Connection = {
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getCollection: Collection;
  getCollections?: Maybe<Array<Collection>>;
  node: Node;
  getDocument: DocumentNode;
  getDocumentList: DocumentConnection;
  getPostsDocument: PostsDocument;
  getPostsList: PostsConnection;
  getAuthorsDocument: AuthorsDocument;
  getAuthorsList: AuthorsConnection;
  getMarketingPagesDocument: MarketingPagesDocument;
  getMarketingPagesList: MarketingPagesConnection;
};


export type QueryGetCollectionArgs = {
  collection?: Maybe<Scalars['String']>;
};


export type QueryNodeArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetDocumentArgs = {
  collection?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetDocumentListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetPostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetPostsListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetAuthorsListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetMarketingPagesDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetMarketingPagesListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type DocumentConnectionEdges = {
  __typename?: 'DocumentConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<DocumentNode>;
};

export type DocumentConnection = Connection & {
  __typename?: 'DocumentConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<DocumentConnectionEdges>>>;
};

export type Collection = {
  __typename?: 'Collection';
  name: Scalars['String'];
  label: Scalars['String'];
  path: Scalars['String'];
  format?: Maybe<Scalars['String']>;
  matches?: Maybe<Scalars['String']>;
  documents: DocumentConnection;
};


export type CollectionDocumentsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type DocumentNode = PostsDocument | AuthorsDocument | MarketingPagesDocument;

export type PostsArticleAuthorDocument = AuthorsDocument;

export type PostsArticle = {
  __typename?: 'PostsArticle';
  title?: Maybe<Scalars['String']>;
  hero?: Maybe<Scalars['String']>;
  author?: Maybe<PostsArticleAuthorDocument>;
};

export type Posts = PostsArticle;

export type PostsDocument = Node & {
  __typename?: 'PostsDocument';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data: Posts;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type PostsConnectionEdges = {
  __typename?: 'PostsConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<PostsDocument>;
};

export type PostsConnection = Connection & {
  __typename?: 'PostsConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<PostsConnectionEdges>>>;
};

export type AuthorsAuthor = {
  __typename?: 'AuthorsAuthor';
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};

export type Authors = AuthorsAuthor;

export type AuthorsDocument = Node & {
  __typename?: 'AuthorsDocument';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data: Authors;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type AuthorsConnectionEdges = {
  __typename?: 'AuthorsConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<AuthorsDocument>;
};

export type AuthorsConnection = Connection & {
  __typename?: 'AuthorsConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<AuthorsConnectionEdges>>>;
};

export type MarketingPagesLandingPageBlocksMessageSeo = {
  __typename?: 'MarketingPagesLandingPageBlocksMessageSeo';
  seoTitle?: Maybe<Scalars['String']>;
};

export type MarketingPagesLandingPageBlocksMessageNestedPageHero = {
  __typename?: 'MarketingPagesLandingPageBlocksMessageNestedPageHero';
  herotitle?: Maybe<Scalars['String']>;
};

export type MarketingPagesLandingPageBlocksMessageNestedPage = MarketingPagesLandingPageBlocksMessageNestedPageHero;

export type MarketingPagesLandingPageBlocksMessage = {
  __typename?: 'MarketingPagesLandingPageBlocksMessage';
  messageHeader?: Maybe<Scalars['String']>;
  messageBody?: Maybe<Scalars['String']>;
  seo?: Maybe<Array<Maybe<MarketingPagesLandingPageBlocksMessageSeo>>>;
  nestedPage?: Maybe<Array<Maybe<MarketingPagesLandingPageBlocksMessageNestedPage>>>;
};

export type MarketingPagesLandingPageBlocksImage = {
  __typename?: 'MarketingPagesLandingPageBlocksImage';
  heading?: Maybe<Scalars['String']>;
  imgDescription?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
};

export type MarketingPagesLandingPageBlocks = MarketingPagesLandingPageBlocksMessage | MarketingPagesLandingPageBlocksImage;

export type MarketingPagesLandingPage = {
  __typename?: 'MarketingPagesLandingPage';
  blocks?: Maybe<Array<Maybe<MarketingPagesLandingPageBlocks>>>;
};

export type MarketingPages = MarketingPagesLandingPage;

export type MarketingPagesDocument = Node & {
  __typename?: 'MarketingPagesDocument';
  id: Scalars['ID'];
  sys?: Maybe<SystemInfo>;
  data: MarketingPages;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type MarketingPagesConnectionEdges = {
  __typename?: 'MarketingPagesConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<MarketingPagesDocument>;
};

export type MarketingPagesConnection = Connection & {
  __typename?: 'MarketingPagesConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<MarketingPagesConnectionEdges>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPendingDocument: DocumentNode;
  updateDocument: DocumentNode;
  updatePostsDocument: PostsDocument;
  updateAuthorsDocument: AuthorsDocument;
  updateMarketingPagesDocument: MarketingPagesDocument;
};


export type MutationAddPendingDocumentArgs = {
  collection: Scalars['String'];
  relativePath: Scalars['String'];
  template?: Maybe<Scalars['String']>;
};


export type MutationUpdateDocumentArgs = {
  collection: Scalars['String'];
  relativePath: Scalars['String'];
  params: DocumentMutation;
};


export type MutationUpdatePostsDocumentArgs = {
  relativePath: Scalars['String'];
  params: PostsMutation;
};


export type MutationUpdateAuthorsDocumentArgs = {
  relativePath: Scalars['String'];
  params: AuthorsMutation;
};


export type MutationUpdateMarketingPagesDocumentArgs = {
  relativePath: Scalars['String'];
  params: MarketingPagesMutation;
};

export type DocumentMutation = {
  posts?: Maybe<PostsMutation>;
  authors?: Maybe<AuthorsMutation>;
  marketingPages?: Maybe<MarketingPagesMutation>;
};

export type PostsArticleMutation = {
  title?: Maybe<Scalars['String']>;
  hero?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
};

export type PostsMutation = {
  article?: Maybe<PostsArticleMutation>;
};

export type AuthorsAuthorMutation = {
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};

export type AuthorsMutation = {
  author?: Maybe<AuthorsAuthorMutation>;
};

export type MarketingPagesLandingPageBlocksMessageSeoMutation = {
  seoTitle?: Maybe<Scalars['String']>;
};

export type MarketingPagesLandingPageBlocksMessageNestedPageHeroMutation = {
  herotitle?: Maybe<Scalars['String']>;
};

export type MarketingPagesLandingPageBlocksMessageNestedPageMutation = {
  hero?: Maybe<MarketingPagesLandingPageBlocksMessageNestedPageHeroMutation>;
};

export type MarketingPagesLandingPageBlocksMessageMutation = {
  messageHeader?: Maybe<Scalars['String']>;
  messageBody?: Maybe<Scalars['String']>;
  seo?: Maybe<Array<Maybe<MarketingPagesLandingPageBlocksMessageSeoMutation>>>;
  nestedPage?: Maybe<Array<Maybe<MarketingPagesLandingPageBlocksMessageNestedPageMutation>>>;
};

export type MarketingPagesLandingPageBlocksImageMutation = {
  heading?: Maybe<Scalars['String']>;
  imgDescription?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
};

export type MarketingPagesLandingPageBlocksMutation = {
  message?: Maybe<MarketingPagesLandingPageBlocksMessageMutation>;
  image?: Maybe<MarketingPagesLandingPageBlocksImageMutation>;
};

export type MarketingPagesLandingPageMutation = {
  blocks?: Maybe<Array<Maybe<MarketingPagesLandingPageBlocksMutation>>>;
};

export type MarketingPagesMutation = {
  landingPage?: Maybe<MarketingPagesLandingPageMutation>;
};


