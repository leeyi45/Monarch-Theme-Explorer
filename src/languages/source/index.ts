import type { ILanguageDefinition } from '../types';
import { sourceBaseMonarch, sourceExtendedMonarch } from './monarch';

const sourceDefaultProgram = '// Type your program in here!\n\n';

export const source1Language: ILanguageDefinition = {
  id: 'source1',
  name: 'Source §1',
  monarchGrammar: sourceBaseMonarch,
  defaultProgram: sourceDefaultProgram
};

export const source2Language: ILanguageDefinition = {
  id: 'source2',
  name: 'Source §2',
  monarchGrammar: sourceBaseMonarch,
  defaultProgram: sourceDefaultProgram
};

export const source3Language: ILanguageDefinition = {
  id: 'source3',
  name: 'Source §3',
  monarchGrammar: sourceExtendedMonarch,
  defaultProgram: sourceDefaultProgram
};

export const source4Language: ILanguageDefinition = {
  id: 'source4',
  name: 'Source §4',
  monarchGrammar: sourceExtendedMonarch,
  defaultProgram: sourceDefaultProgram
};

const sourceLanguage: ILanguageDefinition[] = [
  source1Language,
  source2Language,
  source3Language,
  source4Language
];

export default sourceLanguage;
