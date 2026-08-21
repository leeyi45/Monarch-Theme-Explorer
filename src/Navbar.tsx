import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface NavbarProps {
  onChange?: (newValue: string) => void;
  selected?: string;
  items: [string, string][]
}

export default function Navbar(props: NavbarProps) {
  return <Toolbar>
    <Stack direction='column'>
      <Typography variant='h5'>Theme Explorer</Typography>
      <Stack direction='row'>
        <Select
          value={props.selected}
          onChange={e => {
            props.onChange?.(e.target.value);
          }}
          size='small'
        >
          {props.items.map(([id, name]) => <MenuItem
            key={id}
            value={id}
          >{name}</MenuItem>)}
        </Select>
      </Stack>
    </Stack>
  </Toolbar>;
}
