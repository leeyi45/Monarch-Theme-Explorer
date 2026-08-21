import Box from '@mui/material/Box';
import type { InputBaseComponentProps } from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import InputField from './InputField';

interface EditableTextProps {
  disabled?: boolean;
  value: string;
  onChange?: (newValue: string) => void;

  inputProps?: InputBaseComponentProps;
  fontFamily?: string;
}

/**
 * Component that renders itself as text when not focused, but as an input
 * when focused.
 */
export default function EditableText({ value, fontFamily, onChange, disabled, inputProps }: EditableTextProps) {
  const [entered, setEntered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entered) {
      inputRef.current?.focus();
    }
  }, [entered]);

  return <>
    <div hidden={!entered}>
      <InputField
        onBlur={() => setEntered(false)}
        value={value}
        ref={inputRef}
        onConfirm={newValue => {
          onChange?.(newValue);
        }}
        inputProps={{
          ...inputProps,
          style: {
            fontFamily
          }
        }}
      />
    </div>
    <div hidden={entered}>
      <Box
        onClick={() => {
          if (!disabled) setEntered(true);
        }}
      >
        <Typography
          component="code"
          sx={{ fontFamily }}
        >{value}</Typography>
      </Box>
    </div>
  </>;
}
