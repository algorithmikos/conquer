import { useHabitStore } from "../../../../stores/habit";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { TabPanel } from "@mui/lab";

import TaskInfo from "../../TaskTab/TaskInfo";
import {
  Box,
  Card,
  Chip,
  Grid2 as Grid,
  Grow,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, Remove } from "@mui/icons-material";
// @ts-ignore
import OptionsMenu from "../../../../components/OptionsMenu/OptionsMenu";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Habit } from "../../../../functions/backend/schemas/Habit.model";
import HabitController from "../../../../functions/backend/functions/Habit";
import ContainerName from "../../TaskTab/ContainerName";
import { textDirection } from "../../../../functions/textDirection";
import { Reorder } from "framer-motion";
import { useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import Explainer from "../../../../components/Explainer/Explainer";
// @ts-ignore
import WalkinOutsideSvg from "../../../../assets/svgs/WalkinOutsideSvg";
import { useUtilsStore } from "../../../../store";
import { CollectionOptions, dbm } from "../../../../backend/database/dbm";

const HabitTab: React.FC<{
  tab: string;
  isDroppable: boolean;
  condition: string;
  additions?: JSX.Element;
}> = ({ tab, condition, additions }) => {
  const { xs } = useMediaQueries();
  const { i18n, t } = useTranslation();
  const { updateHabit } = HabitController();

  const recurringTaskState = useHabitStore((state) => state);
  const { setDialog, setInstance } = recurringTaskState;

  const habitState = useHabitStore((state) => state);
  const {
    setHabits,
    filteredHabits,
    setFilteredHabits,
    updateHabit: updateStateHabit,
  } = habitState;

  const utilsState = useUtilsStore((state) => state);
  const { isDraggable, hideContent } = utilsState;

  const [habitOrder, setHabitOrder] = useState<string[]>([]);

  const today = moment().utc().startOf("day").valueOf();

  const iconStyle = {
    mr: i18n.language === "ar" ? 0 : 1,
    ml: i18n.language === "ar" ? 1 : 0,
  };

  useDebounce({
    callback: () => {
      isDraggable &&
        habitOrder.length > 0 &&
        dbm.updateServerDoc(
          CollectionOptions.users,
          /* @ts-ignore */
          JSON.parse(localStorage.getItem("currentUser"))?.$id,
          {
            habitOrder: habitOrder,
          }
        );
      setHabitOrder([]);
    },
    value: habitOrder,
    delay: 1000,
  });

  const handleIncrement = (habit: Habit) => {
    let completedDates = habit.completedDates
      ? { ...habit.completedDates }
      : {};

    if (Object.keys(completedDates).includes(String(today))) {
      completedDates = {
        ...habit.completedDates,
        // @ts-ignore
        [today]: habit.completedDates[today] + 1,
      };
    } else {
      completedDates = {
        ...completedDates,
        [today]: 1,
      };
    }

    const updatedHabit = {
      ...habit,
      completedDates: completedDates,
      streak: habit.streak ? habit.streak + 1 : 1,
    };

    updateStateHabit(updatedHabit);

    updateHabit(
      // @ts-ignore
      {
        completedDates: completedDates,
        streak: habit.streak ? habit.streak + 1 : 1, // Increment streak
      },
      habit.$id
    );
  };

  const handleDecrement = (habit: Habit) => {
    let completedDates = habit.completedDates
      ? { ...habit.completedDates }
      : {};

    if (Object.keys(completedDates).includes(String(today))) {
      completedDates = {
        ...habit.completedDates,
        // @ts-ignore
        [today]: habit.completedDates[today] - 1,
      };
    } else {
      completedDates = {
        ...completedDates,
        [today]: 0,
      };
    }

    const updatedHabit = {
      ...habit,
      completedDates: completedDates,
      streak: habit.streak ? habit.streak - 1 : 0,
    };

    updateStateHabit(updatedHabit);

    updateHabit(
      // @ts-ignore
      {
        completedDates: completedDates,
        streak: habit.streak ? habit.streak - 1 : 0, // Increment streak
      },
      habit.$id
    );
  };

  return (
    <TabPanel
      value={tab}
      sx={{
        p: 0,
        minWidth: "var(--task-column-width)",
        minHeight: xs ? 600 : 450,
      }}
    >
      {additions}
      <DropArea
        isDroppable={isDraggable}
        filteredHabits={filteredHabits}
        setFilteredHabits={setFilteredHabits}
        setHabits={setHabits}
        setHabitOrder={setHabitOrder}
      >
        {filteredHabits.length ? (
          filteredHabits
            .filter((habit) => {
              switch (condition) {
                case "all":
                  return true;
                case "active":
                  return habit.status === "active";
                default:
                  return true;
              }
            })
            .map((habit) => (
              <DragItem key={habit.$id} isDraggable={isDraggable} habit={habit}>
                <Grow in timeout={1000}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 1,
                      width: "var(--task-card-width)",
                      cursor: isDraggable ? "grab" : "default",
                      // @ts-ignore
                      bgcolor: habit.color || "",
                      mt: 0.5,
                    }}
                    onMouseDown={(e) => {
                      isDraggable &&
                        (e.currentTarget.style.cursor = "grabbing");
                    }}
                    onMouseUp={(e) => {
                      isDraggable && (e.currentTarget.style.cursor = "grab");
                    }}
                  >
                    <Grid
                      container
                      py={0.5}
                      px={1}
                      justifyContent="center"
                      direction="column"
                      sx={{ flexGrow: 1 }}
                    >
                      {/* Card Header */}
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ flexGrow: 1, width: "100%" }}
                        mb={1}
                      >
                        <IconButton
                          disableTouchRipple
                          disableFocusRipple
                          onClick={() => handleDecrement(habit)}
                        >
                          <Remove />
                        </IconButton>

                        <Typography
                          variant="body1"
                          onClick={() => {
                            console.log(habit);
                            setInstance("modified", habit);
                            setDialog("modify", true);
                          }}
                          sx={{
                            cursor: "pointer",
                            filter: hideContent ? "blur(4px)" : "none",
                          }}
                        >
                          {habit.title}
                        </Typography>

                        <IconButton
                          disableTouchRipple
                          disableFocusRipple
                          onClick={() => handleIncrement(habit)}
                        >
                          <Add />
                        </IconButton>
                      </Grid>
                      {/* End of Card Header */}

                      {/* Card Info */}
                      <Box
                        sx={{
                          direction:
                            /* @ts-ignore */
                            textDirection(habit.description) === "right"
                              ? "rtl"
                              : "ltr",
                          /* @ts-ignore */
                          textAlign: textDirection(habit.description),
                        }}
                      >
                        <TaskInfo task={habit} />
                      </Box>
                      {/* End of Card Info */}

                      {/* Card Today Counter */}
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        direction={
                          i18n.language === "ar" ? "row-reverse" : "row"
                        }
                        mt={1}
                        className="card-header"
                      >
                        <Grid
                          container
                          justifyContent="space-evenly"
                          alignItems="center"
                          gap={2}
                        >
                          <Box>
                            <Chip
                              color={
                                habit.completedDates &&
                                habit.completedDates[today]
                                  ? "primary"
                                  : "default"
                              }
                              size="small"
                              label={
                                habit.completedDates
                                  ? habit.completedDates[today] || 0
                                  : 0
                              }
                              sx={{ mr: 0.5 }}
                            />
                            {t("Today")}
                          </Box>

                          <Box>
                            <Chip
                              color={habit.streak ? "success" : "default"}
                              size="small"
                              label={habit.streak || 0}
                              sx={{ mr: 0.5 }}
                            />
                            {t("Streak")}
                          </Box>
                        </Grid>

                        <Box className="card-options">
                          <OptionsMenu
                            options={[
                              {
                                name: t("Edit"),
                                icon: <Edit sx={iconStyle} />,
                                category: "habits",
                                textColor: "skyblue",
                                onClick: () => {
                                  setInstance("modified", habit);
                                  setDialog("modify", true);
                                },
                              },
                              {
                                name: t("Delete"),
                                icon: <Delete sx={iconStyle} />,
                                category: "habits",
                                textColor: "red",
                                onClick: () => {
                                  setInstance("modified", habit);
                                  setDialog("delete", true);
                                },
                              },
                            ]}
                          />
                        </Box>
                      </Grid>
                      {/* End of Card Today Counter */}

                      <ContainerName
                        containerCategory="pillar"
                        /* @ts-ignore */
                        containerIds={habit.pillars}
                      />
                    </Grid>
                  </Card>
                </Grow>
              </DragItem>
            ))
        ) : (
          <Explainer
            svg={<WalkinOutsideSvg />}
            text={t("EmptyHabitsLabel")}
            sx={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
            }}
          />
        )}
      </DropArea>
    </TabPanel>
  );
};

export default HabitTab;

const DropArea: (props: {
  isDroppable: boolean;
  filteredHabits: Habit[];
  setFilteredHabits: (habits: Habit[]) => void;
  setHabits: (habits: Habit[]) => void;
  setHabitOrder: (habitOrder: string[]) => void;
  children: any;
}) => JSX.Element = ({
  isDroppable,
  filteredHabits,
  setFilteredHabits,
  setHabits,
  setHabitOrder,
  children,
}) => {
  if (isDroppable) {
    return (
      <Reorder.Group
        values={filteredHabits}
        onReorder={(reordered) => {
          setFilteredHabits(reordered);
          setHabits(reordered);
          /* @ts-ignore */
          setHabitOrder(reordered.map((habit) => habit.$id));
        }}
        style={{
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </Reorder.Group>
    );
  }

  return children;
};

const DragItem: (props: {
  isDraggable: boolean;
  habit: Habit;
  children: any;
}) => JSX.Element = ({ isDraggable, habit, children }) => {
  if (isDraggable) {
    return (
      <Reorder.Item value={habit} as="div">
        {children}
      </Reorder.Item>
    );
  }

  return children;
};
