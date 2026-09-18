import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render, type RenderResult } from 'vitest-browser-react';

import ColourInputBox from '../ThemeConfig/ColourInput';
import OptionAdder from '../ThemeConfig/OptionAdder';
import ThemeRuleSelector from '../ThemeConfig/ThemeRuleSelector';

interface ColourInputBoxWrapperProps {
  initialValue: string;
  onChange: (newValue: string) => void;
}

function ColourInputBoxWrapper({ initialValue, onChange }: ColourInputBoxWrapperProps) {
  const [value, setValue] = useState(initialValue);
  return <ColourInputBox label='' value={value} onChange={newValue => {
    setValue(newValue);
    onChange(newValue);
  }} />;
}

function findInputByValue(renderResult: RenderResult, value: string) {
  const inputElements = renderResult.baseElement.getElementsByTagName('input');

  for (const each of inputElements) {
    if (each.value === value) {
      return each;
    }
  }

  return null;
}

describe(ColourInputBox, () => {
  const getInputElement = vi.defineHelper(async (initialValue: string = '') => {
    const confirmer = vi.fn();
    const renderResult = await render(<ColourInputBoxWrapper initialValue={initialValue} onChange={confirmer} />);
    const inputElement = renderResult.baseElement.getElementsByTagName('input').item(0) as HTMLInputElement;
    expect(inputElement).not.toBeNull();
    await userEvent.click(inputElement);

    return { inputElement, confirmer };
  });

  it('pressing enter confirms', async () => {
    const { inputElement, confirmer } = await getInputElement();
    await userEvent.keyboard('FFFFFF[Enter]');

    expect(inputElement.value).toEqual('FFFFFF');
    expect(confirmer).toHaveBeenCalledExactlyOnceWith('FFFFFF');
  });

  it('turns lowercase to uppercase', async () => {
    const { inputElement } = await getInputElement();
    await userEvent.keyboard('aaBBcc[Enter]');

    expect(inputElement.value).toEqual('AABBCC');
  });

  it('won\'t accept non hex characters into the field', async () => {
    const { inputElement } = await getInputElement();

    await userEvent.keyboard('GGGGGG');
    expect(inputElement.value).toEqual('');
  });

  it('resets when invalid hex is set', async () => {
    const { inputElement, confirmer } = await getInputElement();

    await userEvent.keyboard('FFFFF[Enter]');
    expect(inputElement.value).toEqual('');
    expect(confirmer).not.toHaveBeenCalled();
  });
});

describe(OptionAdder, () => {
  const itWithRender = it
    .extend('onConfirm', () => vi.fn())
    .extend('currentRules', () => ['token1'])
    .extend('renderResult', ({ onConfirm, currentRules }) => render(<OptionAdder onConfirm={onConfirm} currentRules={currentRules} />));

  const getTokenField = vi.defineHelper((renderResult: RenderResult) => {
    const tokenInput = findInputByValue(renderResult, 'token');
    expect(tokenInput).not.toBeNull();
    return tokenInput!;
  });

  itWithRender('works', async ({ renderResult, onConfirm }) => {
    const tokenInput = getTokenField(renderResult);
    await userEvent.click(tokenInput);

    await userEvent.keyboard('2[Enter]');

    const addIcon = renderResult.getByTestId('AddIcon');
    await userEvent.click(addIcon);

    expect(onConfirm).toHaveBeenCalledExactlyOnceWith({
      token: 'token2',
      enabled: true,
      bg: {
        value: '000000',
        enabled: true
      },
      fg: {
        value: '000000',
        enabled: true
      }
    });
  });

  itWithRender('won\'t accept a token that already exists', async ({ renderResult, onConfirm }) => {
    const tokenInput = getTokenField(renderResult);
    await userEvent.click(tokenInput);

    await userEvent.keyboard('1[Enter]');
    const addIcon = renderResult.getByTestId('AddIcon');
    expect(addIcon.element().parentElement).toBeDisabled();
    expect(() => renderResult.getByText('A rule already exists for token1!').element()).not.toThrow();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  itWithRender('won\'t accept a blank token', async ({ renderResult, onConfirm }) => {
    const tokenInput = getTokenField(renderResult);
    await userEvent.click(tokenInput);

    await userEvent.keyboard('[Backspace>5\][Enter]');
    const addIcon = renderResult.getByTestId('AddIcon');
    expect(addIcon.element().parentElement).toBeDisabled();
    expect(() => renderResult.getByText("'' is not a valid token name").element()).not.toThrow();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe(ThemeRuleSelector, () => {
  it('renders #000000 if not provided a value', async () => {
    const renderResult = await render(<ThemeRuleSelector enabled label='fg' />);
    const inputElement = findInputByValue(renderResult, '000000');
    expect(inputElement).not.toBeNull();
  });

  it('renders the value if provided', async () => {
    const renderResult = await render(<ThemeRuleSelector enabled label='fg' colour='ffffff' />);
    const inputElement = findInputByValue(renderResult, 'ffffff');
    expect(inputElement).not.toBeNull();
  });

  it('calls onColourChanged when the colour is changed', async () => {
    const mockedOnColourChanged = vi.fn();
    const renderResult = await render(<ThemeRuleSelector enabled label='fg' colour='ffffff' onColourChanged={mockedOnColourChanged} />);
    const inputElement = findInputByValue(renderResult, 'ffffff');
    expect(inputElement).not.toBeNull();

    await userEvent.click(inputElement as HTMLInputElement);
    await userEvent.keyboard('[Backspace>6/]000000[Enter]');

    expect(mockedOnColourChanged).toHaveBeenCalledExactlyOnceWith('000000');
  });

  it('disables the input if not enabled', async () => {
    const renderResult = await render(<ThemeRuleSelector label='fg' enabled={false} />);
    const inputElement = findInputByValue(renderResult, '000000');
    expect(inputElement).not.toBeNull();
    expect(inputElement).toBeDisabled();
  });
});
