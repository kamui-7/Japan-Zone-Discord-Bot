import fetch from 'node-fetch';
// import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import { LNDetail, SearchResult } from '../types/ln.d';
import { shuffleArray } from './utils';

export default class LN {
  static async searchLN(title: string): Promise<SearchResult> {
    const res = await fetch(
      encodeURI(`https://bookmeter.com/search?keyword=${title}`)
    );
    const data = await res.json();

    const searchResult: SearchResult = data.resources[0].contents.book;

    return searchResult;
  }

  static async showDetailsForLN(
    id: string | null = null,
    title = '',
    onlyReccs = false
  ): Promise<LNDetail | string[]> {
    let lookupID: string | null = id;
    if (id === null) {
      const res = await LN.searchLN(title);
      lookupID = res.id;
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(encodeURI(`https://bookmeter.com/books/${lookupID}`));

    if (onlyReccs) {
      const reccs: string[] = await page.evaluate(() => {
        const listItems = document.querySelectorAll(
          '.sidebars.groups.book > .book__thumbnail > a'
        );
        const recommendationIds: Array<string> = [];
        listItems.forEach((elm) => {
          const link = elm.getAttribute('href');
          if (link) {
            recommendationIds.push(link.replace(/\/books\//, ''));
          }
        });
        return recommendationIds;
      });
      return shuffleArray(reccs);
    }

    const results: LNDetail = await page.evaluate((bookID) => {
      const titleA = document.querySelector(
        'body > section.books.show > header > div.header__inner > h1'
      );

      const titleText = titleA?.innerHTML;
      const bookMeterLink = `https://bookmeter.com/books/${bookID}`;
      const desc = document.querySelector(
        'body > section.books.show > div.bm-wrapper > div.bm-wrapper__side > div > section:nth-child(1) > div.group__detail > dl > dd.bm-details-side__item.bm-details-side__item--full > div > div > p'
      )?.innerHTML;
      const image = document
        .querySelector(
          'body > section.books.show > div.bm-wrapper > div.bm-wrapper__side > div > section:nth-child(1) > div.group__image > a > img'
        )
        ?.getAttribute('src')
        ?.toString();
      const pageCount = document.querySelector(
        'body > section.books.show > div.bm-wrapper > div.bm-wrapper__side > div > section:nth-child(1) > div.group__detail > dl > dd:nth-child(4) > span:nth-child(1)'
      )?.innerHTML;
      const author = document.querySelector(
        'body > section.books.show > header > div.header__inner > ul > li > a'
      )?.innerHTML;

      return {
        id: bookID,
        title: titleText,
        link: bookMeterLink,
        desc,
        author,
        image: image || '',
        pageCount,
      };
    }, lookupID);
    browser.close();

    return results;
  }
}
