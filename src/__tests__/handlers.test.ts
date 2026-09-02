import * as monaco from 'monaco-editor';
import { describe, expect, it, vi } from 'vitest';
import { updateMonarchGrammar } from '../codeHandlers';
import { stringifyMonarchGrammar } from '../languages';
import { source1Language } from '../languages/source';

const mockedSetMonarchTokensProvider = vi.spyOn(monaco.languages, 'setMonarchTokensProvider')
  .mockImplementation(() => { return {} as any; });

describe(updateMonarchGrammar, () => {
  it('works', () => {
    const validGrammar = source1Language.monarchGrammar;
    const jsText = 'return ' + stringifyMonarchGrammar(validGrammar);

    const mockedSetError = vi.fn();
    expect(() => updateMonarchGrammar(jsText, source1Language, mockedSetError)).not.toThrow();
    expect(mockedSetError).toHaveBeenCalledExactlyOnceWith(null);
    expect(mockedSetMonarchTokensProvider).toHaveBeenCalledExactlyOnceWith(source1Language.id, validGrammar);
  });
});
