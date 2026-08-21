import type { ILanguageDefinition } from '../types';
import { pythonBaseMonarch, pythonExtendedMonarch } from './monarch';

const pythonDefaultProgram = '# Type your program in here!\n\n';

export const python1Language: ILanguageDefinition = {
  id: 'python1',
  name: 'Python §1',
  monarchGrammar: pythonBaseMonarch,
  defaultProgram: pythonDefaultProgram
};

export const python2Language: ILanguageDefinition = {
  id: 'python2',
  name: 'Python §2',
  monarchGrammar: pythonBaseMonarch,
  defaultProgram: pythonDefaultProgram
};

export const python3Language: ILanguageDefinition = {
  id: 'python3',
  name: 'Python §3',
  monarchGrammar: pythonExtendedMonarch,
  defaultProgram: pythonDefaultProgram
};

export const python4Language: ILanguageDefinition = {
  id: 'python4',
  name: 'Python §4',
  defaultProgram: pythonDefaultProgram,
  monarchGrammar: pythonExtendedMonarch,
};

export const pythonFullLanguage: ILanguageDefinition = {
  id: 'pythonFull',
  name: 'Python',
  monarchGrammar: 'python',
  defaultProgram: pythonDefaultProgram,
};

const pythonLanguage: ILanguageDefinition[] = [
  python1Language,
  python2Language,
  python3Language,
  python4Language,
  pythonFullLanguage,
];

export default pythonLanguage;
