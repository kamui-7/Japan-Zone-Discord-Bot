export interface SearchResult {
  id: string;
  title: string;
  page: string;
  path: string;
}

export interface LNDetail {
  id: string | null;
  title: string | undefined;
  author: string | undefined;
  link: string;
  desc: string | undefined;
  image: string;
  pageCount: string | undefined;
}
