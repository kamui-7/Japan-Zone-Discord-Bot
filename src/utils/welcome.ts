import {
  MessageEmbed,
  GuildMember,
  PartialGuildMember,
  Channel,
  TextChannel,
} from 'discord.js';

const welcome = (
  member: GuildMember | PartialGuildMember,
  channel: string,
  title: string,
  description: string
): void => {
  const txtChannel: Channel | undefined = member.guild.channels.cache.get(
    channel
  );
  if (member.user) {
    const welcomeEmbed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor('#e0b04a');
    if (txtChannel instanceof TextChannel)
      txtChannel.send({ embed: welcomeEmbed });
  }
};
export default welcome;
