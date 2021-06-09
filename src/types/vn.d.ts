export interface SearchResult {
  id: string;
  title: string;
  page: string;
}

export interface VNDetail {
  id: string | null;
  title: string;
  link: string;
  desc: string;
  image: string;
  year: string;
  avgRating: string;
  totalVotes: string;
}

export interface HowLongToBeatEntry {
  id: string;
  name: string;
  imageUrl: string;
  timeLabels: Array<string[]>;
  gameplayMain: number;
  gameplayMainExtra: number;
  gameplayCompletionist: number;
  similarity: number;
}
