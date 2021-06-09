// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';

class GameDuration {
  query: string;

  hltbService: HowLongToBeatService;

  constructor(query: string) {
    this.query = query;
    this.hltbService = new HowLongToBeatService();
  }

  async findGameDurationInfo(): Promise<HowLongToBeatEntry> {
    const data: Array<HowLongToBeatEntry> = await this.hltbService.search(
      this.query
    );
    return data[0];
  }
}

export default GameDuration;
