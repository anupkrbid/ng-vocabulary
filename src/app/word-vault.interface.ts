export interface WordVault {
  title: string;
  directions: string;
  directionsAudio: string;
  sfxPool: SfxPool;
  vaultImage: string;
  rounds: { [key: string]: Round };
}

export interface Round {
  questions: Question[];
}

export interface Question {
  text: string;
  answers: Answer[];
  correctAnswer: string;
}

export enum Answer {
  Danger = 'danger',
  Partner = 'partner',
  Special = 'special',
  Splendid = 'splendid'
}

export interface SfxPool {
  '@value': string;
}
