/* eslint-disable radix */
import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { AnilistRecommendation, TopLevel } from '../../types/anilist.d';
import {
  getAnilistEmbed,
  fixDesc,
  shuffleArray,
  notFoundEmbed,
} from '../../utils/utils';
import AniList from '../../utils/anilist';

class MangaRecommender implements Command {
  name = 'recommend-manga';

  aliases?: string[] | undefined;

  description = 'Recommends manga from anilist based on a title';

  stringParams: string[];

  limit = 1;

  starFilter = 0;

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromManga = this.stringParams[0];
    const limitRecs = this.stringParams[1];
    const starFilter = this.stringParams[2];

    if (fromManga) {
      if (limitRecs) {
        if (
          !Number.isNaN(parseInt(limitRecs)) &&
          parseInt(limitRecs) <= 5 &&
          parseInt(limitRecs) > 0
        ) {
          this.limit = parseInt(limitRecs);
        }
      } else {
        this.limit = 1;
      }

      if (starFilter) {
        const parsed = parseInt(starFilter.replace(/star_/g, ''));
        if (!Number.isNaN(parsed) && parsed <= 10 && parsed >= 0) {
          this.starFilter = parsed;
        }
      } else {
        this.starFilter = 0;
      }
      return true;
    }
    return false;
  }

  async run(msg: Message): Promise<void> {
    const anilist: AniList = new AniList(this.stringParams[0], 'MANGA');

    try {
      const reccs = await anilist.getReccomendations(this.limit);

      shuffleArray(reccs);
      reccs.forEach((recc: TopLevel) => {
        const modifyedRecc: AnilistRecommendation =
          recc.node.mediaRecommendation;
        modifyedRecc.description = fixDesc(modifyedRecc.description, 300);
        const embed = getAnilistEmbed(modifyedRecc);
        if (modifyedRecc.averageScore / 10 >= this.starFilter) {
          msg.channel.send({ embed });
        }
      });
    } catch (error) {
      notFoundEmbed(msg, 'Recommendation');
    }
  }
}

export default MangaRecommender;
