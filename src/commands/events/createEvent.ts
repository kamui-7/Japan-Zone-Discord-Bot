import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { fixDesc, getEventEmbed, notValidEmbed } from '../../utils/utils';
import AniList from '../../utils/anilist';
import { AnilistRecommendationAnime } from '../../types/anilist.d';
import EventHelper from '../../utils/eventHelper';
import { Show } from '../../types/drama.d';
import Drama from '../../utils/drama';

class CreateEvent implements Command {
  name = 'create-event';

  aliases?: string[] | undefined;

  description = 'Creates event for server';

  stringParams: string[];

  eventHelper: EventHelper;

  constructor(prms: string[], eventHelper: EventHelper) {
    this.stringParams = prms;
    this.eventHelper = eventHelper;
  }

  correctParams(): boolean {
    const fromAnime = this.stringParams[0];
    const type = this.stringParams[1];
    return typeof fromAnime !== undefined && ['drama', 'anime'].includes(type);
  }

  async run(msg: Message): Promise<void> {
    if (msg.member?.roles.cache.has('732649305625722900')) {
      let res: AnilistRecommendationAnime | Show;
      if (this.stringParams[1] === 'anime') {
        const anilist: AniList = new AniList(this.stringParams[0], 'ANIME');
        res = (await anilist.getInfo()) as AnilistRecommendationAnime;
      } else {
        const dramalist: Drama = new Drama(this.stringParams[0]);
        res = (await dramalist.getInfo()) as Show;
      }

      res.description = fixDesc(res.description || '', 300);
      const episodesToStream = this.stringParams[2];
      const mmddyyyy = this.stringParams[3];
      const time = this.stringParams[4];
      const date = new Date(`${`${mmddyyyy} ${time}`}`);
      const embed = getEventEmbed(
        res,
        episodesToStream,
        mmddyyyy,
        time,
        msg.author.id,
        this.stringParams[1]
      );
      this.eventHelper.addEvent(msg, date, embed);
    } else {
      notValidEmbed(msg);
    }
  }
}

export default CreateEvent;
