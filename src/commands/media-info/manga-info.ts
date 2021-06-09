import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { getAnilistEmbed, fixDesc, notFoundEmbed } from '../../utils/utils';
import AniList from '../../utils/anilist';

class MangaInfo implements Command {
  name = 'info-manga';

  aliases?: string[] | undefined;

  description = 'Shows information about a manga';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromManga = this.stringParams[0];
    return typeof fromManga !== undefined;
  }

  async run(msg: Message): Promise<void> {
    const anilist: AniList = new AniList(this.stringParams[0], 'MANGA');
    try {
      const res = await anilist.getInfo();
      res.description = fixDesc(res.description, 300);

      const embed = getAnilistEmbed(res);

      msg.channel.send({ embed });
    } catch (error) {
      notFoundEmbed(msg, 'Manga');
    }
  }
}

export default MangaInfo;
