import { useEffect, useState, useMemo, memo, MemoExoticComponent } from "react";

import moment from "moment";

import { useRecurringStore } from "../../../../stores/recurring";
import { useUtilsStore } from "../../../../store";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { TabPanel } from "@mui/lab";
import { RecurringTask } from "../../../../functions/backend/schemas/RecurringTask.model";

import TaskHeader from "../../TaskTab/TaskHeader";
import TaskInfo from "../../TaskTab/TaskInfo";
import TaskSubTasks from "../../TaskTab/TaskSubTasks";
import TaskSubTasksCollapse from "../../TaskTab/TaskSubTasksCollapse";
import TaskTime from "../../TaskTab/TaskTime";
import ContainerName from "../../TaskTab/ContainerName";
import { Card, Grid2 as Grid, Grow } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CollectionOptions, dbm } from "../../../../backend/database/dbm";
import { DoNotDisturb } from "@mui/icons-material";
import { getDueDates } from "../../../../functions/getDueDates";
import { recordFilter } from "../../../../functions/recordFilter";
import Explainer from "../../../../components/Explainer/Explainer";
// @ts-ignore
import DroneRaceSvg from "../../../../assets/svgs/DroneRaceSvg";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import useDebounce from "../../../../hooks/useDebounce";
import RecurringTaskController from "../../../../functions/backend/functions/RecurringTask";

const RecurringTaskTab: React.FC<{
  tab: string;
  isDroppable: boolean;
  condition: string;
  additions?: JSX.Element;
}> = ({ tab, condition, additions }) => {
  const { xs } = useMediaQueries();
  const { i18n, t } = useTranslation();

  const recurringTaskState = useRecurringStore((state) => state);
  const {
    setDailies: setRecurrings,

    filteredDailies: filteredRecurrings,
    setFilteredDailies: setFilteredRecurrings,

    dayOfRecord,

    setDialog,
    setInstance,

    recurringChecklistStatus,
    setRecurringChecklistStatus,

    updateRecurringTask,
  } = recurringTaskState;

  const isDraggable = useUtilsStore((state) => state.isDraggable);

  const { handleRecurringTaskCheck, handleChecklistItemCheck } =
    RecurringTaskController();

  const [RTOrder, setRTOrder] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage.getItem("recurringChecklistStatus")) {
      setRecurringChecklistStatus(
        // @ts-ignore
        JSON.parse(localStorage.getItem("recurringChecklistStatus"))
      );
    }
  }, []);

  useEffect(() => {
    if (Object.keys(recurringChecklistStatus).length > 0) {
      localStorage.setItem(
        "recurringChecklistStatus",
        JSON.stringify(recurringChecklistStatus)
      );
    }
  }, [recurringChecklistStatus]);

  useDebounce({
    callback: () => {
      isDraggable &&
        RTOrder.length > 0 &&
        dbm.updateServerDoc(
          CollectionOptions.users,
          /* @ts-ignore */
          JSON.parse(localStorage.getItem("currentUser"))?.$id,
          {
            rTaskOrder: RTOrder,
          }
        );
    },
    value: RTOrder,
    delay: 1000,
  });

  const completionDate = moment.utc(dayOfRecord).set("hour", 0).valueOf();

  const handleSkip = async (recurring: RecurringTask) => {
    if (recurring.skippedDates?.includes(completionDate)) {
      const updatedTask = {
        ...recurring,
        skippedDates: recurring.skippedDates.filter(
          (date: number) => date !== completionDate
        ),
      };
      updateRecurringTask(updatedTask);
      await dbm.updateServerDoc(
        CollectionOptions.recurringTasks,
        /* @ts-ignore */
        recurring.$id,
        {
          skippedDates: recurring.skippedDates.filter(
            (date: number) => date !== completionDate
          ),
        }
      );
    } else {
      const updatedTask = {
        ...recurring,
        skippedDates: [
          completionDate,
          /* @ts-ignore */
          ...recurring.skippedDates,
        ],
      };
      updateRecurringTask(updatedTask);
      await dbm.updateServerDoc(
        CollectionOptions.recurringTasks,
        /* @ts-ignore */
        recurring.$id,
        {
          skippedDates: [
            completionDate,
            /* @ts-ignore */
            ...recurring.skippedDates,
          ],
        }
      );
    }
  };

  return (
    <TabPanel
      value={tab}
      sx={{
        p: 0,
        // pt: 2.5,
        minWidth: "var(--task-column-width)",
        minHeight: xs ? 600 : 450,
        // height: "100vh",
        // overflow: "auto",
      }}
    >
      {additions}
      {filteredRecurrings.filter((recurring) =>
        recordFilter(recurring, condition, dayOfRecord)
      ).length ? (
        <DropArea
          isDroppable={isDraggable}
          filteredRecurrings={filteredRecurrings}
          setFilteredRecurrings={setFilteredRecurrings}
          setRecurrings={setRecurrings}
          setRTOrder={setRTOrder}
        >
          <AnimatePresence>
            {filteredRecurrings
              .filter((recurring) =>
                recordFilter(recurring, condition, dayOfRecord)
              )
              .map((recurring, index) => (
                <DragItem
                  isDraggable={isDraggable}
                  recurring={recurring}
                  key={recurring.$id}
                >
                  <TaskCard
                    /* @ts-ignore */
                    recurring={recurring}
                    index={index}
                    handleRecurringTaskCheck={handleRecurringTaskCheck}
                    handleChecklistItemCheck={handleChecklistItemCheck}
                    handleSkip={handleSkip}
                    completionDate={completionDate}
                  />
                </DragItem>
              ))}
          </AnimatePresence>
        </DropArea>
      ) : (
        <Explainer
          svg={<DroneRaceSvg />}
          text={t("EmptyRecurringsLabel")}
          sx={{
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        />
      )}
    </TabPanel>
  );
};

export default RecurringTaskTab;

const DropArea: (props: {
  isDroppable: boolean;
  filteredRecurrings: RecurringTask[];
  setFilteredRecurrings: (recurrings: RecurringTask[]) => void;
  setRecurrings: (recurrings: RecurringTask[]) => void;
  setRTOrder: (recurringIds: string[]) => void;
  children: any;
}) => JSX.Element = ({
  isDroppable,
  filteredRecurrings,
  setFilteredRecurrings,
  setRecurrings,
  setRTOrder,
  children,
}) => {
  if (isDroppable) {
    return (
      <Reorder.Group
        values={filteredRecurrings}
        onReorder={(reordered) => {
          setFilteredRecurrings(reordered);
          setRecurrings(reordered);
          /* @ts-ignore */
          setRTOrder(reordered.map((recurring) => recurring.$id));
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
  recurring: RecurringTask;
  children: any;
}) => JSX.Element = ({ isDraggable, recurring, children }) => {
  if (isDraggable) {
    return (
      <Reorder.Item value={recurring} as="div">
        {children}
      </Reorder.Item>
    );
  }

  return children;
};

const TaskCard: MemoExoticComponent<
  (props: {
    recurring: RecurringTask;
    index: number;
    handleRecurringTaskCheck: Function;
    handleChecklistItemCheck: Function;
    handleSkip: Function;
    completionDate: number;
  }) => JSX.Element
> = memo(
  ({
    recurring,
    index,
    handleRecurringTaskCheck,
    handleChecklistItemCheck,
    handleSkip,
    completionDate,
  }) => {
    const { t, i18n } = useTranslation();

    const {
      dayOfRecord,

      setDialog,
      setInstance,

      recurringChecklistStatus,
      setRecurringChecklistStatus,
    } = useRecurringStore((state) => state);

    const isDraggable = useUtilsStore((state) => state.isDraggable);

    const iconStyle = {
      // App Language is LTR script
      mr: i18n.dir() === "ltr" ? 1 : 0,
      // App Language is RTL script
      ml: i18n.dir() === "rtl" ? 1 : 0,
    };

    return (
      <motion.div
        exit={{
          opacity: [0.75, 0.5, 0.25, 0],
          y: -50,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Grow in timeout={1000}>
          <Card
            variant="outlined"
            sx={{
              width: "var(--task-card-width)",
              cursor: isDraggable ? "grab" : "default",
              // @ts-ignore
              backgroundColor: recurring.color || "",
              mt: 0.5,
            }}
            onMouseDown={(e) => {
              isDraggable && (e.currentTarget.style.cursor = "grabbing");
            }}
            onMouseUp={(e) => {
              isDraggable && (e.currentTarget.style.cursor = "grab");
            }}
          >
            {/* <Grid container alignItems="stretch"> */}
            {/* <Grid  xs={2} sx={{ borderRight: "1px solid grey" }}> */}
            {/* Checkbox */}
            {/* <Checkbox
                size="large"
                sx={{
                  color: `default`,
                  "&.Mui-checked": {
                    color: `default`,
                  },
                }}
                checked={recurring.completedDates?.includes(
                  moment.utc(dayOfRecord).valueOf()
                )}
              /> */}
            {/* End of Checkbox */}
            {/* </Grid> */}

            {/* <Grid size={10}> */}
            {/* Card Header */}
            <TaskHeader
              task={recurring}
              /* @ts-ignore */
              checkedObserver={
                recurring.skippedDates?.includes(
                  moment.utc(dayOfRecord).valueOf()
                ) ||
                recurring.completedDates?.includes(
                  moment.utc(dayOfRecord).valueOf()
                )
              }
              handleTaskCheck={() => handleRecurringTaskCheck(recurring)}
              setInstance={setInstance}
              setDialog={setDialog}
              optionMenuItems={[
                {
                  category: "recurrings",
                  name: recurring.skippedDates?.includes(completionDate)
                    ? t("Unskip")
                    : t("Skip"),
                  icon: <DoNotDisturb sx={iconStyle} />,
                  textColor: "orange",
                  disabled:
                    recurring.completedDates?.includes(completionDate) ||
                    !getDueDates(recurring, dayOfRecord)?.isDue,
                  onClick: () => handleSkip(recurring),
                },
              ]}
            />
            {/* End of Card Header */}

            {/* Card Info */}
            <TaskInfo task={recurring} />
            {/* End of Card Info */}

            {/* Daily Sub-Tasks */}
            <TaskSubTasks
              task={recurring}
              checklistStatus={recurringChecklistStatus}
              setChecklistStatus={setRecurringChecklistStatus}
              localStorageChecklistStatus="recurringChecklistStatus"
              listFilter={(item) =>
                item?.completedDates?.includes(
                  moment.utc(dayOfRecord).valueOf()
                )
              }
            />
            <TaskSubTasksCollapse
              checklistStatus={recurringChecklistStatus}
              task={recurring}
              parentIndex={index}
              // @ts-ignore
              handleChecklistItemCheck={handleChecklistItemCheck}
              checkedObserver={(childTask) =>
                childTask?.completedDates?.includes(
                  moment.utc(dayOfRecord).valueOf()
                )
              }
            />
            {/* End of Daily Sub-Tasks */}

            {/* Metadata Container */}
            <Grid
              container
              direction="column"
              gap={0.25}
              sx={{
                mt: 0.75,
                mb: 1.5,
                pr: i18n.language === "ar" ? 1.5 : 0,
                pl: i18n.language === "ar" ? 0 : 1.5,
              }}
            >
              {/* Daily Time */}
              <TaskTime task={recurring} />
              {/* End of Daily Time */}

              {/* Recurring Pillar */}
              <ContainerName
                containerCategory="pillar"
                containerIds={recurring.pillars ?? []}
              />
              {/* End of Recurring Pillar */}
            </Grid>
            {/* End of Metadata Container */}

            {/* </Grid> */}
            {/* </Grid> */}
          </Card>
        </Grow>
      </motion.div>
    );
  }
);
