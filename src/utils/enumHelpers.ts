import { KataDifficulty, ProgrammingLanguage, KataType } from '../services/api.generated';
import { MentorAvailability } from '../services/api.generated';

export const getDifficultyLabel = (difficulty: KataDifficulty): string => {
  switch (difficulty) {
    case KataDifficulty._1:
      return 'FifthKyu';
    case KataDifficulty._2:
      return 'FourthKyu';
    case KataDifficulty._3:
      return 'ThirdKyu';
    case KataDifficulty._4:
      return 'SecondKyu';
    case KataDifficulty._5:
      return 'FirstKyu';
    case KataDifficulty._6:
      return 'FirstDan';
    case KataDifficulty._7:
      return 'SecondDan';
    case KataDifficulty._20:
      return 'Master';
    default:
      return 'Unknown';
  }
};

export const getLanguageLabel = (language: ProgrammingLanguage): string => {
  switch (language) {
    case ProgrammingLanguage._1:
      return 'C++';
    case ProgrammingLanguage._2:
      return 'C#';
    case ProgrammingLanguage._3:
      return 'Python';
    case ProgrammingLanguage._4:
      return 'Java';
    default:
      return 'Unknown';
  }
};

export const getKataTypeLabel = (type: KataType): string => {
  switch (type) {
    case KataType._1:
      return 'Code Reading';
    case KataType._2:
      return 'Bug Finding';
    default:
      return 'Unknown';
  }
};

export const getPrismLanguage = (language: ProgrammingLanguage): string => {
  switch (language) {
    case ProgrammingLanguage._1:
      return 'cpp';
    case ProgrammingLanguage._2:
      return 'csharp';
    case ProgrammingLanguage._3:
      return 'python';
    case ProgrammingLanguage._4:
      return 'java';
    default:
      return 'clike';
  }
};

export function getMentorAvailabilityLabel(availability: MentorAvailability): string {
  switch (availability) {
    case 0: // OneHourPerWeek
      return '1 hour per week';
    case 1: // TwoHoursPerWeek
      return '2 hours per week';
    case 2: // ThreeHoursPerWeek
      return '3 hours per week';
    case 3: // FourHoursPerWeek
      return '4 hours per week';
    case 4: // MoreHoursPerWeek
      return 'More hour per week';
    default:
      return 'Неизвестно';
  }
} 