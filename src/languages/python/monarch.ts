import type { languages } from 'monaco-editor';

/**
 * Python keywords that are only allowed for Python §1 and Python §2.
 */
export const baseKeywords = [
  'and',
  'as',
  'def',
  'elif',
  'else',
  'from',
  'if',
  'import',
  'lambda',
  'not',
  'or',
  'return',
] as const;

/**
 * Python keywords that are only allowed for Python §3 and Python §4, excluding the
 * ones defined in {@link baseKeywords}.
 */
export const extendedKeywords = [
  'break',
  'continue',
  'for',
  'global',
  'in',
  'is',
  'nonlocal',
  'pass',
  'while',
] as const;

/**
 * Python keywords that are only allowed for the full variant
 */
export const fullOnlyKeywords = [
  'assert',
  'async',
  'await',
  'case',
  'class',
  'del',
  'except',
  'finally',
  'match',
  'raise',
  'try',
  'with',
  'yield',
] as const;

const baseMonarch = {
  defaultToken: '',
  tokenPostfix: '.python',

  operators: [
    '=',
    '+', '-', '//', '/', '*', '**', '%',
    '>', '<', '>=', '<=',
    '==', '!=',
  ],

  illegalOperators: [
    '+=', '-=', '/=', '//=', '*=', '**=',
    '|', '|=',
    '&', '&=',
    '^', '^=',
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

/**
 * Simplified Monarch grammar for Python §1 and Python §2.
 */
export const pythonBaseMonarch = {
  ...baseMonarch,
  keywords: baseKeywords,
  illegalKeywords: [
    ...extendedKeywords,
    ...fullOnlyKeywords
  ]
} satisfies languages.IMonarchLanguage;

/**
 * Extended Monarch grammar for Python §3 and Python §4.
 */
export const pythonExtendedMonarch = {
  ...baseMonarch,
  keywords: [
    ...baseKeywords,
    ...extendedKeywords
  ],
  illegalKeywords: fullOnlyKeywords
} satisfies languages.IMonarchLanguage;
