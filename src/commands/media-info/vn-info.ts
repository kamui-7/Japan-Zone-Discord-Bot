import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { getVNEmbed, notFoundEmbed } from '../../utils/utils';
import GameDuration from '../../utils/durationGame';

import VN from '../../utils/vn';
import { VNDetail } from '../../types/vn.d';

class VNInfo implements Command {
  name = 'info-vn';

  aliases?: string[] | undefined;

  description = 'Shows information about a VN';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromVN = this.stringParams[0];
    return typeof fromVN !== undefined;
  }

  async run(msg: Message): Promise<void> {
    const duration = new GameDuration(this.stringParams[0].slice(1, -1));

    try {
      const details = await VN.showDetailsForVN(
        null,
        this.stringParams[0].slice(1, -1)
      );
      const playTime = await duration.findGameDurationInfo();
      const embed = getVNEmbed(details as VNDetail, playTime);
      msg.channel.send({ embed });
    } catch (error) {
      notFoundEmbed(msg, 'Visual Novel');
    }
  }
}

export default VNInfo;
