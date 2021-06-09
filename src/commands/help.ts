import Discord, { Message } from 'discord.js';

import { Command } from '../types/command.d';

class AniHelp implements Command {
  name = 'help';

  description = 'Shows usage info on all anilist commands';

  stringParams: string[];

  helpEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
    .setColor('#3598e8')
    .setTitle('MaidChan usage instructions')
    .addFields(
      {
        name: '`info-anime "{title}"`',
        value: 'Shows information about an anime',
      },
      {
        name: '`info-manga "{title}"`',
        value: `Displays information for manga`,
      },
      {
        name: '`info-vn "{title}"`',
        value: `Displays information for a visual novel`,
      },
      {
        name: '`info-ln "{title}"`',
        value: `Displays information for a light novel`,
      },
      {
        name: '`info-drama "{title}"`',
        value: `Displays information for a drama or movie`,
      },
      {
        name: '`recommend-anime "{title}" [limit] [star_#]`',
        value:
          'Recommends an anime from a title you liked, with an optional limit and star filter.',
      },
      {
        name: '`recommend-manga "{title}" [limit] [star_#]`',
        value: `Recommends manga from a title you liked, with an optional limit and star filter.`,
      },
      {
        name: '`recommend-vn "{title}" [limit]`',
        value: `Recommends visual novels from a title you liked, with an optional limit`,
      },
      {
        name: '`recommend-ln "{title}" [limit]`',
        value: `Recommends light novels from a title you liked, with an optional limit`,
      },
      {
        name: '`recommend-drama "{title}" [limit]`',
        value: `Recommends drama or movies from a title you liked, with an optional limit`,
      },
      {
        name:
          '`create-event "{title}" {drama OR anime} {episodes_streamed} {stream_date} {time}`',
        value:
          'Creates event embed for show being hosted. Provide range of episodes, if its anime or drama, use mm/dd/yyyy for date, and CT time for time',
      },
      {
        name:
          '`reschedule-event "{title}" {drama OR anime} {episodes_streamed} {stream_date} {time}`',
        value:
          'Reschedules event. Provide range of episodes, if its anime or drama, use mm/dd/yyyy for date, and CT time for time',
      },
      {
        name: '`cancel-event`',
        value: 'Cancels event',
      },
      {
        name: '`help`',
        value: 'Shows this help message',
      }
    )
    .setFooter('{} means mandatory \t[] means optional');

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    return this.stringParams.length >= 0;
  }

  run(msg: Message): void {
    msg.channel.send(this.helpEmbed);
  }
}

export default AniHelp;
