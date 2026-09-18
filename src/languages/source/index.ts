import type { ILanguageDefinition } from '../types';
import { sourceBaseMonarch, sourceExtendedMonarch } from './monarch';

const sourceDefaultProgram = '// Type your program in here!\n\n';

export const source1Language = {
  id: 'source1',
  name: 'Source §1',
  monarchGrammar: sourceBaseMonarch,
  defaultProgram: sourceDefaultProgram
} satisfies ILanguageDefinition;

export const source2Language = {
  id: 'source2',
  name: 'Source §2',
  monarchGrammar: sourceBaseMonarch,
  defaultProgram: sourceDefaultProgram
} satisfies ILanguageDefinition;

export const source3Language = {
  id: 'source3',
  name: 'Source §3',
  monarchGrammar: sourceExtendedMonarch,
  defaultProgram: sourceDefaultProgram
} satisfies ILanguageDefinition;

export const source4Language = {
  id: 'source4',
  name: 'Source §4',
  monarchGrammar: sourceExtendedMonarch,
  defaultProgram: sourceDefaultProgram
} satisfies ILanguageDefinition;

const sourceLanguage: ILanguageDefinition[] = [
  source1Language,
  source2Language,
  source3Language,
  source4Language
];

export default sourceLanguage;
