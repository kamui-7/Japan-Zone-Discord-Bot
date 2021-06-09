import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { getLNEmbed, notFoundEmbed } from '../../utils/utils';

import LN from '../../utils/ln';
import { LNDetail } from '../../types/ln.d';

class LNInfo implements Command {
  name = 'info-ln';

  aliases?: string[] | undefined;

  description = 'Shows information about a LN';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromLN = this.stringParams[0];
    return typeof fromLN !== undefined;
  }

  async run(msg: Message): Promise<void> {
    try {
      const details = await LN.showDetailsForLN(
        null,
        this.stringParams[0].slice(1, -1)
      );
      const embed = getLNEmbed(details as LNDetail);
      msg.channel.send({ embed });
    } catch (error) {
      console.error(error);
      notFoundEmbed(msg, 'Light Novel');
    }
  }
}

export default LNInfo;
