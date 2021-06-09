import { Message } from 'discord.js';
import { Command } from '../../types/command.d';
import { notValidEmbed } from '../../utils/utils';
import EventHelper from '../../utils/eventHelper';

class CancelEvent implements Command {
  name = 'cancel-event';

  aliases?: string[] | undefined;

  description = 'Cancels event for server';

  stringParams: string[];

  eventHelper: EventHelper;

  constructor(prms: string[], eventHelper: EventHelper) {
    this.stringParams = prms;
    this.eventHelper = eventHelper;
  }

  correctParams(): boolean {
    return this.stringParams.length > -1;
  }

  async run(msg: Message): Promise<void> {
    if (msg.member?.roles.cache.has('732649305625722900')) {
      this.eventHelper.cancelEvent(msg);
    } else {
      notValidEmbed(msg);
    }
  }
}

export default CancelEvent;
