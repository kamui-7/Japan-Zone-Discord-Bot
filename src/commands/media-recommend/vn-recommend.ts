/* eslint-disable radix */
import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import VN from '../../utils/vn';
import GameDuration from '../../utils/durationGame';
import { VNDetail } from '../../types/vn.d';
import { getVNEmbed, notFoundEmbed, shuffleArray } from '../../utils/utils';

class VNRecc implements Command {
  name = 'recommend-vn';

  aliases?: string[] | undefined;

  description = 'Recommends visual novels from vndb with a title';

  stringParams: string[];

  limit = 1;

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromVN = this.stringParams[0];
    const limitRecs = this.stringParams[1];

    if (fromVN) {
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
      const reccIds = await VN.showDetailsForVN(
        null,
        this.stringParams[0].slice(1, -1),
        true
      );
      shuffleArray(reccIds as string[])
        .slice(0, this.limit)
        .forEach(async (recc: string) => {
          const vnInfo = await VN.showDetailsForVN(recc, '');
          const duration = new GameDuration((vnInfo as VNDetail).title);
          const playTime = await duration.findGameDurationInfo();
          const embed = getVNEmbed(vnInfo as VNDetail, playTime);
          msg.channel.send({ embed });
        });
    } catch (error) {
      notFoundEmbed(msg, 'Visual Novel');
    }
  }
}

export default VNRecc;
