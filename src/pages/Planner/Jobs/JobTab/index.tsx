import { useEffect, useMemo, useRef, useState } from "react";

import {
  useProjectStore,
  useTodoStore,
  useUtilsStore,
} from "../../../../store";
import { TabPanel } from "@mui/lab";

import TaskHeader from "../../TaskTab/TaskHeader";
import TaskInfo from "../../TaskTab/TaskInfo";
import TaskSubTasks from "../../TaskTab/TaskSubTasks";
import TaskSubTasksCollapse from "../../TaskTab/TaskSubTasksCollapse";
import JobDates from "../../TaskTab/JobDates";
import JobPriority from "../../TaskTab/JobPriority";
import {
  Box,
  Card,
  Chip,
  Collapse,
  Grid2 as Grid,
  Grow,
  SxProps,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CollectionOptions, dbm } from "../../../../backend/database/dbm";
import JobController from "../../../../functions/backend/functions/Job";
import { Job } from "../../../../backend/database/schemas/Job.model";
import { Reorder } from "framer-motion";
import { recordFilter } from "../../../../functions/recordFilter";
import { useRecurringStore } from "../../../../stores/recurring";
import useDebounce from "../../../../hooks/useDebounce";
import { Archive, KeyboardArrowUp } from "@mui/icons-material";
import { Permission, Role } from "appwrite";
import Explainer from "../../../../components/Explainer/Explainer";
// @ts-ignore
import DreamerSvg from "../../../../assets/svgs/DreamerSvg";
import { textDirection } from "../../../../functions/textDirection";
import QuestController from "../../../../backend/functions/Quest";

const JobTab: React.FC<{
  tab: string;
  isDroppable: boolean;
  condition: string;
}> = ({ tab, condition }) => {
  const { t, i18n } = useTranslation();

  const dayOfRecord = useRecurringStore((state) => state.dayOfRecord);
  const { isDraggable } = useUtilsStore((state) => state);

  const { getProjectById, projects } = useProjectStore((state) => state);
  const {
    todos,
    setTodos,

    removeJob,

    filteredJobs,
    setFilteredJobs,

    jobChecklistStatus,
    setJobChecklistStatus,
  } = useTodoStore((state) => state);

  const [jobOrder, setJobOrder] = useState<string[]>([]);
  const [uncategorisedExpanded, setUncategorisedExpanded] = useState(false);

  const [questGroups, setQuestGroups] = useState<{ [key: string]: Job[] }>(
    filteredJobs?.reduce((groups: { [key: string]: Job[] }, job: Job) => {
      // Check if the projects array is empty
      if (job.projects?.length === 0) {
        // If projects is empty, assign it to the "uncategorised" group
        if (!groups["Uncategorised"]) {
          groups["Uncategorised"] = [];
        }
        groups["Uncategorised"].push(job);
      } else {
        // Otherwise, group by each project UUID
        job.projects?.forEach((projectId) => {
          if (!groups[projectId]) {
            groups[projectId] = [];
          }
          groups[projectId].push(job);
        });
      }

      return groups;
    }, {})
  );

  /* @ts-ignore */
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.$id;

  useEffect(() => {
    if (Object.keys(jobChecklistStatus).length > 0) {
      localStorage.setItem(
        "jobChecklistStatus",
        JSON.stringify(jobChecklistStatus)
      );
    }
  }, [jobChecklistStatus]);

  useEffect(() => {
    if (localStorage.getItem("jobChecklistStatus")) {
      setJobChecklistStatus(
        /* @ts-ignore */
        JSON.parse(localStorage.getItem("jobChecklistStatus"))
      );
    }
  }, []);

  useEffect(() => {
    setQuestGroups(
      (filteredJobs || []).reduce(
        (groups: { [key: string]: Job[] }, job: Job) => {
          // Check if the projects array is empty
          if (job.projects?.length === 0) {
            // If projects is empty, assign it to the "uncategorised" group
            if (!groups["Uncategorised"]) {
              groups["Uncategorised"] = [];
            }
            groups["Uncategorised"].push(job);
          } else {
            // Otherwise, group by each project UUID
            job.projects?.forEach((projectId) => {
              if (!groups[projectId]) {
                groups[projectId] = [];
              }
              groups[projectId].push(job);
            });
          }

          return groups;
        },
        {}
      )
    );
  }, [todos, filteredJobs, projects]);

  useDebounce({
    callback: () => {
      isDraggable &&
        jobOrder.length > 0 &&
        dbm.updateServerDoc(CollectionOptions.users, userId, {
          jobOrder: jobOrder,
        });
    },
    value: jobOrder,
    delay: 1000,
  });

  const handleArchive = async (job: Record<string, any>) => {
    const doc = { ...job };
    delete doc.user;
    delete doc.$id;
    delete doc.$databaseId;
    delete doc.$permissions;
    doc.id && delete doc.id;

    for (let key of Object.keys(doc)) {
      if (Array.isArray(doc[key])) {
        if (!doc[key].length) {
          delete doc[key];
        }
      } else if (!doc[key]) {
        delete doc[key];
      } else if (typeof doc[key] === "object") {
        if (!Object.keys(doc[key]).length) {
          delete doc[key];
        }
      }
    }

    await dbm.createServerDoc(
      CollectionOptions.archive,
      {
        $id: job.$id,
        user: userId,
        collectionName: "jobs",
        document: JSON.stringify(doc),
      },
      {
        document: "",
        user: "",
        collectionName: "",
      },
      "",
      [Permission.read(Role.user(userId)), Permission.delete(Role.user(userId))]
    );

    await dbm.deleteServerDoc(CollectionOptions.jobs, job.$id);

    removeJob(job);
  };

  const iconStyle = {
    // App Language is LTR script
    mr: i18n.dir() === "ltr" ? 1 : 0,
    // App Language is RTL script
    ml: i18n.dir() === "rtl" ? 1 : 0,
  };

  return (
    <TabPanel
      value={tab}
      sx={{
        p: 0,
        width: "var(--task-column-width)",
      }}
    >
      {filteredJobs.filter((job) => recordFilter(job, condition, dayOfRecord))
        .length ? (
        <DropArea
          isDroppable={isDraggable}
          filteredJobs={filteredJobs}
          setFilteredJobs={setFilteredJobs}
          setJobs={setTodos}
          setJobOrder={setJobOrder}
        >
          <Grid container direction="column" alignItems="center">
            {Object.keys(questGroups).map((questId, questIndex) => (
              <GroupOfJobs
                key={questIndex}
                questId={questId}
                title={
                  questId === "Uncategorised"
                    ? t("Uncategorised")
                    : t(getProjectById(questId)?.title ?? "Loading...")
                }
                groupItems={questGroups?.[questId]?.filter((job: any) =>
                  recordFilter(job, condition, dayOfRecord)
                )}
                handleArchive={handleArchive}
                utils={{
                  iconStyle,
                  isExpanded:
                    getProjectById(questId)?.groupExpanded ??
                    uncategorisedExpanded,
                  uncategorisedExpandSetter: setUncategorisedExpanded,
                }}
              />
            ))}
          </Grid>
        </DropArea>
      ) : (
        <Explainer
          svg={<DreamerSvg />}
          text={t("EmptyJobsLabel")}
          sx={{
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        />
      )}
    </TabPanel>
  );
};

export default JobTab;

const DropArea: (props: {
  isDroppable: boolean;
  filteredJobs: Job[];
  setFilteredJobs: (jobs: Job[]) => void;
  setJobs: (jobs: Job[]) => void;
  setJobOrder: (jobOrder: string[]) => void;
  children: any;
}) => JSX.Element = ({
  isDroppable,
  filteredJobs,
  setFilteredJobs,
  setJobs,
  setJobOrder,
  children,
}) => {
  if (isDroppable) {
    return (
      <Reorder.Group
        values={filteredJobs}
        onReorder={(reordered) => {
          setFilteredJobs(reordered);
          setJobs(reordered);
          /* @ts-ignore */
          setJobOrder(reordered.map((job) => job.$id));
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

  return <Box>{children}</Box>;
};

const DragItem: (props: {
  isDraggable: boolean;
  job: Job;
  children: any;
}) => JSX.Element = ({ isDraggable, job, children }) => {
  if (isDraggable) {
    return (
      <Reorder.Item value={job} as="div">
        {children}
      </Reorder.Item>
    );
  }

  return children;
};

const GroupOfJobs: React.FC<{
  title: string;
  questId: string;
  groupItems: Job[];
  handleArchive: (job: Job) => void;
  utils: {
    iconStyle: SxProps;
    isExpanded: boolean;
    uncategorisedExpandSetter: React.Dispatch<React.SetStateAction<boolean>>;
  };
}> = ({ title, questId, groupItems, handleArchive, utils }) => {
  const { t, i18n } = useTranslation();
  const { handleJobCheck, handleChecklistItemCheck } = JobController();
  const { isDraggable, hideContent } = useUtilsStore((state) => state);
  const {
    setDialog,
    setInstance,

    jobChecklistStatus,
    setJobChecklistStatus,
  } = useTodoStore((state) => state);
  const { iconStyle, isExpanded, uncategorisedExpandSetter } = utils;

  const { updateQuest } = QuestController();

  if (!groupItems.length) return null;

  const handleUpdateQuestExpanded = async () => {
    if (questId !== "Uncategorised")
      /* @ts-ignore */
      await updateQuest({ groupExpanded: !isExpanded }, questId);
    else uncategorisedExpandSetter(!isExpanded);
  };

  return (
    <Box sx={{ minWidth: "var(--task-column-width)" }}>
      <Chip
        clickable
        variant="outlined"
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexDirection:
                textDirection(title) === "right" ? "row-reverse" : "row",
            }}
          >
            <Typography
              variant="body2"
              sx={{ filter: hideContent ? "blur(2px)" : "none" }}
            >
              {title}
            </Typography>

            <Chip
              size="small"
              color="primary"
              sx={{ scale: 0.9 }}
              label={groupItems.length}
            />

            <KeyboardArrowUp
              sx={{
                transform: isExpanded ? "rotate(0deg)" : "rotate(-180deg)",
                transition: "transform 0.2s ease-in-out",
                mx: -0.5,
              }}
            />
          </Box>
        }
        sx={{
          width: "90%",
          mt: 1,
          mb: 1,
          border: "1px solid white",
          // color: "black",
        }}
        onClick={handleUpdateQuestExpanded}
      />

      <Collapse in={isExpanded}>
        {groupItems.map((job: Job, index: number) => (
          /* @ts-ignore */
          <DragItem isDraggable={isDraggable} job={job} key={job.$id}>
            <Grow in timeout={1000}>
              <Card
                variant="outlined"
                sx={{
                  width: "var(--task-card-width)",
                  cursor: isDraggable ? "grab" : "default",
                  // @ts-ignore
                  backgroundColor: job.color || "",
                  mt: 0.5,
                }}
                onMouseDown={(e) => {
                  isDraggable && (e.currentTarget.style.cursor = "grabbing");
                }}
                onMouseUp={(e) => {
                  isDraggable && (e.currentTarget.style.cursor = "grab");
                }}
              >
                {/* Card Header */}
                <TaskHeader
                  /* @ts-ignore */
                  task={job}
                  /* @ts-ignore */
                  checkedObserver={job.done}
                  /* @ts-ignore */
                  handleTaskCheck={handleJobCheck}
                  setInstance={setInstance}
                  setDialog={setDialog}
                  optionMenuItems={[
                    {
                      category: "jobs",
                      name: t("Archive"),
                      icon: <Archive sx={iconStyle} />,
                      textColor: "Grey",
                      onClick: () => handleArchive(job),
                    },
                  ]}
                />
                {/* End of Card Header */}

                {/* Card Info */}
                <TaskInfo task={job} />
                {/* End of Card Info */}

                {/* Todo Sub-Tasks */}
                <TaskSubTasks
                  task={job}
                  checklistStatus={jobChecklistStatus}
                  localStorageChecklistStatus="jobChecklistStatus"
                  setChecklistStatus={setJobChecklistStatus}
                  listFilter={(item) => item?.done}
                />
                <TaskSubTasksCollapse
                  checklistStatus={jobChecklistStatus}
                  task={job}
                  parentIndex={index}
                  // @ts-ignore
                  handleChecklistItemCheck={handleChecklistItemCheck}
                  checkedObserver={(childTask) => childTask?.done}
                />
                {/* End of Todo Sub-Tasks */}

                {/* Metadata Container */}
                <Grid
                  container
                  direction="column"
                  gap={0.5}
                  sx={{
                    mt: 0.75,
                    mb: 1.5,
                    pr: i18n.language === "ar" ? 1.5 : 0,
                    pl: i18n.language === "ar" ? 0 : 1.5,
                  }}
                >
                  {/* ToDo Do & Due Date */}
                  <JobDates job={job} />
                  {/* End of ToDo Do & Due Date */}

                  {/* ToDo Priority */}
                  {/* @ts-ignore */}
                  <JobPriority priority={job.priority} />
                  {/* End of ToDo Priority */}
                </Grid>
                {/* End of Metadata Container */}
              </Card>
            </Grow>
          </DragItem>
        ))}
      </Collapse>
    </Box>
  );
};
