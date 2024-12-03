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
  Typography,
} from "@mui/material";
import { useAuthStore, useUtilsStore } from "../store";
import {
  AccountBalance,
  ArrowBack,
  Flaky,
  Groups,
  HistoryEdu,
  Settings,
  Storage,
  TaskAlt,
  Timer,
  Today,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "../functions/screenSizes";

const Sidebar = () => {
  const { t } = useTranslation();
  const { xs } = useMediaQueries();
  const navigate = useNavigate();

  const utilStore = useUtilsStore((state) => state);
  const { showMobileSidebar, setShowMobileSidebar, profilePic } = utilStore;

  const { authenticated } = useAuthStore((state) => state);

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
    { name: t("Recurrings"), icon: <Today />, link: "/planner/dailies" },
    { name: t("Jobs"), icon: <TaskAlt />, link: "/planner/todos" },
    {
      name: t("Habits"),
      icon: <Flaky />,
      link: "/planner/habits",
    },
    { name: t("Pillars"), icon: <AccountBalance />, link: "/planner/pillars" },
    { name: t("Projects"), icon: <HistoryEdu />, link: "/planner/projects" },
    { name: t("Systems"), icon: <Storage />, link: "/systems" },
    { name: t("Time_Machine_1500"), icon: <Timer />, link: "/planner/history" },
    {
      name: t("Contributors"),
      icon: <Groups />,
      link: "/conquer/contributors",
    },
  ];

  const closeSidebar = (e: any) => {
    e.preventDefault();
    setShowMobileSidebar(false);
    document.body.classList.remove("no-scroll", "no-clicks");
  };

  if (authenticated)
    return (
      <>
        <AnimatePresence>
          {showMobileSidebar && (
            <ClickAwayListener onClickAway={closeSidebar}>
              <motion.div
                initial={{
                  left: -500,
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                  left: 0,
                  transition: { duration: 0.25 },
                }}
                exit={{
                  left: -500,
                  opacity: 0,
                  transition: { duration: 0.25 },
                }}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(10px)",
                  // boxShadow: "0 10px 7px 10px black",
                  // position: "absolute",
                  // height: "100%",
                  // width: "85%",
                  position: "fixed",
                  width: xs ? "85vw" : "30vw",
                  height: "100vh",
                  left: 0,
                  overflow: "hidden",

                  top: 0,
                  zIndex: 1001,
                  padding: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  pointerEvents: "auto",
                }}
              >
                {/* First Row */}
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ flexGrow: 1 }}
                >
                  <IconButton sx={{ flexBasis: "10%" }} onClick={closeSidebar}>
                    <ArrowBack />
                  </IconButton>

                  {profilePic ? (
                    <Avatar
                      sx={{ width: 30, height: 30 }}
                      alt="Thy Profile Picture"
                      src={profilePic}
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 30, height: 30, bgcolor: "skyblue" }}
                      alt="Thy Profile Picture"
                      src=""
                    >
                      {authState?.displayName?.[0]?.toUpperCase() || ""}
                    </Avatar>
                  )}

                  <Box sx={{ flexGrow: 1, ml: 2, textAlign: "start" }}>
                    <Typography>{authState?.name}</Typography>
                    <Typography variant="body2" color="lightgray">
                      @{userState?.username}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={(e) => {
                      navigate("/settings");
                      closeSidebar(e);
                    }}
                  >
                    <Settings />
                  </IconButton>
                </Grid>

                <Divider sx={{ mt: 1.5 }} />

                {/* Second Row */}
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="start"
                  sx={{ flexGrow: 1 }}
                >
                  <List>
                    {appPages.map((page, index) => (
                      <ListItem key={index} sx={{ width: "100vw" }}>
                        <Button
                          color="inherit"
                          onClick={(e) => {
                            navigate(page.link);
                            closeSidebar(e);
                          }}
                          sx={{ textAlign: "left", width: "inherit" }}
                        >
                          <ListItemIcon>{page.icon}</ListItemIcon>
                          <ListItemText>{page.name}</ListItemText>
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </motion.div>
            </ClickAwayListener>
          )}
        </AnimatePresence>
        {showMobileSidebar && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.25)",
              display: "block",
              zIndex: 1000,
              pointerEvents: "auto",
            }}
          />
        )}
      </>
    );
};

export default Sidebar;
