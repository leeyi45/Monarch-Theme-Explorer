import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

import { textFormatIcons, textFormatOptions } from './constants';
import type { TextFormatOption, TextFormatOptions } from './types';

interface FormatOptionSelectorProps {
  rule: TextFormatOptions;
  onChange?: (opt: TextFormatOption) => void;
}

/**
 * Displays each text format with its associated checkbox and icon side-by-side.
 */
export default function FormatOptionsSelector({ rule, onChange }: FormatOptionSelectorProps) {
  return <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'center' }}>
    {textFormatOptions.map(each => <Stack
      direction="row"
      sx={{ alignItems: 'center' }}
      key={each}
    >
      <Checkbox
        checked={!!rule[each]}
        onClick={() => onChange?.(each)}
      />
      {textFormatIcons[each]}
    </Stack>
    )}
  </Stack>;

}
