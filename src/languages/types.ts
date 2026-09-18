import type { languages } from 'monaco-editor';

export interface ILanguageDefinition {
  /** The language's identifier. */
  readonly id: string;

  /** The name of the language. */
  readonly name: string;

  /**
   * Monarch grammar used for tokenizing this language in the `monaco-editor`.\
   * If a string is given the string is used by the editor to identify the language.
   */
  readonly monarchGrammar: languages.IMonarchLanguage;

  readonly defaultProgram: string;
}
