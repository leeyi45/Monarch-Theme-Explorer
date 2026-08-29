import type { languages } from 'monaco-editor';

/**
 * Javascript keywords that are only allowed for Source §1 and Source §2
 */
export const baseKeywords = [
  'const',
  'debugger',
  'else',
  'export',
  'false',
  'from',
  'function',
  'if',
  'import',
  'null',
  'return',
  'true',
  'undefined',
] as const;

/**
 * Javascript keywords that are only allowed for Source §3 and Source §4, excluding those
 * in {@link baseKeywords}.
 */
export const extendedKeywords = [
  'break',
  'continue',
  'for',
  'let',
  'while'
] as const;

/**
 * Javascript keywords that are only allowed for the full variant.
 */
export const fullOnlyKeywords = [
  'async',
  'await',
  'case',
  'catch',
  'class',
  'constructor',
  'default',
  'delete',
  'do',
  'extends',
  'finally',
  'get',
  'in',
  'instanceof',
  'new',
  'of',
  'set',
  'super',
  'switch',
  'symbol',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'with',
  'yield',
] as const;

/**
 * Monarch definition for Source §1 and Source §2
 */
export const sourceBaseMonarch = {
  defaultToken: '',
  tokenPostfix: '.js',

  keywords: baseKeywords,
  illegalKeywords: fullOnlyKeywords,

  illegalOperators: [
    '==', '!=',
    '++', '--',
    '<<', '>>', '>>>',
    '&', '|', '^', '~',
    '+=', '-=', '*=', '**=', '/=', '%=',
    '<<=', '>>=', '>>>=', '&=', '|=', '^='
  ],

  // typeKeywords: [
  //  'any', 'boolean', 'number', 'object', 'string', 'undefined'
  // ],

  operators: [
    '<=', '>=',
    '===', '!==',
    '=>',
    '+', '-', '**', '*', '/', '%',
    '!', '&&', '||', '?', ':', '=',
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}[\]$^|\-*+?.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      [/[{}]/, 'delimiter.bracket'],
      { include: 'common' }
    ],

    common: [
      // `as` is only a keyword in import/export alias clauses, not as a general identifier.
      // [/\bas\b(?=\s+[a-zA-Z_$][\w$]*)/, 'keyword'],

      // identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@illegalKeywords': 'keyword.illegal',
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],
      [/[A-Z][\w$]*/, 'type.identifier'],  // to show class names nicely
      // [/[A-Z][\w\$]*/, 'identifier'],

      // whitespace
      { include: '@whitespace' },

      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [/\/(?=([^\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

      // delimiters and operators
      [/[()[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@illegalOperators': 'operator.illegal',
          '@default': ''
        }
      }],

      // numbers
      [/(@digits)[eE]([-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)/, 'number.hex'],
      [/0[oO]?(@octaldigits)/, 'number.octal'],
      [/0[bB](@binarydigits)/, 'number.binary'],
      [/(@digits)/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/`/, 'string', '@string_backtick'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],

    jsdoc: [
      [/[^/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[/*]/, 'comment.doc']
    ],

    // We match regular expression quite precisely
    regexp: [
      [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
      [/(\[)(\^?)(?=(?:[^\]\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
      [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
      [/[()]/, 'regexp.escape.control'],
      [/@regexpctl/, 'regexp.escape.control'],
      [/[^\\/]/, 'regexp'],
      [/@regexpesc/, 'regexp.escape'],
      [/\\\./, 'regexp.invalid'],
      [/\/(?=\*)/, 'regexp'],
      [
        /(\/)([gimsuy]*)/,
        [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']
      ]
    ],

    regexrange: [
      [/-/, 'regexp.escape.control'],
      [/\^/, 'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop']
    ],

    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop']
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' }
    ],
  },
} satisfies languages.IMonarchLanguage;

/**
 * Monarch definition for Source §3 and Source §4
 */
export const sourceExtendedMonarch = {
  ...sourceBaseMonarch,
  keywords: [...sourceBaseMonarch.keywords, ...extendedKeywords]
} satisfies languages.IMonarchLanguage;
