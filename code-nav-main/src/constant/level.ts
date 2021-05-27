export interface LevelType {
  score: number;
  name: string;
  color: string;
}

export const LEVELS = [{
  score: 30,
  name: '1 级',
  color: 'green',
}, {
  score: 100,
  name: '2 级',
  color: 'cyan',
}] as LevelType[];
