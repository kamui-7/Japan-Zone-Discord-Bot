export interface TopLevel {
  node: Node;
}

export interface Node {
  media: Media;
  mediaRecommendation: AnilistRecommendation;
}

export interface Media {
  title: Title;
}

export interface Title {
  native: string;
}

export interface AnilistRecommendationBase {
  id?: number;
  coverImage: CoverImage;
  title: Title;
  siteUrl: string;
  description: string;
  genres: string[];
  averageScore: number;
  popularity: number;
  favourites: number;
  startDate: StartDate;
  eventTime: string;
}

export interface AnilistRecommendationAnime extends AnilistRecommendationBase {
  episodes: string;
  kind: 'anime';
}

export interface AnilistRecommendationManga extends AnilistRecommendationBase {
  volumes: string;
}

export type AnilistRecommendation =
  | AnilistRecommendationAnime
  | AnilistRecommendationManga;

export interface CoverImage {
  color: string;
  extraLarge: string;
  large: string;
  medium: string;
}

export interface StartDate {
  year: number;
  month: number;
  day: number;
}
