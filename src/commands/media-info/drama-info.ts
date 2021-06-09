import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { notFoundEmbed, getDramaEmbed } from '../../utils/utils';
import Drama from '../../utils/drama';
import { Show } from '../../types/drama.d';

class DramaInfo implements Command {
  name = 'info-drama';

  aliases?: string[] | undefined;

  description = 'Shows information about a drama';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromDrama = this.stringParams[0];
    return typeof fromDrama !== undefined;
  }

  async run(msg: Message): Promise<void> {
    const drama: Drama = new Drama(this.stringParams[0].slice(1, -1));
    try {
      const res = await drama.getInfo();

      const embed = getDramaEmbed(res as Show);

      msg.channel.send({ embed });
    } catch (error) {
      console.log(error);

      notFoundEmbed(msg, 'Drama');
    }
  }
}

export default DramaInfo;
