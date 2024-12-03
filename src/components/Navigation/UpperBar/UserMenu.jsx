import { Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountBalance,
  Dashboard,
  FolderSpecial,
  Settings,
  Storage,
  Timeline,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import useLocalStorageState from "use-local-storage-state";

const UserMenu = ({
  settings,
  anchorElUser,
  handleCloseUserMenu,
  position = "upper",
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [_, setAuthState] = useLocalStorageState("authState");

  const iconStyle = {
    mr: i18n.language === "ar" ? 0 : 1,
    ml: i18n.language === "ar" ? 1 : 0,
  };

  return (
    <Menu
      sx={{
        mt: position === "upper" && "45px",
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      {settings.map((setting) => {
        switch (setting) {
          case t("Dashboard"):
            return (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  alert("Not implemented yet.");
                }}
              >
                <Dashboard sx={iconStyle} />
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );

          case t("Settings"):
            return (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  navigate("/settings");
                }}
              >
                <Settings sx={iconStyle} />
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );

          case t("TM_1500"):
            return (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  navigate("/planner/history");
                }}
              >
                <Timeline sx={iconStyle} />
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );

          case t("Pillars"):
            return (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  navigate("/planner/pillars");
                }}
              >
                <AccountBalance sx={iconStyle} />
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );

          case t("Projects"):
            return (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  navigate("/planner/projects");
                }}
              >
                <FolderSpecial sx={iconStyle} />
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );

          case t("Systems"):
            return (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  navigate("/systems");
                }}
              >
                <Storage sx={iconStyle} />
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );

          default:
            return (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center" className="app-font">
                  {setting}
                </Typography>
              </MenuItem>
            );
        }
      })}
    </Menu>
  );
};

export default UserMenu;
