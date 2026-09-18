import Input, { type InputProps } from '@mui/material/Input';
import { forwardRef, useRef, useState } from 'react';

type InputFieldProps = {
  onConfirm?: (newValue: string) => void;
} & Omit<InputProps, 'onChange'>;

/**
 * Input field component that uses "onConfirm" to determine when the field has finished editing.
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ onBlur, onConfirm, value, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string | null>(null);

  return <Input
    {...props}
    inputRef={e => {
      if (typeof ref === 'function') {
        ref(e);
      } else if (ref) {
        ref.current = e;
      }
      inputRef.current = e;
    }}
    value={text ?? value}
    onChange={e => setText(e.target.value)}
    onBlur={e => {
      setText(null);
      onBlur?.(e);
    }}
    onKeyUp={e => {
      if (!inputRef.current) return;

      switch (e.code) {
        case 'Enter': {
          onConfirm?.(inputRef.current.value);
          // case fall through
        }
        case 'Escape': {
          inputRef.current.blur();
          setText(null);
          return;
        }
      }
    }}
  />;
});

export default InputField;
