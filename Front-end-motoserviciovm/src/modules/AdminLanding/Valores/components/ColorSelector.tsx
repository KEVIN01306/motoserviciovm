import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const colorOptions = [
  { value: 'text-red-600', label: 'Rojo', preview: '#dc2626' },
  { value: 'text-yellow-500', label: 'Amarillo', preview: '#eab308' },
  { value: 'text-green-500', label: 'Verde', preview: '#22c55e' },
  { value: 'text-blue-500', label: 'Azul', preview: '#3b82f6' },
  { value: 'text-purple-500', label: 'Morado', preview: '#a855f7' },
  { value: 'text-orange-500', label: 'Naranja', preview: '#f97316' },
];

interface Props {
  value?: string | null;
  onChange: (color: string) => void;
}

const ColorSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Color</InputLabel>
      <Select value={value || 'text-red-600'} onChange={(e) => onChange(e.target.value)} label="Color">
        {colorOptions.map((color) => (
          <MenuItem key={color.value} value={color.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: color.preview, borderRadius: '4px' }} />
              <span>{color.label}</span>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ColorSelector;
