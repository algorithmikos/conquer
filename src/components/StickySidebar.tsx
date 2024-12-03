import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Paper,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuthStore, useUtilsStore } from "../store";
import {
  AdminPanelSettings,
  ArrowCircleRight,
  BlurOff,
  BlurOn,
  Cottage,
  Groups,
  Palette,
  Settings,
  Tune,
} from "@mui/icons-material";
import { GiIonicColumn, GiClockwork, GiSeedling } from "react-icons/gi";
import { IoLibrary } from "react-icons/io5";
import { PiScrollFill } from "react-icons/pi";

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import LayoutMovementController from "./LayoutMovementController";
import ChangeColor from "../pages/Settings/ChangeColor";

const StickySidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const utilStore = useUtilsStore((state) => state);
  const {
    expandSidebar,
    setExpandSidebar,
    expandRightSidebar,
    setExpandRightSidebar,
    profilePic,
    colors,
  } = utilStore;

  const { authenticated } = useAuthStore((state) => state);

  const [showOptions, setShowOptions] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /* @ts-ignore */
  const authState = localStorage.getItem("authState")
    ? /* @ts-ignore */
      JSON.parse(localStorage.getItem("authState") ?? "{}")
    : { displayName: "Guest", name: "Guest" };

  /* @ts-ignore */
  const userState = localStorage.getItem("currentUser")
    ? /* @ts-ignore */
      JSON.parse(localStorage.getItem("currentUser") ?? "{}")
    : {
        username: "Guest",
      };

  const appPages = [
    { name: t("Home"), icon: <Cottage />, action: "/planner/tasks" },
    {
      name: t("Pillars"),
      icon: <GiIonicColumn />,
      action: "/planner/pillars",
    },
    {
      name: t("Projects"),
      icon: <PiScrollFill />,
      action: "/planner/projects",
    },
    { name: t("Systems"), icon: <IoLibrary />, action: "/systems" },
    {
      name: t("Time_Machine_1500"),
      icon: <GiClockwork />,
      action: "/planner/history",
    },
    {
      name: t("Seeds Store"),
      icon: <GiSeedling />,
      action: () => setExpandRightSidebar(!expandRightSidebar),
      state: expandRightSidebar,
    },
    {
      name: t("Contributors"),
      icon: <Groups />,
      action: "/conquer/contributors",
    },
  ];

  const adminPages = [
    {
      name: t("Admin"),
      icon: (
        <AdminPanelSettings
          sx={{
            bgcolor: "var(--main-bg-color)",
            borderRadius: "30%",
            p: 0.1,
          }}
        />
      ),
      action: "/admin",
    },
  ];

  const closeSidebar = (e: any) => {
    e.preventDefault();
    setExpandSidebar(false);
    setShowOptions(false);
    setShowPalette(false);
    document.body.classList.remove("no-clicks");
  };

  if (authenticated)
    return (
      <ClickAwayListener onClickAway={closeSidebar}>
        <Box
          style={{
            background: colors.main_bg_gradient,
            position: "fixed",
            width: expandSidebar ? "22vw" : "5vw",
            height: "100%", // Ensure full height usage
            left: 0,
            overflow: "hidden",

            top: 0,
            zIndex: 1001,
            paddingTop: 10,
            pointerEvents: "auto",

            transition: "all 0.3s ease-in-out",

            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* First Row */}
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              flexDirection: expandSidebar ? "row" : "column",
              gap: expandSidebar ? 0 : 1,
              transition: "all 0.3s ease-in-out",
              px: 1,
              py: expandSidebar ? 0 : 1,
              mb: expandSidebar ? 0 : -1,
            }}
          >
            {profilePic ? (
              <Avatar
                sx={{ width: 30, height: 30, ml: expandSidebar ? 1 : 0 }}
                alt="Thy Profile Picture"
                src={profilePic}
              />
            ) : (
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  ml: expandSidebar ? 1 : 0,
                  bgcolor: "skyblue",
                }}
                alt="Thy Profile Picture"
                src=""
              >
                {authState?.displayName?.[0]?.toUpperCase() || ""}
              </Avatar>
            )}

            <Box
              sx={{
                flexGrow: 1,
                ml: expandSidebar ? 2 : 0,
                textAlign: "start",
                visibility: expandSidebar ? "visible" : "hidden", // Keeps the element in the layout
                opacity: expandSidebar ? 1 : 0,
                height: expandSidebar ? "auto" : 0, // Optional: Adjust height for a collapse effect
                width: expandSidebar ? "auto" : 0,
                overflow: "hidden", // Prevents content overflow when height is 0
                transition: "all 0.4s ease-in-out",
              }}
            >
              <Typography>{authState?.name}</Typography>
              <Typography variant="body2" color="lightgray">
                @{userState?.username}
              </Typography>
            </Box>

            <Tooltip title={t("Settings")} placement="bottom" arrow>
              <IconButton
                onClick={(e) => {
                  navigate("/settings");
                  closeSidebar(e);
                }}
                sx={{
                  display: expandSidebar ? "default" : "none",
                  color:
                    location.pathname === "/settings"
                      ? "var(--main-color)"
                      : "default",
                  transform:
                    location.pathname === "/settings"
                      ? "rotate(90deg)"
                      : "rotate(0)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("Display_Options")} placement="bottom" arrow>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setAnchorEl(e.currentTarget);
                  setShowOptions(!showOptions);
                }}
                sx={{
                  display: expandSidebar ? "default" : "none",
                  color: showOptions ? "var(--main-color)" : "default",
                  pointerEvents: "stroke",
                }}
              >
                <Tune />
              </IconButton>
            </Tooltip>

            <Menu
              open={showOptions}
              anchorEl={anchorEl}
              onClose={() => {
                setShowOptions(false);
                setAnchorEl(null);
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                ml: -4,
                mt: 5,
                display: expandSidebar ? "default" : "none",
                width: showPalette ? 470 : 330,
                height: showPalette ? 200 : 140,
                transition: "width 0.6s, height 0.6s linear",
                pointerEvents: "auto",
              }}
            >
              <DisplayOptions
                showPalette={showPalette}
                setShowPalette={setShowPalette}
              />

              <ColorPalette
                setShowPalette={setShowPalette}
                sx={{
                  mt: 1,
                  display: "inline",
                  opacity: showPalette ? 1 : 0,
                }}
              />
            </Menu>
          </Grid>

          <Divider sx={{ mt: 1.5, width: "100%" }} />

          {/* Second Row */}
          <Grid
            container
            direction="column"
            wrap="nowrap"
            alignItems={expandSidebar ? "flex-start" : "center"}
            justifyContent="start"
            flex={1} // This makes it take up the remaining space
          >
            <MenuList pages={appPages} closeSidebar={closeSidebar} />
            {authState?.labels?.includes("admin") ? (
              <>
                <Divider sx={{ my: 1.5, width: "100%" }} />
                <MenuList
                  pages={adminPages}
                  closeSidebar={closeSidebar}
                  listItemSx={{
                    bgcolor: "var(--main-bg-color)",
                    py: 0.1,
                  }}
                />
              </>
            ) : null}
          </Grid>

          {/* Bottom Section */}
          <Box
            sx={{
              textAlign: expandSidebar ? "right" : "center",
            }}
          >
            <Divider sx={{ display: expandSidebar ? "none" : "default" }} />

            <Menu
              open={showOptions}
              anchorEl={anchorEl}
              onClose={() => {
                setShowOptions(false);
                setAnchorEl(null);
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                ml: 5,
                mt: -0.5,
                display: expandSidebar ? "none" : "default",
                width: showPalette ? 470 : 130,
                height: showPalette ? 200 : 140,
                transition: "width 0.6s, height 0.6s linear",
              }}
            >
              <DisplayOptions
                showPalette={showPalette}
                setShowPalette={setShowPalette}
              />

              <ColorPalette
                setShowPalette={setShowPalette}
                size="small"
                sx={{
                  display: "inline",
                  opacity: showPalette ? 1 : 0,
                }}
              />
            </Menu>

            <Tooltip title={t("Display_Options")} placement="right" arrow>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setAnchorEl(e.currentTarget);
                  setShowOptions(!showOptions);
                }}
                sx={{
                  display: expandSidebar ? "none" : "default",
                  color: showOptions ? "var(--main-color)" : "default",
                }}
              >
                <Tune />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("Settings")} placement="right" arrow>
              <IconButton
                onClick={(e) => {
                  navigate("/settings");
                  closeSidebar(e);
                }}
                sx={{
                  display: expandSidebar ? "none" : "default",
                  color:
                    location.pathname === "/settings"
                      ? "var(--main-color)"
                      : "default",
                  transform:
                    location.pathname === "/settings"
                      ? "rotate(90deg)"
                      : "rotate(0)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>

            <Divider sx={{ display: expandSidebar ? "none" : "default" }} />

            <Tooltip
              title={expandSidebar ? t("Collapse") : t("Expand")}
              placement="right"
              arrow
            >
              <IconButton
                onClick={(e) => {
                  setExpandSidebar(!expandSidebar);
                  expandSidebar
                    ? document.body.classList.remove("no-clicks")
                    : document.body.classList.add("no-clicks");
                  expandSidebar && closeSidebar(e);
                }}
                // size="large"
              >
                <ArrowCircleRight
                  sx={{
                    transition: "all 0.5s ease-in-out",
                    transform: expandSidebar ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </ClickAwayListener>
    );
};

export default StickySidebar;

const DisplayOptions: React.FC<{
  showPalette: boolean;
  setShowPalette: React.Dispatch<React.SetStateAction<boolean>>;
  sx?: SxProps;
}> = ({ showPalette, setShowPalette, sx }) => {
  const utilStore = useUtilsStore((state) => state);
  const { expandSidebar, hideContent, setHideContent } = utilStore;

  return (
    <Box
      sx={{
        flexDirection: expandSidebar ? "row" : "column",
        ...sx,
      }}
    >
      <LayoutMovementController />

      <Tooltip title="Theme" arrow placement="top">
        <IconButton
          size="small"
          onClick={() => setShowPalette(!showPalette)}
          sx={{
            color: showPalette ? "var(--main-color)" : "default",
          }}
        >
          <Palette fontSize="inherit" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Blur" arrow placement="top">
        <IconButton
          size="small"
          onClick={() => setHideContent(!hideContent)}
          sx={{
            color: hideContent ? "var(--main-color)" : "default",
          }}
        >
          {hideContent ? (
            <BlurOff fontSize="inherit" />
          ) : (
            <BlurOn fontSize="inherit" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const ColorPalette: React.FC<{
  setShowPalette: React.Dispatch<React.SetStateAction<boolean>>;
  size?: "small" | "medium" | "large";
  sx?: SxProps;
}> = ({ setShowPalette, size, sx }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        // bgcolor: "var(--column-bg-color)",
        borderRadius: 10,
        transition: "all 0.5s ease-in-out",
        ...sx,
      }}
    >
      <ChangeColor size={size} laterFn={() => setShowPalette(false)} />
    </Paper>
  );
};

const MenuList: React.FC<{
  pages: {
    name: string;
    icon: React.ReactNode;
    action: string | React.Dispatch<React.SetStateAction<any>>;
    state?: boolean;
  }[];
  closeSidebar: (e: any) => void;
  listItemSx?: SxProps;
}> = ({ pages, closeSidebar, listItemSx }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const utilStore = useUtilsStore((state) => state);
  const { expandSidebar } = utilStore;

  const colorSetter = (page: { action: string | Function; state?: any }) => {
    if (typeof page.action === "function") {
      return page.state ? "var(--main-color)" : "default";
    } else {
      return location.pathname === page.action
        ? "var(--main-color)"
        : "default";
    }
  };

  if (!expandSidebar)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflowY: "scroll",
          height: "100%",
        }}
      >
        {pages.map((page, index) => (
          <Tooltip
            key={`menu-page-${index}`}
            title={page.name}
            placement="right"
            arrow
          >
            <IconButton
              onClick={(e) => {
                if (typeof page.action === "function") {
                  page.action(!page.state);
                  page.state
                    ? document.body.classList.remove("no-clicks")
                    : document.body.classList.add("no-clicks");
                } else {
                  navigate(page.action);
                  closeSidebar(e);
                }
              }}
              sx={{
                my: 0.75,
                color: colorSetter(page),
              }}
            >
              {page.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    );

  return (
    <List
      disablePadding
      sx={{
        width: "90%",
        overflowY: "scroll",
        height: "100%",
      }}
    >
      {pages.map((page, index) => (
        <ListItem
          key={index}
          sx={{
            width: "125%",
            ...listItemSx,
          }}
        >
          <Button
            color="inherit"
            onClick={(e) => {
              if (typeof page.action === "function") {
                page.action(!page.state);
                document.body.classList.contains("no-clicks")
                  ? document.body.classList.remove("no-clicks")
                  : document.body.classList.add("no-clicks");
              } else {
                navigate(page.action);
                closeSidebar(e);
              }
            }}
            sx={{
              textAlign: "left",
              width: "inherit",
              color: colorSetter(page),
            }}
          >
            <ListItemIcon sx={{ color: "inherit", fontSize: "25px" }}>
              {page.icon}
            </ListItemIcon>
            <ListItemText
              sx={{
                textTransform: "none",
                ml: -2,
              }}
            >
              {page.name}
            </ListItemText>
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
