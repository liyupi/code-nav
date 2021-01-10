/**
 * 等级
 */
export interface LevelType {
  score: number;
  name: string;
  color: string;
}

export const LEVELS = [{
  score: 30,
  name: '1 级',
  color: 'green',
}] as LevelType[];
