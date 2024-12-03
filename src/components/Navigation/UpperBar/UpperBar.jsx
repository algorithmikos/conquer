import React, { useState } from "react";
import "./UpperBar.css";

import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "../../../functions/screenSizes";

import DesktopItems from "./DesktopItems";
import MobileItems from "./MobileItems";

import { Box, Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import MainToolbar from "../../MainToolbar/MainToolbar";

import { useAuthStore, useUtilsStore } from "../../../store";

const UpperBar = () => {
  const { t, i18n } = useTranslation();

  const appPages = [
    { name: t("Tasks"), link: "/" },
    { name: t("Pillars"), link: "/planner/pillars" },
    { name: t("Projects"), link: "/planner/projects" },
    { name: t("Systems"), link: "/systems" },
    { name: t("TM_1500"), link: "/planner/history" },
    { name: t("Contributors"), link: "/conquer/contributors" },
  ];

  const authPages = [
    { name: t("Home"), link: "/" },
    { name: t("Login"), link: "/login" },
    { name: t("Contributors"), link: "/conquer/contributors" },
  ];

  const settings = [t("Dashboard"), t("Settings")];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { authenticated } = useAuthStore((state) => state);
  const { colors } = useUtilsStore((state) => state);

  const navigate = useNavigate();
  const { xs, sm, md, lg, xl } = useMediaQueries();

  return (
    <>
      {!authenticated && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1001,
            background: colors?.main_bg_gradient,
            borderBottom: "1px solid black",
          }}
        >
          {!xs && (
            <DesktopItems
              pages={authenticated ? appPages : authPages}
              handleCloseNavMenu={handleCloseNavMenu}
              setAnchorElUser={setAnchorElUser}
              settings={settings}
              anchorElUser={anchorElUser}
              handleCloseUserMenu={handleCloseUserMenu}
            />
          )}

          {xs && (
            <MobileItems
              pages={authenticated ? appPages : authPages}
              anchorElNav={anchorElNav}
              setAnchorElNav={setAnchorElNav}
              handleCloseNavMenu={handleCloseNavMenu}
              setAnchorElUser={setAnchorElUser}
              settings={settings}
              anchorElUser={anchorElUser}
              handleCloseUserMenu={handleCloseUserMenu}
            />
          )}
        </Box>
      )}
      {!xs && authenticated && (
        <Box
          sx={{
            // mt: 8,
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.01)",
            backdropFilter: "blur(3px)",
          }}
        >
          <MainToolbar />
        </Box>
      )}
    </>
    // <AppBar
    //   position="fixed"
    //   sx={{
    //     background: "linear-gradient(to bottom right, #55566a, #282834)",
    //   }}
    // >
    //   <Toolbar disableGutters>
    //     {!xs && (
    //       <DesktopItems
    //         pages={authState?.authenticated ? appPages : authPages}
    //         handleCloseNavMenu={handleCloseNavMenu}
    //         setAnchorElUser={setAnchorElUser}
    //         settings={settings}
    //         anchorElUser={anchorElUser}
    //         handleCloseUserMenu={handleCloseUserMenu}
    //       />
    //     )}

    //     {/* {!md && (
    //         <MobileItems
    //           pages={authState?.authenticated ? appPages : authPages}
    //           anchorElNav={anchorElNav}
    //           setAnchorElNav={setAnchorElNav}
    //           handleCloseNavMenu={handleCloseNavMenu}
    //           setAnchorElUser={setAnchorElUser}
    //           settings={settings}
    //           anchorElUser={anchorElUser}
    //           handleCloseUserMenu={handleCloseUserMenu}
    //         />
    //       )} */}
    //   </Toolbar>
    //   <Divider />
    //   <MainToolbar />
    // </AppBar>
  );
};

export default UpperBar;
