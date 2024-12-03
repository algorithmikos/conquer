import React, { useState } from "react";
import newLogo from "/conquer_logo.png";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useMediaQueries } from "../../../functions/screenSizes";
import UserMenuTrigger from "./UserMenuTrigger";
import UserMenu from "./UserMenu";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "../../../pages/Settings/ChangeLanguage";
import { useAuthStore } from "../../../store";

const DesktopItems = ({
  pages,
  handleCloseNavMenu,

  setAnchorElUser,
  settings,
  anchorElUser,
  handleCloseUserMenu,
}) => {
  const { xs, sm } = useMediaQueries();
  const { t, i18n } = useTranslation();

  const { authenticated } = useAuthStore((state) => state);

  const [guestPrefs, setGuestPrefs] = useState({
    lang: localStorage.getItem("lang") ?? "en",
  });

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      direction={i18n.language === "ar" ? "row-reverse" : "row"}
      sx={{ width: "100vw" }}
    >
      <Grid
        sx={{
          display: {
            xs: "none",
            md: "flex",
            lg: "flex",
            xl: "flex",
          },
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
          m: 1,
          mr: i18n.language === "ar" ? 2 : 0,
          ml: i18n.language === "ar" ? 2 : 2,
        }}
      >
        <img
          src={newLogo}
          alt="Sword"
          // className="logo sword"
          height={50}
          width={52}
          id="sword-image"
        />
      </Grid>

      {!xs && !sm && (
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          className={`logo-link ${i18n.language === "ar" ? "app-font" : ""}`}
          sx={{
            letterSpacing: i18n.language === "ar" ? "0 !important" : "0.3rem",
            mr: i18n.language === "ar" ? 0 : 1,
            ml: i18n.language === "ar" ? 1 : 0,
          }}
        >
          {t("CONQUER")}
        </Typography>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
        }}
      >
        {pages.map((page, index) => (
          <Link to={page.link} key={`UpperBarPage-${index}`}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
              className="app-font"
            >
              {page.name}
            </Button>
          </Link>
        ))}
      </Box>

      {!authenticated && (
        <ChangeLanguage
          settingsForm={guestPrefs}
          setSettingsForm={setGuestPrefs}
          props={{
            sx: {
              width: "15%",
              ml: i18n.language === "ar" ? 3 : 0,
              mr: i18n.language === "ar" ? 0 : 3,
            },
          }}
        />
      )}

      {authenticated && (
        <Grid
          item
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            mr: i18n.language === "ar" ? 0 : 3,
            ml: i18n.language === "ar" ? 3 : 0,
          }}
        >
          <UserMenuTrigger setAnchorElUser={setAnchorElUser} />
          <UserMenu
            settings={settings}
            anchorElUser={anchorElUser}
            handleCloseUserMenu={handleCloseUserMenu}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default DesktopItems;
