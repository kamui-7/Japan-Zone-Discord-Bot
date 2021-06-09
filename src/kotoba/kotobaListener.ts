import { Message, Role, GuildMember } from 'discord.js';
import { FinishInfo, UserInfo, FinishEmbedMatch } from '../types/kotoba.d';

class KotobaListener {
  private kMessage: Message;

  private titlere = /JLPT (N[1-5]) Reading Quiz Ended/;

  private descre = /The score limit of 10 was reached by <@(\d*)>. Congratulations!/;

  private finishEmbedMatch: FinishEmbedMatch;

  public constructor(msg: Message) {
    this.kMessage = msg;
    this.finishEmbedMatch = this.getFinishEmbedMatch();
  }

  getPlayerInfo(): UserInfo {
    let userWhoPassed: GuildMember | undefined;
    if (this.finishEmbedMatch.descMatch) {
      userWhoPassed = this.kMessage.guild?.members.cache.get(
        this.finishEmbedMatch.descMatch[1]
      );
    }
    const rolesTheyHad = userWhoPassed?.roles.cache.array();
    const userJustJoined = !!rolesTheyHad?.find((e) => e.name === 'Unverified');
    const needToGetRight = userJustJoined ? 7 : 10;

    return {
      user: userWhoPassed,
      roles: rolesTheyHad,
      justJoined: userJustJoined,
      needToGetRight,
    };
  }

  hasGameEnded(): boolean {
    return (
      !!this.finishEmbedMatch.titleMatch && !!this.finishEmbedMatch.descMatch
    );
  }

  getFinishEmbedMatch(): FinishEmbedMatch {
    const { title } = this.kMessage.embeds[0];
    const { description } = this.kMessage.embeds[0];
    let matchedTitle: RegExpMatchArray | null = null;
    let matchedDescription: RegExpMatchArray | null = null;
    if (!!title && !!description) {
      matchedTitle = title.match(this.titlere);

      matchedDescription = description.match(this.descre);
    }

    return {
      titleMatch: matchedTitle,
      descMatch: matchedDescription,
    };
  }

  getFinishInfo(): FinishInfo {
    let nLevel: number | null = null;
    if (this.finishEmbedMatch.titleMatch !== null) {
      // eslint-disable-next-line radix
      nLevel = Number.parseInt(this.finishEmbedMatch.titleMatch[1]);
    }
    const player = this.getPlayerInfo();
    const answeredRight = this.getNumAnsweredRight();
    return {
      quizlevel: nLevel,
      player,
      answeredRight,
    };
  }

  getNumAnsweredRight(): number {
    const flds = this.kMessage.embeds[0].fields.find((el) =>
      el.name.startsWith('Unanswered')
    );
    const numofunansweredQuestions = flds ? flds.value.split('\n').length : 0;
    return 10 - numofunansweredQuestions;
  }

  getUnverifiedRole(): Role | undefined {
    return this.kMessage.guild?.roles.cache
      .array()
      .find((e) => e.name === 'Unverified');
  }

  getQuizRole(): Role | undefined {
    let n: string;
    let nrole: Role | undefined;
    if (this.finishEmbedMatch.titleMatch) {
      // eslint-disable-next-line prefer-destructuring
      n = this.finishEmbedMatch.titleMatch[1];

      nrole = this.kMessage.guild?.roles.cache.find((role) => role.name === n);
    }
    return nrole;
  }

  static getJlptRoleTheyHad(user: UserInfo): Role | undefined {
    return user.roles?.find(
      (e) =>
        e.name.charAt(0) === 'N' &&
        e.name.length === 2 &&
        // eslint-disable-next-line radix
        !Number.isNaN(parseInt(e.name.charAt(1)))
    );
  }
}

export default KotobaListener;
