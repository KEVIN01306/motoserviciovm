import React from 'react';
import { Wrench, Calendar, Cpu, User, Home, ShieldCheck, Zap, Target } from 'lucide-react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const iconMap = {
  Wrench,
  Calendar,
  Cpu,
  User,
  Home,
  ShieldCheck,
  Zap,
  Target,
};

export const getIconComponent = (iconName?: string | null) => {
  if (!iconName) return <Target size={24} />;
  const IconComp = iconMap[iconName as keyof typeof iconMap];
  return IconComp ? <IconComp size={24} /> : <Target size={24} />;
};

interface Props {
  value?: string | null;
  onChange: (icon: string) => void;
}

const IconSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Icono</InputLabel>
      <Select value={value || 'Target'} onChange={(e) => onChange(e.target.value)} label="Icono">
        {Object.keys(iconMap).map((iconName) => {
          const IconComp = iconMap[iconName as keyof typeof iconMap];
          return (
            <MenuItem key={iconName} value={iconName}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconComp size={20} />
                <span>{iconName}</span>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default IconSelector;
