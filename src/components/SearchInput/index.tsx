import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


type Props = {
    value: string,
    onChange: any,
    placeholder?:string
}

const SearchInput = ({ value, onChange, placeholder = 'Qidirish...' }:Props) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
