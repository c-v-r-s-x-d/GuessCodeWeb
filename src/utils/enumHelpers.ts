import { KataDifficulty, ProgrammingLanguage, KataType } from '../services/api.generated';

export const getDifficultyLabel = (difficulty: KataDifficulty): string => {
  switch (difficulty) {
    case KataDifficulty.Value1:
      return 'FifthKyu';
    case KataDifficulty.Value2:
      return 'FourthKyu';
    case KataDifficulty.Value3:
      return 'ThirdKyu';
    case KataDifficulty.Value4:
      return 'SecondKyu';
    case KataDifficulty.Value5:
      return 'FirstKyu';
    case KataDifficulty.Value6:
      return 'FirstDan';
    case KataDifficulty.Value7:
      return 'SecondDan';
    case KataDifficulty.Value20:
      return 'Master';
    default:
      return 'Unknown';
  }
};

export const getLanguageLabel = (language: ProgrammingLanguage): string => {
  switch (language) {
    case ProgrammingLanguage.Value1:
      return 'JavaScript';
    case ProgrammingLanguage.Value2:
      return 'TypeScript';
    case ProgrammingLanguage.Value3:
      return 'Python';
    case ProgrammingLanguage.Value4:
      return 'Java';
    default:
      return 'Unknown';
  }
};

export const getKataTypeLabel = (type: KataType): string => {
  switch (type) {
    case KataType.Value1:
      return 'Code Reading';
    case KataType.Value2:
      return 'Bug Finding';
    case KataType.Value3:
      return 'Code Optimization';
    default:
      return 'Unknown';
  }
}; 