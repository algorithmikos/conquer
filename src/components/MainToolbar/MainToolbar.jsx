import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Grid2 as Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  usePillarStore,
  useProjectStore,
  useTodoStore,
  useUtilsStore,
} from "../../store";

import {
  AccountBalance,
  Add,
  BlurOff,
  BlurOn,
  FolderSpecial,
  MenuOpen,
  Palette,
} from "@mui/icons-material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";

import moment from "moment-hijri";
import { hijriRomanMixedFullDate, timeNow } from "../../functions/utils";
import { useRecurringStore } from "../../stores/recurring";
import { useHabitStore } from "../../stores/habit";
import { useTranslation } from "react-i18next";
import SearchBar from "../SearchBar";
import PrioritySorter from "../Sorters/PrioritySorter/PrioritySorter";
import useNetworkStatus from "../../hooks/useNetworkStatus";
import LayoutMovementController from "../LayoutMovementController";
import ChangeColor from "../../pages/Settings/ChangeColor";

const MainToolbar = () => {
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const handleOpenAddMenu = (event) => {
    setAnchorElAdd(event.currentTarget);
  };

  const handleCloseAddMenu = () => {
    setAnchorElAdd(null);
  };

  const dailyState = useRecurringStore((state) => state);
  const { setDialog: setRecurringDialog } = dailyState;

  const todoState = useTodoStore((state) => state);
  const { setDialog: setJobDialog } = todoState;

  const habitState = useHabitStore((state) => state);
  const { setDialog: setHabitDialog } = habitState;

  const pillarState = usePillarStore((state) => state);
  const { setDialog: setPillarDialog } = pillarState;

  const projectState = useProjectStore((state) => state);
  const { setDialog: setProjectDialog } = projectState;

  const { hideContent, setHideContent } = useUtilsStore((state) => state);

  const [showPalette, setShowPalette] = useState(false);

  const { t, i18n } = useTranslation();
  const isOnline = useNetworkStatus();

  const iconStyle = {
    mr: i18n.language === "ar" ? 0 : 1,
    ml: i18n.language === "ar" ? 1 : 0,
  };

  const options = [
    {
      label: t("Job"),
      icon: <TaskAltIcon sx={iconStyle} />,
      onClick: () => {
        setJobDialog("new", true);
      },
    },
    {
      label: t("Recurring"),
      icon: <EventAvailableIcon sx={iconStyle} />,
      onClick: () => {
        setRecurringDialog("new", true);
      },
    },
    {
      label: t("Habit"),
      icon: <SwapVerticalCircleIcon sx={iconStyle} />,
      onClick: () => {
        setHabitDialog("new", true);
      },
    },
    {
      label: t("Project"),
      icon: <FolderSpecial sx={iconStyle} />,
      onClick: () => {
        setProjectDialog("new", true);
      },
    },
    {
      label: t("Pillar"),
      icon: <AccountBalance sx={iconStyle} />,
      onClick: () => {
        setPillarDialog("new", true);
      },
    },
  ];

  const [timeValue, setTimeValue] = useState(timeNow());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeValue(timeNow());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ bgcolor: "transparent", width: "95vw", p: 2 }}
    >
      <Grid>
        <Grid container justifyContent="center" alignItems="center" gap={1}>
          <Typography
            variant="h6"
            className="app-font"
            sx={{ direction: "rtl", fontWeight: "normal" }}
          >
            {hijriRomanMixedFullDate(moment().format("YYYY-MM-DD"))} —{" "}
            {timeValue}
          </Typography>
        </Grid>
      </Grid>

      <Grid>
        <SearchBar />
      </Grid>
      {/* <Grid >
          <PrioritySorter />
        </Grid> */}
      <Grid>
        <Button
          variant="contained"
          startIcon={<Add />}
          disableRipple
          sx={{ textTransform: "none" }}
          className="app-font"
          onClick={handleOpenAddMenu}
        >
          {t("Add_New")}
        </Button>
        <Menu
          sx={{ mt: 5 }}
          id="app-toolbar"
          anchorEl={anchorElAdd}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElAdd)}
          onClose={handleCloseAddMenu}
        >
          {options.map((option) => (
            <Box key={option.label}>
              <MenuItem
                onClick={() => {
                  handleCloseAddMenu();
                  option.onClick();
                }}
                sx={{
                  "&:hover": { bgcolor: "green" },
                  direction: i18n.language === "ar" ? "rtl" : "ltr",
                }}
              >
                {option.icon}{" "}
                <Typography textAlign="center" className="app-font">
                  {option.label}
                </Typography>
              </MenuItem>
              {option.label === t("Habit") && <Divider />}
            </Box>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

export default MainToolbar;
