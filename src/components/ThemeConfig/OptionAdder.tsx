import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import FormatOptionsSelector from './FormatOptionSelector';
import ThemeRuleSelector from './ThemeRuleSelector';
import type { TextFormatOptions, ThemeRule } from './types';

interface OptionAdderProps {
  currentRules: string[];
  onConfirm?: (rule: ThemeRule) => void;
}

export default function OptionAdder({ currentRules, onConfirm }: OptionAdderProps) {
  const [tokenName, setTokenName] = useState('token');
  const [fgValue, setFgValue] = useState('000000');
  const [fgEnabled, setFgEnabled] = useState(true);

  const [bgValue, setBgValue] = useState('000000');
  const [bgEnabled, setBgEnabled] = useState(true);

  const [formatOpts, setFormatOpts] = useState<TextFormatOptions>({});

  function validate() {
    if (tokenName === '') return "'' is not a valid token name";

    if (currentRules.includes(tokenName)) {
      return `A rule already exists for ${tokenName}!`;
    }

    if (!fgEnabled && !bgEnabled) {
      return 'One of foreground or background colour must be enabled!';
    }

    return undefined;
  }

  function confirmRule() {
    onConfirm?.({
      token: tokenName,
      enabled: true,
      fg: {
        value: fgValue,
        enabled: fgEnabled
      },
      bg: {
        value: bgValue,
        enabled: bgEnabled
      },
      ...formatOpts
    });
  }

  const validateResult = validate();

  return <Card>
    <div style={{ padding: '5px 5px 5px 5px'}}>
      <Grid container rowSpacing={2}>
        <Grid size={10}>
          <Stack direction='row' sx={{ alignItems: 'center' }}>
            <Checkbox disabled checked />
            <FormControl>
              <TextField
                style={{ fontFamily: 'consolas' }}
                value={tokenName}
                onChange={e => setTokenName(e.target.value)}
                variant='standard'
                size='small'
                error={validateResult !== undefined}
              />
              <FormHelperText>{validateResult}</FormHelperText>
            </FormControl>
          </Stack>
        </Grid>
        <Grid size={2}>
          <IconButton
            disabled={validateResult !== undefined}
            onClick={confirmRule}
          >
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid size={12}>
          <ThemeRuleSelector
            label="Foreground"
            colour={fgValue}
            enabled={fgEnabled}
            onColourChanged={setFgValue}
            onEnabledChanged={() => setFgEnabled(!fgEnabled)}
          />
        </Grid>
        <Grid size={12}>
          <ThemeRuleSelector
            label="Background"
            colour={bgValue}
            enabled={bgEnabled}
            onColourChanged={setBgValue}
            onEnabledChanged={() => setBgEnabled(!bgEnabled)}
          />
        </Grid>
        <Grid size={12}>
          <FormatOptionsSelector
            rule={formatOpts}
            onChange={opt => setFormatOpts(prev => ({ ...prev, [opt]: !prev[opt] }))}
          />
        </Grid>
      </Grid>
    </div>
  </Card>;
}
