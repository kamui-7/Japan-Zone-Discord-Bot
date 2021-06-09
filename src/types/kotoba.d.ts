import { GuildMember, Role } from 'discord.js';

export interface UserInfo {
  user: GuildMember | undefined;
  roles: Array<Role> | undefined;
  justJoined: boolean;
  needToGetRight: number;
}

export interface FinishInfo {
  quizlevel: number | null;
  player: UserInfo;
  answeredRight: number;
}

export interface FinishEmbedMatch {
  titleMatch: RegExpMatchArray | null;
  descMatch: RegExpMatchArray | null;
}
