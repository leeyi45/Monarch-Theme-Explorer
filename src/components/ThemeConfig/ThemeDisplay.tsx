import DeleteIcon from '@mui/icons-material/Delete';

import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { partition } from 'es-toolkit';
import { editor } from 'monaco-editor';
import { useEffect } from 'react';

import FormatOptionsSelector from './FormatOptionSelector';
import ThemeRuleSelector from './ThemeRuleSelector';
import type { ThemeRule } from './types';

type ThemeTreeItem = {
  childItems: {
    [k: string]: ThemeTreeItem;
  }
  format: ThemeRule;
};

type ThemeTreeItemProps = {
  entry: string;
} & ThemeTreeItem;

interface ThemeRuleDisplayProps {
  rule: ThemeRule;
  dispatch: (...args: any[]) => void
}

function ThemeRuleDisplay({ rule, dispatch }: ThemeRuleDisplayProps) {
  const ruleName = rule.token;

  return <Card>
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
  </Card>;
}

function ThemeTreeItemDisplay({ entry, childItems, format }: ThemeTreeItemProps) {
  const entries = Object.entries(childItems);

  const formatDisplay = <ThemeRuleDisplay rule={format} dispatch={() => {}} />;

  if (entries.length === 1) {
    const [ruleName, value] = entries[0];

    // is a root item
    return <TreeItem itemId={entry} label={entry}>
      {ruleName === ''
        ? formatDisplay
        : <ThemeTreeItemDisplay
          entry={`${entry}.${ruleName}`}
          {...value}
        />
      }
    </TreeItem>;
  }

  return <TreeItem itemId={entry} label={entry} >
    {entries.length > 1 ? (<>
      <TreeItem itemId={`${entry}-format`} label="Format">
        {formatDisplay}
      </TreeItem>
      <TreeItem itemId={`${entry}-children`} label="Children">
        {entries
          .filter(([k]) => k !== '')
          .map(([k, v]) => {
            const fullName = k === '' ? entry : `${entry}.${k}`;

            return <ThemeTreeItemDisplay
              entry={fullName}
              {...v}
            />;
          })}
      </TreeItem>
    </>) : formatDisplay}
  </TreeItem>;
}

interface ThemeDisplayProps {
  theme: editor.IStandaloneThemeData;
}

function processRules(rules: editor.ITokenThemeRule[]) {
  function processMonaco(value: editor.ITokenThemeRule): ThemeRule {
    return {
      token: value.token,
      fg: {
        value: value.foreground ?? '000000',
        enabled: value.foreground !== undefined
      },
      bg: {
        value: value.background ?? '000000',
        enabled: value.background !== undefined
      },
      enabled: true,
      italic: value.fontStyle?.includes('italic'),
      bold: value.fontStyle?.includes('bold'),
      underline: value.fontStyle?.includes('underline'),
    };
  }

  const [[rootRule], nonRootRules] = partition(rules, rule => rule.token === '');

  const output: ThemeTreeItem = {
    childItems: {},
    format: processMonaco(rootRule)
  };

  function writePath(obj: ThemeTreeItem, path: string[], value: editor.ITokenThemeRule) {
    const format = processMonaco(value);
    const [arg, ...rest] = path;

    if (rest.length === 0) {
      if (!(arg in obj.childItems)) {
        obj.childItems[arg] = {
          childItems: {},
          format
        };
      } else {
        obj.childItems[arg].format = format;
      }
      return;
    }

    if (!(arg in obj.childItems)) {
      obj.childItems[arg] = {
        childItems: {},
        format,
      };
    }

    writePath(obj.childItems[arg], rest, value);
  }

  nonRootRules.forEach(rule => {
    const args = rule.token.split('.');
    writePath(output, args, rule);
  });

  return output;
}

export default function ThemeDisplay({ theme }: ThemeDisplayProps) {
  const {
    format: rootFormat,
    childItems: unflattenedRules
  } = processRules(theme.rules);

  useEffect(() => {
    console.log(unflattenedRules);
  }, [unflattenedRules]);

  return <SimpleTreeView slots={{
  }}>
    <TreeItem itemId='vs-dark' label='vs-dark'>
      {Object.entries(unflattenedRules).map(([k, v]) => (
        <ThemeTreeItemDisplay
          entry={k}
          {...v}
        />
      ))}
    </TreeItem>
  </SimpleTreeView>;
}
