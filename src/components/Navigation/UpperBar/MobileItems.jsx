import React from "react";
import swordSticker from "/sword.png";
import newLogo from "/conquer_logo.png";
import {
  Box,
  Grid2 as Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import UserMenuTrigger from "./UserMenuTrigger";
import UserMenu from "./UserMenu";
import { useTranslation } from "react-i18next";
import useLocalStorageState from "use-local-storage-state";
import { useAuthStore } from "../../../store";

const MobileItems = ({
  pages,
  anchorElNav,
  setAnchorElNav,
  handleCloseNavMenu,

  setAnchorElUser,
  settings,
  anchorElUser,
  handleCloseUserMenu,
}) => {
  const [authState] = useLocalStorageState("authState");
  const { authenticated } = useAuthStore((state) => state);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  return (
    <Grid
      item
      container
      justifyContent="space-around"
      alignItems="center"
      direction={i18n.language === "ar" ? "row-reverse" : "row"}
      sx={{ width: "100vw" }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "80%",
          display: { xs: "flex", md: "none" },
          m: 1,
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
        }}
      >
        <img
          src={newLogo}
          alt="Sword"
          style={{ height: "3em", marginRight: 3, marginLeft: 3 }}
        />
        <Typography
          variant="h5"
          noWrap
          component={Link}
          to="/"
          className="logo-link"
          sx={{
            display: { xs: "flex !important", md: "none !important" },
            flexGrow: "1 !important",
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            mr: i18n.language === "ar" && 1,
          }}
        >
          {t("CONQUER")}
        </Typography>
      </Grid>

      {authenticated && (
        <Grid sx={{ display: { xs: "flex", md: "none" } }}>
          <UserMenuTrigger setAnchorElUser={setAnchorElUser} />
          <UserMenu
            settings={settings}
            anchorElUser={anchorElUser}
            handleCloseUserMenu={handleCloseUserMenu}
          />
        </Grid>
      )}

      <Grid>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page, index) => (
              <MenuItem
                key={`UpperBarMenuPage-${index}`}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(page.link);
                }}
                sx={{ border: "none" }}
              >
                <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MobileItems;
