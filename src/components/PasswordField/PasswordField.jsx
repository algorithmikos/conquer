import React, { useState } from "react";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  onKeyDown,
  id,
  sx,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={id} error={error}>
        {label}
      </InputLabel>
      <OutlinedInput
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        size="small"
        value={value}
        onChange={onChange}
        error={error}
        label={label}
        id={id}
        type={showPassword ? "text" : "password"}
        onCopy={(event) => event.preventDefault()}
        onPaste={(event) => event.preventDefault()}
        onCut={(event) => event.preventDefault()}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText
        id="outlined-weight-helper-text"
        sx={{ whiteSpace: "pre-wrap", color: error && "red" }}
      >
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default PasswordField;
