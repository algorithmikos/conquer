import { Grid2 as Grid, IconButton, TextField } from "@mui/material";
import {
  usePillarStore,
  useProjectStore,
  useTodoStore,
  useUtilsStore,
} from "../../store";
import { useEffect, useState } from "react";
import { useRecurringStore } from "../../stores/recurring";
import { useTranslation } from "react-i18next";
import { Clear, Search } from "@mui/icons-material";
import { useHabitStore } from "../../stores/habit";
import { useLocation } from "react-router-dom";
import { useMediaQueries } from "../../functions/screenSizes";
import useDebounce from "../../hooks/useDebounce";

const SearchBar = () => {
  const utilsState = useUtilsStore((state) => state);
  const { searchTerm, setSearchTerm } = utilsState;

  // Task stores
  const recurringTaskState = useRecurringStore((state) => state);
  const { dailies, setFilteredDailies } = recurringTaskState;

  const todoState = useTodoStore((state) => state);
  const { todos, setFilteredJobs } = todoState;

  const habitState = useHabitStore((state) => state);
  const { habits, setFilteredHabits } = habitState;

  // Container stores
  const pillarState = usePillarStore();
  const { pillars, setFilteredPillars } = pillarState;

  const projectState = useProjectStore();
  const { projects, setFilteredProjects } = projectState;

  // Hooks
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { xs } = useMediaQueries();

  // Local states
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Functions
  const handleClear = () => {
    setLocalSearchTerm("");
  };

  useDebounce({
    callback: () => {
      setSearchTerm(localSearchTerm);
    },
    value: localSearchTerm,
  });

  /*** UseEffects ***/
  // Update the filtered tasks
  useEffect(() => {
    setFilteredDailies(
      dailies.filter((daily) =>
        daily.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredJobs(
      todos.filter((todo) =>
        // @ts-ignore
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredHabits(
      habits.filter((habit) =>
        habit.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredPillars(
      pillars.filter((pillar) =>
        // @ts-ignore
        pillar.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredProjects(
      projects.filter((project) =>
        // @ts-ignore
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Clear search on location change
  useEffect(() => {
    handleClear();
  }, [location]);
  /*** UseEffects ***/

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction={i18n.language === "ar" ? "row-reverse" : "row"}
    >
      <TextField
        fullWidth={xs}
        autoComplete="off"
        variant="outlined"
        // size={xs ? "medium" : "small"}
        size="small"
        label={t("Search")}
        placeholder={t("Search")}
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClear();
          }
        }}
        sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
        InputProps={{
          startAdornment: (
            <Search
              sx={{
                color: "GrayText",
                mr: i18n.language === "ar" ? 1 : 0.5,
                ml: i18n.language === "ar" ? -1 : -0.5,
              }}
            />
          ),
          endAdornment: localSearchTerm && (
            <IconButton
              color="default"
              onClick={handleClear}
              sx={{ mx: i18n.language === "ar" ? 0.5 : -1.5 }}
            >
              <Clear />
            </IconButton>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
  );
};

export default SearchBar;
