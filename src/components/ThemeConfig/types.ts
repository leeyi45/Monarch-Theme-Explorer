export interface ColourOption {
  value: string;
  enabled: boolean;
}

export interface FormatOption {
  bold?: string;
  italic?: string;
  underline?: string;
}

export interface ThemeRule {
  token: string;
  enabled?: boolean;

  fg: ColourOption;
  bg: ColourOption;

  italic?: boolean;
  bold?: boolean;
  underline?: boolean;
}

interface RuleFgChangeAction {
  type: 'fg';
  token: string;
  newValue: string | false;
}

interface RuleBgChangeAction {
  type: 'bg';
  token: string;
  newValue: string | false;
}

interface RuleTokenChangeAction {
  type: 'token';
  token: string;
  newValue: string;
}

interface RuleEnabledChangeAction {
  type: 'enable';
  token: string;
  newValue: boolean;
}

interface RuleAddAction {
  type: 'add';
  token: string;

  fg: ColourOption;
  bg: ColourOption;
}

interface RuleRemoveAction {
  type: 'remove';
  token: string;
}

interface RuleFormatAction {
  type: 'format';
  token: string;

  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type RuleChangeAction =
  | RuleAddAction
  | RuleRemoveAction
  | RuleBgChangeAction
  | RuleFgChangeAction
  | RuleTokenChangeAction
  | RuleEnabledChangeAction
  | RuleFormatAction;
