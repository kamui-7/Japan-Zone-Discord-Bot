import Axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { SearchResult, VNDetail } from '../types/vn.d';

export default class VN {
  static async searchVN(title: string): Promise<SearchResult> {
    const res: AxiosResponse<any> = await Axios.get(
      `https://vnstat.net/search/novel/${title}`
    );
    const searchResult: SearchResult = res.data[0];
    return searchResult;
  }

  static async showDetailsForVN(
    id: string | null = null,
    title = '',
    onlyReccs = false
  ): Promise<VNDetail | string[]> {
    let lookupID: string | null = id;
    if (id === null) {
      const res = await VN.searchVN(title);
      lookupID = res.id;
    }
    const detailRes = await Axios.get(`https://vnstat.net/novel/${lookupID}`);
    const html: string = detailRes.data;
    const $ = cheerio.load(html);

    if (onlyReccs) {
      const recs = $('.card-title', '#sim-combined > div')
        .toArray()
        .map((elm) => elm.attribs.href.replace(/\/novel\//, ''));

      return recs;
    }
    const titleA = $(
      'body > div.container > div > div.col-md-3.col-lg-2.sidebar > div > h3 > a'
    );
    const titleText = titleA.text();
    const vndbLink = `https://vndb.org/v${lookupID}`;
    const desc = $('#summary > div.row.text-center > small > p').text();
    const image = $(
      'body > div.container > div > div.col-md-3.col-lg-2.sidebar > div > img'
    )
      .attr('src')
      ?.toString();
    const year = $(
      'body > div.container > div > div.col-md-3.col-lg-2.sidebar > div > h3 > small'
    ).text();
    const avgRating = $(
      'body > div.container > div > div.col-md-3.col-lg-2.sidebar > div > p:nth-child(3) > span:nth-child(2)'
    ).text();
    const totalVotes = $(
      'body > div.container > div > div.col-md-3.col-lg-2.sidebar > div > p:nth-child(4) > span.pull-right.text-right'
    ).text();

    return {
      id: lookupID,
      title: titleText,
      link: vndbLink,
      desc,
      image: image || '',
      year,
      avgRating,
      totalVotes,
    };
  }
}
