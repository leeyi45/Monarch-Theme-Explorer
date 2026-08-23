import type { textFormatOptions } from './constants';

/**
 * Represents the formatting styles that can be applied to the
 * text
 */
export type TextFormatOption = (typeof textFormatOptions)[number];

/**
 * Object containing boolean values indicating if a particular formatting style
 * is to be applied to the text
 */
export type TextFormatOptions = {
  [K in TextFormatOption]?: boolean;
};

export interface ColourOption {
  value: string;
  enabled: boolean;
}

export type ThemeRule = {
  token: string;
  enabled?: boolean;

  fg: ColourOption;
  bg: ColourOption;
} & TextFormatOptions;

/**
 * Action for when the foreground changes colour value or is disabled.
 */
interface RuleFgChangeAction {
  type: 'fg';
  token: string;
  newValue: string | false;
}

/**
 * Action for when the background changes colour value or is disabled.
 */
interface RuleBgChangeAction {
  type: 'bg';
  token: string;
  newValue: string | false;
}

/**
 * Action for when a rule's token is changed.
 */
interface RuleTokenChangeAction {
  type: 'token';
  token: string;
  newValue: string;
}

/**
 * Action for when a rule is disabled or enabled.
 */
interface RuleEnabledChangeAction {
  type: 'enable';
  token: string;
  newValue: boolean;
}

/**
 * Action for when a new rule is added.
 */
interface RuleAddAction {
  type: 'add';
  token: string;

  fg: ColourOption;
  bg: ColourOption;
}

/**
 * Action for when an existing rule is deleted.
 */
interface RuleRemoveAction {
  type: 'remove';
  token: string;
}

/**
 * Action for when a text format option of a given
 * rule is changed.
 */
type RuleFormatAction = {
  type: 'format';
  token: string;
} & TextFormatOptions;

/**
 * Overall type for all the actions that can be used to modify
 * the rules for a theme
 */
export type RuleChangeAction =
  | RuleAddAction
  | RuleRemoveAction
  | RuleBgChangeAction
  | RuleFgChangeAction
  | RuleTokenChangeAction
  | RuleEnabledChangeAction
  | RuleFormatAction;
