/* eslint-disable radix */
import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { notFoundEmbed, getDramaEmbed } from '../../utils/utils';
import Drama from '../../utils/drama';
import { Show } from '../../types/drama.d';

class ShowRecc implements Command {
  name = 'recommend-drama';

  aliases?: string[] | undefined;

  description = 'Recommends a show or a movie with a title';

  stringParams: string[];

  limit = 1;

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromShow = this.stringParams[0];
    const limitRecs = this.stringParams[1];

    if (fromShow) {
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

      return true;
    }
    return false;
  }

  async run(msg: Message): Promise<void> {
    try {
      const drama = new Drama(this.stringParams[0].slice(1, -1));
      const reccIds = await drama.getInfo(null, true);
      (reccIds as string[])
        .slice(0, this.limit)
        .forEach(async (recc: string) => {
          const dramaInfo = await drama.getInfo(recc);
          const embed = getDramaEmbed(dramaInfo as Show);
          msg.channel.send({ embed });
        });
    } catch (error) {
      console.log(error);

      notFoundEmbed(msg, 'Show');
    }
  }
}

export default ShowRecc;
