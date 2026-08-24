import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

interface ColourInputBoxProps {
  label: string;
  value: string;
  onChange?: (newValue: string) => void;
  disabled?: boolean;
}

/**
 * Text Field for entering a hex sequence
 */
export default function ColourInputBox({ disabled, value, label, onChange }: ColourInputBoxProps) {
  const [text, setText] = useState<string | null>(null);

  const confirm = () => {
    if (text === null) return;
    setText(null);

    if (!/^[0-9A-F]{0,6}$/.test(text)) return;
    onChange?.(text);
  };

  return <TextField
    disabled={disabled}
    value={text ?? value}
    label={label}
    size='small'
    onChange={e => {
      const newValue = e.target.value;
      if (newValue.length > 6) return;

      setText(newValue);
    }}
    onBlur={confirm}
    slotProps={{
      input: {
        startAdornment: <InputAdornment position='start'>#</InputAdornment>,
        endAdornment: <InputAdornment position='end'>
          <Box sx={{
            bgcolor: `#${value}`,
            width: '1ch',
            height: '1ch',
            border: '1px black solid'
          }}
          />
        </InputAdornment>
      }
    }}
  />;
}
