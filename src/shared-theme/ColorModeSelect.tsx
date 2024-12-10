import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { useState } from 'react';

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme();
  const [optionCustomScheme, setOptionCustomScheme] = useState(false);

  if (!mode || mode === null) {
    return null;
  }
  return (
    <Select
      value={mode}
      onChange={(event) => {
        const value = event.target.value;

        if (value === 'custom-scheme') {
          console.log(optionCustomScheme);
          setOptionCustomScheme(true);
          setMode('light');
        } else {
          setOptionCustomScheme(false);
          setMode(event.target.value as 'system' | 'light' | 'dark')
        }
      }}
      SelectDisplayProps={{
        // @ts-ignore
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
      <MenuItem value="custom-scheme">Custom</MenuItem>
    </Select>
  );
}
