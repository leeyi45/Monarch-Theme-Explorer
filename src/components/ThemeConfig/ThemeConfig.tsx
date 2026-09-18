import DeleteIcon from '@mui/icons-material/Delete';

import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { assert, debounce } from 'es-toolkit';
import { editor } from 'monaco-editor';
import { useState } from 'react';

import FormatOptionsSelector from './FormatOptionSelector';
import OptionAdder from './OptionAdder';
import ThemeRuleSelector from './ThemeRuleSelector';
import { textFormatOptions } from './constants';
import type { ColourOption, RuleChangeAction, ThemeRule, ThemeRulesRecord } from './types';

function themeToRules(theme: editor.IStandaloneThemeData): ThemeRulesRecord {
  return theme.rules.reduce<ThemeRulesRecord>((res, { token, foreground, background, fontStyle }) => ({
    ...res,
    [token]: {
      token,
      fg: {
        value: foreground ?? '000000',
        enabled: foreground !== undefined
      },
      bg: {
        value: background ?? '000000',
        enabled: background !== undefined
      },
      enabled: true,
      italic: fontStyle?.includes('italic'),
      bold: fontStyle?.includes('bold'),
      underline: fontStyle?.includes('underline'),
    }}),
  {});
}

function rulesToTheme(rules: ThemeRulesRecord): editor.ITokenThemeRule[] {
  return Object.entries(rules)
    .filter(([, { enabled }]) => enabled)
    .map(([token, { fg, bg, bold, italic, underline }]) => ({
      token,
      foreground: fg.enabled ? fg.value : undefined,
      background: bg.enabled ? bg.value : undefined,
      fontStyle: [
        bold && 'bold',
        italic && 'italic',
        underline && 'underline'
      ].filter(Boolean).join(' ') || undefined
    }));
}

export function themeReducer(prev: ThemeRulesRecord, { token, ...action }: RuleChangeAction): ThemeRulesRecord {
  switch (action.type) {
    case 'bg':
    case 'fg': {
      const newColour: ColourOption = action.newValue === false
        ? {
          ...prev[token][action.type],
          enabled: false
        } : {
          ...prev[token][action.type],
          value: action.newValue,
          enabled: true
        };

      return {
        ...prev,
        [token]: {
          ...prev[token],
          [action.type]: newColour
        }
      };
    }
    case 'enable':
      return {
        ...prev,
        [token]: {
          ...prev[token],
          enabled: action.newValue
        }
      };
    case 'token': {
      const { [token]: old, ...rest } = prev;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      assert(old !== undefined, `Cannot rename non-existent token '${token}'`);

      return {
        ...rest,
        [action.newValue]: old
      };
    }
    case 'remove': {
      const { [token]: old, ...rest } = prev;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      assert(old !== undefined, `Cannot remove non-existent token '${token}'`);

      return rest;
    }
    case 'format':{
      const newRule = textFormatOptions.reduce<ThemeRule>((res, option) => ({
        ...res,
        [option]: action[option] ?? prev[token][option]
      }), prev[token]);

      return {
        ...prev,
        [token]: newRule
      };
    }
    case 'add':
      return {
        ...prev,
        [token]: {
          token,
          enabled: true,
          fg: action.fg,
          bg: action.bg,
        }
      };
    default:
      return prev;
  }
}

interface ThemeConfigProps {
  themeId: string;
  theme: editor.IStandaloneThemeData;
}

const updateTheme = debounce((newRules: ThemeRulesRecord, theme: editor.IStandaloneThemeData, themeId: string) => {
  editor.defineTheme(themeId, {
    ...theme,
    rules: rulesToTheme(newRules)
  });
  editor.setTheme(themeId);
}, 300);

export default function ThemeConfig({ theme, themeId }: ThemeConfigProps) {
  const [rules, setRules] = useState(themeToRules(theme));
  const [ruleName, setRuleName] = useState('');

  function dispatch(action: RuleChangeAction) {
    const newRules = themeReducer(rules, action);
    setRules(newRules);
    updateTheme(newRules, theme, themeId);
  }

  const rule = rules[ruleName];

  return <Stack direction="column">
    <Typography component="h1">Theme Configuration</Typography>
    <Paper>
      <div style={{
        padding: '5px 5px 5px 5px'
      }}>
        <Stack direction="column" spacing={1}>
          <Card >
            <div style={{ padding: '5px 5px 5px 5px'}}>
              <Grid container rowSpacing={2} >
                <Grid size={10}>
                  <Stack direction="row" sx={{ alignItems: 'center', width: '100%' }}>
                    <Tooltip title={`Enable/Disable '${ruleName}'`}>
                      <Checkbox
                        checked={ruleName === '' || !!rule.enabled}
                        disabled={ruleName === ''}
                        onClick={() => dispatch({
                          type: 'enable',
                          token: ruleName,
                          newValue: !rule.enabled
                        })}
                      />
                    </Tooltip>
                    <Autocomplete
                      fullWidth
                      renderInput={props => <TextField
                        {...props}
                        size='small'
                      />}
                      options={Object.keys(rules)}
                      renderOption={(props, name) => <code {...props} >{name === '' ? 'Default' : name}</code>}
                      value={ruleName}
                      onChange={(_, newValue) => setRuleName(newValue ?? '')}
                    />
                  </Stack>
                </Grid>
                <Grid size={2}>
                  <Tooltip title={`Remove '${ruleName}'`}>
                    <IconButton
                      disabled={ruleName === ''}
                      onClick={() => dispatch({
                        type: 'remove',
                        token: ruleName
                      })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid size={12}>
                  <ThemeRuleSelector
                    label='Foreground'
                    colour={rule.fg.value}
                    enabled={rule.fg.enabled}
                    onColourChanged={newValue => dispatch({
                      type: 'fg',
                      token: ruleName,
                      newValue
                    })}
                    onEnabledChanged={() => dispatch({
                      type: 'fg',
                      token: ruleName,
                      newValue: rule.fg.enabled ? false : rule.fg.value
                    })}
                  />
                </Grid>
                <Grid size={12}>
                  <ThemeRuleSelector
                    label='Background'
                    colour={rule.bg.value}
                    enabled={rule.bg.enabled}
                    onColourChanged={newValue => dispatch({
                      type: 'bg',
                      token: ruleName,
                      newValue
                    })}
                    onEnabledChanged={() => dispatch({
                      type: 'bg',
                      token: ruleName,
                      newValue: rule.bg.enabled ? false : rule.bg.value
                    })}
                  />
                </Grid>
                <Grid size={12}>
                  <FormatOptionsSelector
                    rule={rule}
                    onChange={opt => dispatch({
                      type: 'format',
                      token: ruleName,
                      [opt]: !rule[opt]
                    })}
                  />
                </Grid>
              </Grid>
            </div>
          </Card>
          <OptionAdder
            currentRules={Object.keys(rules)}
            onConfirm={newRule => dispatch({
              type: 'add',
              ...newRule
            })}
          />
        </Stack>
      </div>
    </Paper>
  </Stack>;
}
