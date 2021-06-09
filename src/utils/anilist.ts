import { AnilistRecommendation, TopLevel } from '../types/anilist.d';
import { sendGraphQL } from './utils';

export default class AniList {
  baseURL = 'https://graphql.anilist.co';

  query: string;

  type: string;

  constructor(query: string, type: string) {
    this.query = query;
    this.type = type;
  }

  async getReccomendations(limit: number): Promise<TopLevel[]> {
    const res = await this.getInfo();

    const { id } = res;
    // const basedOfTitle = res.data.data.Media.title.native;

    const recommendations = await sendGraphQL(
      this.baseURL,
      this.getReccQuery(),
      {
        id,
      }
    );

    const reccs = <TopLevel[]>(
      recommendations.data.data.Media.recommendations.edges
    );

    return limit > reccs.length ? reccs : reccs.slice(0, limit);
  }

  async getInfo(): Promise<AnilistRecommendation> {
    const res = await sendGraphQL(this.baseURL, this.getSearchQuery(), {
      txt: this.query.slice(1, -1),
    });
    return res.data.data.Media;
  }

  getSearchQuery(): string {
    const searchQuery = `
    query ($txt: String) {
      Media(search:$txt, type:${this.type}){
        id,
        title{
          native
        }
        coverImage {
          color
          extraLarge
          large
          medium
      }
      title {
          native
      }
      siteUrl
      description
      ${this.type === 'MANGA' ? 'volumes' : 'episodes'}
      averageScore
      popularity
      favourites
      startDate {
          year
          month
          day
      }
      }
    }
    `;
    return searchQuery;
  }

  getReccQuery(): string {
    const reccQuery = `
    query ($id: Int) {
        Media(id: $id, type: ${this.type}) {
        recommendations {
            edges {
            node {
                media {
                title {
                    native
                }
                }
                mediaRecommendation {
                coverImage {
                    color
                    extraLarge
                    large
                    medium
                }
                title {
                    native
                }
                siteUrl
                description
                ${this.type === 'MANGA' ? 'volumes' : 'episodes'}
                genres
                averageScore
                popularity
                favourites
                startDate {
                    year
                    month
                    day
                }
                }
            }
            }
        }
        }
    }
  `;
    return reccQuery;
  }
}
