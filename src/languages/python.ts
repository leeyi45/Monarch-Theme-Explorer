import type { languages } from 'monaco-editor';

import type { ILanguageDefinition } from './types';

export const pythonKeywords = [
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'case',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'in',
  'is',
  'import',
  'lambda',
  'match',
  'nonlocal',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield',
] as const;

export const pythonMonarch = {
  defaultToken: '',
  tokenPostfix: '.python',

  keywords: pythonKeywords,

  operators: [
    '=',
    '+', '-', '//', '/', '*', '**', '%',
    '>', '<', '>=', '<=',
    '==', '!=',
    '+=', '-=', '/=', '//=', '*=', '**=',
    '|', '|=',
    '&', '&=',
    '^', '^=',
    '@', '@='
  ],

  constants: ['True', 'False', 'None'],

  brackets: [
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.bracket' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' }
  ],

  symbols: /[<>=/\-+*%^|&!]+/,

  tokenizer: {
    root: [
      { include: '@whitespace' },
      { include: '@numbers' },
      { include: '@strings' },

      [/[,:;]/, 'delimiter'],
      [/[{}[]()]/, '@brackets'],

      [/@[a-zA-Z]\w*/, 'tag'],
      [/[a-zA-Z]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@constants': 'constant',
          '@illegalKeywords': 'keyword.illegal',
          '@default': 'identifier'
        }
      }],
      [/@symbols/, {
        cases: {
          '@illegalOperators': 'operator.illegal',
          '@operators': 'operator'
        }
      }]
    ],

    // Deal with white space, including single and multi-line comments
    whitespace: [
      [/\s+/, 'white'],
      [/(^#.*$)/, 'comment'],
      [/('''.*''')|(""".*""")/, 'string'],
      [/'''.*$/, 'string', '@endDocString'],
      [/""".*$/, 'string', '@endDblDocString']
    ],
    endDocString: [
      [/\\'/, 'string'],
      [/.*'''/, 'string', '@popall'],
      [/.*$/, 'string']
    ],
    endDblDocString: [
      [/\\"/, 'string'],
      [/.*"""/, 'string', '@popall'],
      [/.*$/, 'string']
    ],

    // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
    numbers: [
      [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
      [/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?/, 'number']
    ],

    // Recognize strings, including those broken across lines with \ (but not without)
    strings: [
      [/'$/, 'string.escape', '@popall'],
      [/'/, 'string.escape', '@stringBody'],
      [/"$/, 'string.escape', '@popall'],
      [/"/, 'string.escape', '@dblStringBody']
    ],
    stringBody: [
      [/[^\\']+$/, 'string', '@popall'],
      [/[^\\']+/, 'string'],
      [/\\./, 'string'],
      [/'/, 'string.escape', '@popall'],
      [/\\$/, 'string']
    ],
    dblStringBody: [
      [/[^\\"]+$/, 'string', '@popall'],
      [/[^\\"]+/, 'string'],
      [/\\./, 'string'],
      [/"/, 'string.escape', '@popall'],
      [/\\$/, 'string']
    ]
  }
} satisfies languages.IMonarchLanguage;

export const pythonLanguage = {
  id: 'python',
  name: 'Python',
  monarchGrammar: pythonMonarch,
  defaultProgram: '# Type your program here!\n'
} satisfies ILanguageDefinition;
