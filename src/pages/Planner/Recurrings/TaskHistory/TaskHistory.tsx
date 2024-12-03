import { useEffect, useState } from "react";
import { useRecurringStore } from "../../../../stores/recurring";
import {
  Alert,
  AlertTitle,
  Card,
  Divider,
  Grid2 as Grid,
  Grow,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
// @ts-ignore
import { textDirection } from "../../../../functions/textDirection";
import { RecurringTask } from "../../../../functions/backend/schemas/RecurringTask.model";
// @ts-ignore
import "../../../../utils/ar-cl";

import TaskHeader from "../../TaskTab/TaskHeader";
import { useMediaQueries } from "../../../../functions/screenSizes";
import TaskSubTasks from "../../TaskTab/TaskSubTasks";
import TaskSubTasksCollapse from "../../TaskTab/TaskSubTasksCollapse";
import moment from "moment";

import { getDayName, shortHijriDate } from "../../../../functions/utils";
// @ts-ignore
import Explainer from "../../../../components/Explainer/Explainer"; // @ts-ignore
// @ts-ignore
import HatchLoaderSvg from "../../../../assets/svgs/HatchLoaderSvg/HatchLoaderSvg";
import EmptyListSvg from "../../../../assets/svgs/EmptyListSvg";
import SelectSvg from "../../../../assets/svgs/SelectSvg";
import { getDueDates } from "../../../../functions/getDueDates";
import { useTranslation } from "react-i18next";
import RecurringTaskController from "../../../../functions/backend/functions/RecurringTask";

function getMissingDays(unixTimestamps: number[]) {
  if (!unixTimestamps || unixTimestamps?.length === 0) {
    return [];
  }
  const startDate = moment
    .unix(unixTimestamps[unixTimestamps?.length - 1] / 1000)
    .utc();
  const endDate = moment().utc().subtract(1, "day").startOf("day").valueOf();

  const allDays = [];

  // Generate all days between the start and end dates
  let currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    allDays.push(currentDate.utc().startOf("day").clone().valueOf());
    currentDate.add(1, "day");
  }

  // Filter out days that are already in the original array
  const missingDays = allDays.filter((day) => !unixTimestamps.includes(day));

  return missingDays;
}

const TaskHistory = () => {
  const { xs } = useMediaQueries();
  const { t, i18n } = useTranslation();

  const { dailies, setInstance, setDialog, dayOfRecord } = useRecurringStore(
    (state) => state
  );

  const [selectedTask, setSelectedTask] = useState<
    RecurringTask | { [key: string]: any }
  >({});
  const [missingDays, setMissingDays] = useState<number[]>([]);
  const [grown, setGrown] = useState(true);
  const [recurringChecklistStatus, setRecurringChecklistStatus] = useState({});
  const [page, setPage] = useState(1);

  const itemsPerPage = xs ? 5 : 8;
  const totalPages = Math.ceil(missingDays?.length / itemsPerPage);
  const paginatedData = missingDays
    .sort((a, b) => b - a)
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const { handleRecurringTaskCheck, handleChecklistItemCheck } =
    RecurringTaskController();

  useEffect(() => {
    if (selectedTask) {
      const task = dailies.find((daily) => daily.$id === selectedTask.$id);
      task && setSelectedTask(task);
      // @ts-ignore
      const dueDates = getDueDates(task, dayOfRecord)?.dueDates;
      // @ts-ignore
      const missingDates = getMissingDays(task?.completedDates);

      // If the task repeats in a non-daily manner, we need to filter
      // the missing dates based on the repeatance days of the task.
      // @ts-ignore
      if (task?.repeatanceDays?.length > 0 && task?.repeats !== "daily") {
        if (dueDates && dueDates.length > 0) {
          // If there are due dates, we need to filter the missing dates
          // to only include those that are both in the due dates and
          // in the repeatance days of the task.
          setMissingDays(
            missingDates.filter((day) => {
              const dayOfWeek = moment
                .unix(day / 1000)
                .utc()
                .weekday();

              return (
                dueDates.includes(day) &&
                // @ts-ignore
                task.repeatanceDays.includes(dayOfWeek)
              );
            })
          );
        } else {
          // If there are no due dates, we can just filter the missing
          // dates based on the repeatance days of the task.
          setMissingDays(
            missingDates.filter((day) => {
              const dayOfWeek = moment
                .unix(day / 1000)
                .utc()
                .weekday();

              // @ts-ignore
              return task.repeatanceDays.includes(dayOfWeek);
            })
          );
        }
      } else {
        // If the task repeats in a daily manner, we can just use the
        // due dates as is, or use the missing dates if there are no
        // due dates.
        dueDates && dueDates.length > 0
          ? setMissingDays(missingDates.filter((day) => dueDates.includes(day)))
          : setMissingDays(missingDates);
      }
    }
  }, [dailies, selectedTask]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{ mt: 5, mb: xs ? 10 : 0 }}
      gap={1}
    >
      <Typography
        variant="h4"
        component="h1"
        className="app-font"
        sx={{ mb: 2 }}
      >
        {t("Time_Machine_1500")}
      </Typography>

      <Grid sx={{ width: "100%" }}>
        <TextField
          sx={{ width: xs ? "100%" : "var(--task-card-width)" }}
          select
          label={t("Recurring_Task")}
          value={selectedTask?.$id || ""}
          onChange={(e) => {
            setGrown(false);
            const selectedRecurringTask = dailies.find(
              (daily) => daily.$id === e.target.value
            );
            selectedRecurringTask && setSelectedTask(selectedRecurringTask);
            setTimeout(() => setGrown(true), 200);
          }}
        >
          {dailies
            .filter((daily) => daily.compensable)
            .map((daily) => (
              <MenuItem
                key={daily.$id}
                value={daily.$id}
                className="app-font"
                sx={{
                  direction:
                    textDirection(daily.title) === "left" ? "ltr" : "rtl",
                }}
                onClick={() => {
                  if (daily?.$id === selectedTask?.$id) setSelectedTask({});
                }}
              >
                {daily.title}
              </MenuItem>
            ))}
        </TextField>
      </Grid>

      {!grown && (
        <Grid>
          <Explainer
            text="Loading records..."
            svg={<HatchLoaderSvg />}
            sx={{ my: 3 }}
          />
        </Grid>
      )}

      {Object.keys(selectedTask).length > 0 &&
        missingDays.length > 0 &&
        grown && (
          <>
            {totalPages > 1 && (
              <Grid sx={{ mt: 1 }}>
                <Pagination
                  count={totalPages}
                  shape="rounded"
                  siblingCount={0}
                  color="primary"
                  onChange={(_, newPage) => setPage(newPage)}
                />
              </Grid>
            )}

            <Grid>
              <Alert
                severity="info"
                sx={{
                  textAlign: "start",
                  width: xs ? "100%" : "var(--task-column-width)",
                }}
              >
                <AlertTitle className="app-font">
                  About {selectedTask.title}
                </AlertTitle>
                <Typography className="app-font">
                  - Total Left: {missingDays.length} day
                  {missingDays.length > 1 && "s"}
                </Typography>
                {totalPages > 1 && (
                  <Typography className="app-font">
                    - In current page: {paginatedData.length} day
                    {paginatedData.length > 1 && "s"}
                  </Typography>
                )}
              </Alert>
            </Grid>

            {/* <Grid > */}

            <Grid
              container
              sx={{ mt: 2 }}
              gap={1}
              justifyContent="center"
              direction="row-reverse"
            >
              {paginatedData
                .sort((a, b) => b - a)
                .map((date, index) => (
                  <Grow
                    key={date}
                    in={grown}
                    timeout={{ enter: 1000, exit: 1000 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        width: xs ? "100%" : "var(--task-card-width)",
                        cursor: "pointer",
                        pb: 1.5,
                      }}
                    >
                      <Alert
                        severity="info"
                        icon={false}
                        className="app-font"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          direction: i18n.language === "ar" ? "rtl" : "ltr",
                          whiteSpace: "pre-wrap",
                          width: "100%",
                        }}
                      >
                        {`${moment.unix(date / 1000).fromNow()}\n ${getDayName(
                          moment.unix(date / 1000).weekday()
                        )}، ${shortHijriDate(
                          moment.unix(date / 1000).format("YYYY-MM-DD")
                        )} — ${moment.unix(date / 1000).format("YYYY-MM-DD")}`}
                      </Alert>
                      <Divider />

                      <TaskHeader
                        // @ts-ignore
                        task={selectedTask}
                        checkedObserver={selectedTask?.completedDates?.includes(
                          date
                        )}
                        // @ts-ignore
                        handleTaskCheck={handleRecurringTaskCheck}
                        setInstance={setInstance}
                        setDialog={setDialog}
                        completionDate={date}
                        injectedDoR
                      />

                      {/* Daily Sub-Tasks */}
                      <TaskSubTasks
                        task={selectedTask}
                        checklistStatus={recurringChecklistStatus}
                        setChecklistStatus={setRecurringChecklistStatus}
                        id={date}
                        localStorageChecklistStatus="recurringChecklistStatus"
                        listFilter={(item) =>
                          item?.completedDates?.includes(date)
                        }
                      />
                      <TaskSubTasksCollapse
                        checklistStatus={recurringChecklistStatus}
                        task={selectedTask}
                        parentIndex={index}
                        // @ts-ignore
                        handleChecklistItemCheck={handleChecklistItemCheck}
                        checkedObserver={(childTask) =>
                          childTask.completedDates?.includes(date)
                        }
                        completionDate={date}
                        id={date}
                      />
                      {/* End of Daily Sub-Tasks */}
                    </Card>
                  </Grow>
                ))}
            </Grid>

            {/* </Grid> */}
          </>
        )}

      {Object.keys(selectedTask).length > 0 && !missingDays.length && grown && (
        <Grid>
          <Explainer
            svg={<EmptyListSvg height={200} width={150} />}
            text="There is no uncompleted tasks!"
          />
        </Grid>
      )}

      {!Object.keys(selectedTask).length && grown && (
        <Grid>
          <Explainer
            svg={<SelectSvg height={200} width={150} />}
            text="There is no selected task!"
            sx={{ opacity: 0.9 }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default TaskHistory;
