import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "react-i18next";

const OptionsMenu = ({ options, className = "" }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { i18n } = useTranslation();

  return (
    <div className={className}>
      <IconButton
        aria-controls="options-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="options-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        {options.map((option, index) => (
          <MenuItem
            className="app-font"
            disabled={option.disabled || false}
            key={`${option.category}-${index}`}
            onClick={() => {
              option.onClick();
              setAnchorEl(null);
            }}
            sx={{ color: option.textColor }}
          >
            {option.icon && option.icon} {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default OptionsMenu;
