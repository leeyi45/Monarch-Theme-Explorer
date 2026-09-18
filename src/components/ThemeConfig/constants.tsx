import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlineIcon from '@mui/icons-material/FormatUnderlined';

import type { ReactNode } from 'react';

// TODO: Possibly enable strikethrough in the future?
// import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';

export const textFormatOptions = [
  'bold',
  'italic',
  'underline',
  // 'strikethrough'
] as const;

export const textFormatIcons: {
  [K in (typeof textFormatOptions)[number]]: ReactNode
} = {
  bold: <FormatBoldIcon />,
  italic: <FormatItalicIcon />,
  underline: <FormatUnderlineIcon />,
  // strikethrough: <StrikethroughSIcon />
};
