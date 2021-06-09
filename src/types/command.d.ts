import { Message, Client } from 'discord.js';

export interface Command {
  name: string;
  aliases?: string[];
  client?: Client;
  description: string;
  stringParams: string[];
  correctParams(): boolean;
  run(msg: Message): void;
}
