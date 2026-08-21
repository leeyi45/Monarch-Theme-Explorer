import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import ColourInputBox from './ColourInput';

export interface ThemeRuleSelectorProps {
  enabled?: boolean;
  colour?: string;
  label: string;

  onColourChanged?: (newColour: string) => void;
  onEnabledChanged?: () => void;
}

export default function ThemeRuleSelector({ enabled, onColourChanged, onEnabledChanged, colour, label }: ThemeRuleSelectorProps) {
  return <Stack direction='row' sx={{ alignItems: 'center' }}>
    <Checkbox
      checked={!!enabled}
      onChange={onEnabledChanged}
    />
    <ColourInputBox
      label={label}
      value={colour ?? '000000'}
      disabled={!enabled}
      onChange={onColourChanged}
    />
  </Stack>;
}
