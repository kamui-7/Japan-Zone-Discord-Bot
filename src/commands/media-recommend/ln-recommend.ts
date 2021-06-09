/* eslint-disable radix */
import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import LN from '../../utils/ln';
import { getLNEmbed, notFoundEmbed } from '../../utils/utils';
import { LNDetail } from '../../types/ln.d';

class LNRecc implements Command {
  name = 'recommend-ln';

  aliases?: string[] | undefined;

  description = 'Recommends light novels with a title';

  stringParams: string[];

  limit = 1;

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromLN = this.stringParams[0];
    const limitRecs = this.stringParams[1];

    if (fromLN) {
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
      const reccIds = await LN.showDetailsForLN(
        null,
        this.stringParams[0].slice(1, -1),
        true
      );
      (reccIds as string[])
        .slice(0, this.limit)
        .forEach(async (recc: string) => {
          const lnInfo = await LN.showDetailsForLN(recc, '');
          const embed = getLNEmbed(lnInfo as LNDetail);
          msg.channel.send({ embed });
        });
    } catch (error) {
      console.log(error);

      notFoundEmbed(msg, 'Light Novel');
    }
  }
}

export default LNRecc;
