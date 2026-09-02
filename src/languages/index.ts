import type * as monaco from 'monaco-editor';
import pythonLanguage from './python';
import sourceLanguage from './source';
import type { ILanguageDefinition } from './types';

export const languages: ILanguageDefinition[] = [
  ...sourceLanguage,
  ...pythonLanguage
];

export function stringifyMonarchGrammar(grammar: monaco.languages.IMonarchLanguage): string {
  function stringifyArray(obj: unknown[], indent: string): string {
    return obj.map(each => `${indent}${stringifyValue(each, indent)}`).join(',\n');
  }

  function stringifyValue(obj: any, indent: string): string {
    switch (typeof obj) {
      case 'function':
      case 'symbol':
        throw new Error(`Can't stringify ${typeof obj}`);
      case 'object': {
        if (Array.isArray(obj)) {
          if (obj.length === 0) {
            return '[]';
          } else {
            return `[\n${stringifyArray(obj, indent + '  ')}\n${indent}]`;
          }
        } else if (obj === null) {
          return 'null';
        } else if (obj instanceof RegExp) {
          return obj.toString();
        } else {
          const objStr = Object.entries(obj).map(([key, value]) => {
            const keyStr = /\W/.test(key) ? `'${key}'` : key;

            return `${indent}  ${keyStr}: ${stringifyValue(value, indent + '  ')}`;
          }).join(',\n');

          return `{\n${objStr}\n${indent}}`;
        }
      }
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
        return JSON.stringify(obj);
      case 'undefined':
        return 'undefined';
    }
  }

  return stringifyValue(grammar, '');
}
