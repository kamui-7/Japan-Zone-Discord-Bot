// @ts-ignore
import { JSDOM } from 'jsdom';
import { Show } from '../types/drama.d';

export default class Drama {
  query: string;

  constructor(query: string) {
    this.query = query;
  }

  async searchShow(): Promise<string | undefined> {
    const { window } = await JSDOM.fromURL(
      encodeURI(
        `https://mydramalist.com/search?q=${this.query}&adv=titles&co=1&so=relevance`
      )
    );
    const { document } = window;
    const res = document.querySelector('h6 > a:nth-child(1)');

    const link = res?.getAttribute('href')?.slice(1);
    return link;
  }

  async getInfo(
    dramaLink: string | null = null,
    onlyReccs = false
  ): Promise<Show | string[] | null> {
    const resLink = dramaLink || (await this.searchShow());

    if (onlyReccs) {
      const { window } = await JSDOM.fromURL(
        `https://mydramalist.com/${resLink}/recs`
      );
      const { document } = window;
      const related = document.querySelectorAll('b > a');
      const reccLinks: string[] = [];
      related.forEach((el) => {
        const link = el.getAttribute('href');
        if (link) {
          reccLinks.push(link);
        }
      });

      return reccLinks;
    }
    if (resLink) {
      const { window } = await JSDOM.fromURL(
        `https://mydramalist.com/${resLink}`
      );
      const { document } = window;
      const showDetails = document.querySelectorAll(
        '#show-detailsxx > div.show-detailsxss > ul:nth-child(1) > li'
      );
      let title: string | null | undefined;
      let genres: string | null | undefined;
      showDetails.forEach((elm) => {
        if (elm.textContent?.startsWith('Native Title:')) {
          title = elm.querySelector('a')?.textContent;
        } else if (elm?.textContent?.startsWith('Genres:')) {
          genres = elm.textContent.replace(/Genres:/, '');
        }
      });
      const overview = document.querySelector(
        '#show-detailsxx > div.show-synopsis > p > span'
      )?.textContent;

      const moreDetails = document.querySelectorAll(
        '#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li'
      );
      let episodes;
      let aired;

      moreDetails.forEach((elm) => {
        if (elm.textContent?.startsWith('Episodes')) {
          episodes = elm.textContent?.replace(/Episodes: /, '');
        } else if (elm.textContent?.startsWith('Aired:')) {
          aired = elm.textContent;
        }
      });

      const rank = document
        .querySelector(
          '#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(3) > div.box-body.light-b > ul > li:nth-child(2)'
        )
        ?.textContent?.replace(/Ranked: /, '');
      const score = document
        .querySelector(
          '#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(3) > div.box-body.light-b > ul > li:nth-child(1)'
        )
        ?.textContent?.replace(/Score: /, '');
      const picture = document
        .querySelector(
          '#content > div > div.container-fluid.title-container > div > div.col-lg-8.col-md-8.col-right > div:nth-child(1) > div.box-body > div > div.col-sm-4.film-cover.cover > a:nth-child(2) > img'
        )
        ?.getAttribute('src');

      return {
        title,
        description: overview,
        episodes,
        rank,
        score,
        picture,
        aired,
        genres,
      } as Show;
    }
    return null;
  }
}
