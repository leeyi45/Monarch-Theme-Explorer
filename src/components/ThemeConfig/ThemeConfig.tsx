import DeleteIcon from '@mui/icons-material/Delete';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlineIcon from '@mui/icons-material/FormatUnderlined';
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
import { debounce } from 'es-toolkit';
import { editor } from 'monaco-editor';
import { useState } from 'react';
import { aceSourceColors } from '../../editor/theme';
import OptionAdder from './OptionAdder';
import ThemeRuleSelector from './ThemeRuleSelector';
import type { ColourOption, RuleChangeAction, ThemeRule } from './types';

function themeToRules(theme: editor.IStandaloneThemeData) {
  return theme.rules.reduce<Record<string, ThemeRule>>((res, { token, foreground, background, fontStyle }) => ({
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

function rulesToTheme(rules: Record<string, ThemeRule>): editor.ITokenThemeRule[] {
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

function themeReducer(prev: Record<string, ThemeRule>, { token, ...action }: RuleChangeAction): Record<string, ThemeRule> {
  switch (action.type) {
    case 'bg': {
      const newBg: ColourOption = action.newValue === false
        ? {
          ...prev[token].bg,
          enabled: false
        } : {
          ...prev[token].bg,
          value: action.newValue,
          enabled: true
        };

      return {
        ...prev,
        [token]: {
          ...prev[token],
          bg: newBg
        }
      };
    }
    case 'fg': {
      const newFg: ColourOption = action.newValue === false
        ? {
          ...prev[token].fg,
          enabled: false
        } : {
          ...prev[token].fg,
          value: action.newValue,
          enabled: true
        };

      return {
        ...prev,
        [token]: {
          ...prev[token],
          fg: newFg
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
      return {
        ...rest,
        [action.newValue]: old
      };
    }
    case 'remove': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [token]: old, ...rest } = prev;
      return rest;
    }
    case 'format':
      return {
        ...prev,
        [token]: {
          ...prev[token],
          italic: action.italic ?? prev[token].italic,
          bold: action.bold ?? prev[token].bold,
          underline: action.underline ?? prev[token].underline,
        }
      };
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
  }
}

const icons = {
  bold: <FormatBoldIcon />,
  italic: <FormatItalicIcon />,
  underline: <FormatUnderlineIcon />
};

interface ThemeConfigProps {
  themeId: string;
  theme: editor.IStandaloneThemeData;
}

export default function ThemeConfig({ theme, themeId }: ThemeConfigProps) {
  const [rules, setRules] = useState(themeToRules(theme));
  const [ruleName, setRuleName] = useState('');

  const updateTheme = debounce((newRules: Record<string, ThemeRule>) => {
    editor.defineTheme(themeId, {
      ...theme,
      rules: rulesToTheme(newRules)
    });
    editor.setTheme(themeId);
  }, 300);

  function dispatch(action: RuleChangeAction) {
    const newRules = themeReducer(rules, action);
    setRules(newRules);
    updateTheme(newRules);
  }

  const rule = rules[ruleName];

  return <Stack direction="column">
    <Typography component="h1">Theme Configuration</Typography>
    <Paper sx={{ backgroundColor: aceSourceColors.editorBackground }}>
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
                {(['bold', 'italic', 'underline'] as const).map(each => <Grid size={4}>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Checkbox
                      checked={!!rule[each]}
                      onClick={() => dispatch({
                        type: 'format',
                        token: ruleName,
                        [each]: !rule[each]
                      })}
                    />
                    {icons[each]}
                  </Stack>
                </Grid>)}
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
