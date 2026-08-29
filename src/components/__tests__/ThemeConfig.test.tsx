import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import ColourInputBox from '../ThemeConfig/ColourInput';

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
