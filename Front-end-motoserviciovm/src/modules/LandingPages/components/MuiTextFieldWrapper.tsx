import React from 'react';
import TextField from '@mui/material/TextField';

type Props = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: any) => void;
  required?: boolean;
  rows?: number | string;
};

const MuiTextFieldWrapper: React.FC<Props> = ({ label, id, type = 'text', placeholder, value, onChange = () => {}, required = false, rows }) => {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      multiline={!!rows}
      minRows={rows ? Number(rows) : undefined}
      fullWidth
      variant="outlined"
      InputProps={{ sx: { backgroundColor: '#111827', color: '#fff' } }}
      InputLabelProps={{
        sx: {
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff',
          },
          '&.MuiFormLabel-root': {
            opacity: 0.95,
          },
        },
      }}
    />
  );
};

export default MuiTextFieldWrapper;
