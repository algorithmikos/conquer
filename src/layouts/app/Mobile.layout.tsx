import AppRoutes from "../../routes/AppRoutes";
import { Box, Grid2 as Grid, IconButton, Typography } from "@mui/material";
import { shortHijriDate, shortRomanDate } from "../../functions/utils";
import moment from "moment";
// @ts-ignore
import BottomBar from "../../components/Navigation/BottomBar/BottomBar";
import SearchBar from "../../components/SearchBar";
import { useTranslation } from "react-i18next";
import NetworkStatus from "../../components/NetworkStatus";
import LayoutMovementController from "../../components/LayoutMovementController";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AccountBox,
  ArrowBack,
  FilterList,
  Menu,
  Search,
} from "@mui/icons-material";
import { useUtilsStore } from "../../store";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
// @ts-ignore
import UpperBar from "../../components/Navigation/UpperBar/UpperBar";

const Mobile = () => {
  const { i18n } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const utilStore = useUtilsStore((state) => state);
  const { profilePic, setShowMobileSidebar } = utilStore;

  const [showSearch, setShowSearch] = useState(false);
  const [coordinates, setCoordinates] = useState<Record<string, number | null>>(
    {
      startX: null,
      startY: null,
      endX: null,
      endY: null,
    }
  );
  const { startX, startY, endX, endY } = coordinates;

  /* @ts-ignore */
  const authState = JSON.parse(localStorage.getItem("authState")) ?? {};

  useEffect(() => {
    const swipeThreshold = 50; // Set the swipe threshold (e.g., 50px)

    const handleTouchStart = (event: TouchEvent) => {
      setCoordinates((prev) => ({
        ...prev,
        startX: event.touches[0].clientX,
        startY: event.touches[0].clientY,
      }));
    };

    const handleTouchMove = (event: TouchEvent) => {
      setCoordinates((prev) => ({
        ...prev,
        endX: event.touches[0].clientX,
        endY: event.touches[0].clientY,
      }));
    };

    const handleTouchEnd = () => {
      if (endX && startX && endY && startY) {
        /* @ts-ignore */
        const diffX = endX - startX;
        /* @ts-ignore */
        const diffY = endY - startY;

        if (
          Math.abs(diffX) > Math.abs(diffY) &&
          Math.abs(diffX) > swipeThreshold
        ) {
          // Horizontal swipe, only if it exceeds the threshold
          if (diffX > 0) {
            console.log("Swipe Right");
            switch (location.pathname) {
              case "/systems":
                navigate("/planner/habits");
                break;
              case "/planner/habits":
                navigate("/planner/dailies");
                break;
              case "/planner/dailies":
                navigate("/planner/todos");
                break;
              default:
                break;
            }
          } else {
            console.log("Swipe Left");
            switch (location.pathname) {
              case "/planner/todos":
                navigate("/planner/dailies");
                break;
              case "/planner/dailies":
                navigate("/planner/habits");
                break;
              case "/planner/habits":
                navigate("/systems");
                break;
              default:
                break;
            }
          }
        } else if (Math.abs(diffY) > swipeThreshold) {
          // Vertical swipe (optional)
          if (diffY > 0) {
            console.log("Swipe Down");
          } else {
            console.log("Swipe Up");
          }
        }

        // Reset coordinates
        setCoordinates({
          startX: null,
          startY: null,
          endX: null,
          endY: null,
        });
      }
    };

    // Add touch event listeners
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    // Cleanup the event listeners on component unmount
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [coordinates]);

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid
          container
          direction="column"
          sx={{
            width: "100%",
            // border: "1px solid #2c2c36",
            // borderRadius: 2,
            py: 1,
            px: 2,
            borderBottom: "1px solid #2c2c36",
            position: "absolute",
            top: 0,
          }}
        >
          {/* First Row: Two elements on the left, two on the right */}
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                key="searchBar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0 },
                }}
              >
                <Grid
                  container
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{ width: "100%", mb: 2 }}
                >
                  <Box sx={{ flexBasis: "10%", mr: 1 }}>
                    <IconButton
                      onClick={() => {
                        setShowSearch(false);
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <SearchBar />
                  </Box>
                </Grid>
              </motion.div>
            ) : (
              <motion.div
                key="iconBar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0 },
                }}
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%", mb: -4 }}
                >
                  <Grid
                    container
                    sx={{
                      flexGrow: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ mr: 1 }}>
                      <IconButton
                        onClick={() => {
                          setShowMobileSidebar(true);
                          document.body.classList.add("no-scroll", "no-clicks");
                        }}
                      >
                        <Menu />
                      </IconButton>
                    </Box>
                    <Typography>{authState?.name}</Typography>
                  </Grid>
                  <Grid
                    container
                    sx={{ flexBasis: "30%", justifyContent: "flex-end" }}
                  >
                    <Box sx={{ mr: 1 }}>
                      <IconButton onClick={() => setShowSearch(true)}>
                        <Search />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton>
                        <FilterList />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Second Row: One element on the left, one element taking the remaining space on the right */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", mb: 1 }}
          >
            <Box sx={{ flexBasis: "20%", mr: 1 }}>
              {profilePic ? (
                <img
                  src={profilePic}
                  height={85}
                  width={85}
                  alt="profile-pic"
                  style={{ borderRadius: "5%" }}
                />
              ) : (
                <AccountBox sx={{ height: 85, width: 85 }} />
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              >
                {moment().format("dddd")}
              </Typography>
              <Typography
                sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              >
                {shortHijriDate(moment().format("YYYY-MM-DD"))}
              </Typography>
              <Typography
                sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              >
                {shortRomanDate(moment().format("YYYY-MM-DD"))}
              </Typography>
            </Box>
          </Grid>

          {/* Third Row: Two elements on the right */}
          <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Box sx={{ mr: 1 }}>
              <LayoutMovementController />
            </Box>
            <Box>
              <NetworkStatus />
            </Box>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" mt={18} mb={5}>
          <AppRoutes />
        </Grid>

        <BottomBar />
      </Grid>
      <Sidebar />
    </>
  );
};

export default Mobile;
