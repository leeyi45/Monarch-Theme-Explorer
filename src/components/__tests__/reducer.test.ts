import { describe, expect, it } from 'vitest';
import { themeReducer } from '../ThemeConfig/ThemeConfig';
import type { RuleChangeAction, ThemeRulesRecord } from '../ThemeConfig/types';

describe(themeReducer, () => {
  it('should throw an error when trying to remove a non-existent token', () => {
    const initialState: ThemeRulesRecord = {
      token1: {
        token: 'token1',
        bg: { value: '#FFFFFF', enabled: true },
        fg: { value: '#000000', enabled: true },
        enabled: true
      },
    };

    const action: RuleChangeAction = {
      type: 'remove',
      token: 'nonExistentToken',
    };

    expect(() => themeReducer(initialState, action)).toThrow("Cannot remove non-existent token 'nonExistentToken'");
  });

  it('should throw an error when trying to rename a non-existent token', () => {
    const initialState: ThemeRulesRecord = {
      token1: {
        token: 'token1',
        bg: { value: '#FFFFFF', enabled: true },
        fg: { value: '#000000', enabled: true },
        enabled: true
      },
    };

    const action: RuleChangeAction = {
      type: 'token',
      token: 'nonExistentToken',
      newValue: 'newTokenName'
    };

    expect(() => themeReducer(initialState, action)).toThrow("Cannot rename non-existent token 'nonExistentToken'");
  });

  it('should update the background color of an existing token', () => {
    const initialState: ThemeRulesRecord = {
      token1: {
        token: 'token1',
        bg: { value: '#FFFFFF', enabled: true },
        fg: { value: '#000000', enabled: true },
        enabled: true
      },
    };

    const action: RuleChangeAction = {
      type: 'bg',
      token: 'token1',
      newValue: '#FF0000'
    };

    const newState = themeReducer(initialState, action);
    expect(newState.token1.bg.value).toBe('#FF0000');
    expect(newState.token1.bg.enabled).toBe(true);

    expect(newState.token1.fg.value).toBe('#000000');
    expect(newState.token1.fg.enabled).toBe(true);
  });

  it('should update the foreground color of an existing token', () => {
    const initialState: ThemeRulesRecord = {
      token1: {
        token: 'token1',
        bg: { value: '#FFFFFF', enabled: true },
        fg: { value: '#000000', enabled: true },
        enabled: true
      },
    };

    const action: RuleChangeAction = {
      type: 'fg',
      token: 'token1',
      newValue: '#FF0000'
    };

    const newState = themeReducer(initialState, action);
    expect(newState.token1.bg.value).toBe('#FFFFFF');
    expect(newState.token1.bg.enabled).toBe(true);

    expect(newState.token1.fg.value).toBe('#FF0000');
    expect(newState.token1.fg.enabled).toBe(true);
  });

  it('should enable an added rule by default', () => {
    const initialState: ThemeRulesRecord = {
      token1: {
        token: 'token1',
        bg: { value: '#FFFFFF', enabled: true },
        fg: { value: '#000000', enabled: true },
        enabled: true
      },
    };

    const action: RuleChangeAction = {
      type: 'add',
      token: 'token2',
      bg: { value: '#00FF00', enabled: true },
      fg: { value: '#0000FF', enabled: true }
    };

    const newState = themeReducer(initialState, action);
    expect(newState.token2.enabled).toBe(true);
  });

  it('leaves the other formatting options unchanged when updating a rule', () => {
    const initialState: ThemeRulesRecord = {
      token1: {
        token: 'token1',
        bg: { value: '#FFFFFF', enabled: true },
        fg: { value: '#000000', enabled: true },
        enabled: true,
        bold: true,
        italic: true,
      },
    };

    const action: RuleChangeAction = {
      type: 'format',
      token: 'token1',
      bold: false
    };

    const newState = themeReducer(initialState, action);
    expect(newState.token1.bg.value).toBe('#FFFFFF');
    expect(newState.token1.bold).toBe(false);
    expect(newState.token1.italic).toBe(true);
    expect(newState.token1.underline).toBeUndefined();
  });
});
