import { useNavigate, useParams } from "react-router-dom";
import { useProjectStore, useTodoStore, useUtilsStore } from "../../../store";
import {
  Box,
  Card,
  Chip,
  Grid2 as Grid,
  Grow,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  CalendarToday,
  CircleTwoTone,
  Edit,
  Notes,
} from "@mui/icons-material";
import { useRecurringStore } from "../../../stores/recurring";
import { recordFilter } from "../../../functions/recordFilter";

import TaskHeader from "../../Planner/TaskTab/TaskHeader";
import TaskInfo from "../../Planner/TaskTab/TaskInfo";
import TaskSubTasks from "../../Planner/TaskTab/TaskSubTasks";
import TaskSubTasksCollapse from "../../Planner/TaskTab/TaskSubTasksCollapse";
import { useMediaQueries } from "../../../functions/screenSizes";
import { useTranslation } from "react-i18next";
import {
  hijriRomanMixedFullDate,
  shortHijriDate,
  shortRomanDate,
} from "../../../functions/utils";
import "../Planner.css";
import { useEffect } from "react";
import JobController from "../../../functions/backend/functions/Job";

const QuestTasks = () => {
  const navigate = useNavigate();
  const { xs } = useMediaQueries();
  const { t, i18n } = useTranslation();
  let { questId } = useParams();

  const {
    getProjectById,
    setInstance: setQuestInstance,
    setDialog: setQuestDialog,
  } = useProjectStore((state) => state);

  const {
    todos,
    filteredJobs,
    setInstance,
    setDialog,
    jobChecklistStatus,
    setJobChecklistStatus,
  } = useTodoStore((state) => state);

  const dayOfRecord = useRecurringStore((state) => state.dayOfRecord);
  const colors = useUtilsStore((state) => state.colors);

  const quest = getProjectById(questId);

  const { handleJobCheck, handleChecklistItemCheck } = JobController();

  useEffect(() => {
    const resizableDiv: any = document.querySelector(".resizable-div");
    const resizers = document.querySelectorAll(".resizer");
    let originalWidth: any,
      originalHeight: any,
      originalX: any,
      originalY: any,
      originalMouseX: any,
      originalMouseY: any;

    resizers.forEach((resizer) => {
      resizer.addEventListener("mousedown", (e: any) => {
        e.preventDefault();

        originalWidth = parseFloat(
          getComputedStyle(resizableDiv, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        originalHeight = parseFloat(
          getComputedStyle(resizableDiv, null)
            .getPropertyValue("height")
            .replace("px", "")
        );
        originalX = resizableDiv.getBoundingClientRect().left;
        originalY = resizableDiv.getBoundingClientRect().top;
        originalMouseX = e.pageX;
        originalMouseY = e.pageY;

        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
      });

      function resize(e: any) {
        if (resizer.classList.contains("bottom-right")) {
          resizableDiv.style.width =
            originalWidth + (e.pageX - originalMouseX) + "px";
          resizableDiv.style.height =
            originalHeight + (e.pageY - originalMouseY) + "px";
        } else if (resizer.classList.contains("bottom")) {
          resizableDiv.style.height =
            originalHeight + (e.pageY - originalMouseY) + "px";
        } else if (resizer.classList.contains("right")) {
          resizableDiv.style.width =
            originalWidth + (e.pageX - originalMouseX) + "px";
        } else if (resizer.classList.contains("top-right")) {
          resizableDiv.style.width =
            originalWidth + (e.pageX - originalMouseX) + "px";
          resizableDiv.style.height =
            originalHeight - (e.pageY - originalMouseY) + "px";
          resizableDiv.style.top =
            originalY + (e.pageY - originalMouseY) + "px";
        } else if (resizer.classList.contains("top")) {
          resizableDiv.style.height =
            originalHeight - (e.pageY - originalMouseY) + "px";
          resizableDiv.style.top =
            originalY + (e.pageY - originalMouseY) + "px";
        } else if (resizer.classList.contains("top-left")) {
          resizableDiv.style.width =
            originalWidth - (e.pageX - originalMouseX) + "px";
          resizableDiv.style.height =
            originalHeight - (e.pageY - originalMouseY) + "px";
          resizableDiv.style.top =
            originalY + (e.pageY - originalMouseY) + "px";
          resizableDiv.style.left =
            originalX + (e.pageX - originalMouseX) + "px";
        } else if (resizer.classList.contains("left")) {
          resizableDiv.style.width =
            originalWidth - (e.pageX - originalMouseX) + "px";
          resizableDiv.style.left =
            originalX + (e.pageX - originalMouseX) + "px";
        } else if (resizer.classList.contains("bottom-left")) {
          resizableDiv.style.width =
            originalWidth - (e.pageX - originalMouseX) + "px";
          resizableDiv.style.height =
            originalHeight + (e.pageY - originalMouseY) + "px";
          resizableDiv.style.left =
            originalX + (e.pageX - originalMouseX) + "px";
        }
      }

      function stopResize() {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResize);
      }
    });
  }, []);

  if (!quest) {
    return <Typography>{t("Project not found")}</Typography>;
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems={"center"}
      gap={1}
      sx={{ position: "relative" }}
    >
      <Grid>
        <Grid container alignItems="center" gap={1}>
          <IconButton
            onClick={() => {
              navigate(`/planner/projects`);
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>

          <h2 style={{ textAlign: "left" }}>
            {quest?.title} {t("Tasks")}
          </h2>

          <Chip
            label={
              /* @ts-ignore */
              todos?.filter((job) => job.projects?.includes(questId))?.length
            }
            color="primary"
            size="small"
          />
        </Grid>
      </Grid>

      <Grid sx={{ mt: -2, mb: 2 }}>
        <Grid
          container
          sx={{
            position: "relative",
            p: 2,
            minHeight: 120,

            borderRadius: "5px",
            background:
              "linear-gradient(135deg, #071d31, #0f2b46, #1a3a5e, #234975, #2e5891)",
          }}
          className="svg-bg-container"
        >
          <Table
            sx={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              zIndex: 1,
            }}
            size="small"
          >
            <TableBody>
              <PropertyLine
                label={t("Beginning_Date")}
                value={quest?.beginning}
                renderedValue={
                  xs
                    ? `${shortHijriDate(quest?.beginning)} — ${shortRomanDate(
                        quest?.beginning
                      )}`
                    : hijriRomanMixedFullDate(quest?.beginning)
                }
                icon={<CalendarToday fontSize="small" />}
              />
              <PropertyLine
                label={t("End_Date")}
                value={quest?.end}
                renderedValue={
                  xs
                    ? `${shortHijriDate(quest?.end)} — ${shortRomanDate(
                        quest?.end
                      )}`
                    : hijriRomanMixedFullDate(quest?.end)
                }
                icon={<CalendarToday fontSize="small" />}
              />
              <PropertyLine
                label={t("Status")}
                value={quest?.status}
                renderedValue={t(quest?.status ?? "")}
                icon={<CircleTwoTone fontSize="small" />}
              />
              <PropertyLine
                label={t("Details")}
                value={quest?.details}
                renderedValue={<TaskInfo directInfo={quest?.details} />}
                icon={<Notes fontSize="small" />}
              />
            </TableBody>
          </Table>

          <IconButton
            size="small"
            sx={{
              position: "absolute",
              zIndex: 1,
              top: i18n.language === "ar" ? 5 : 5,
              right: i18n.language === "ar" ? "unset" : 5,
              left: i18n.language === "ar" ? 10 : "unset",
            }}
            color="info"
            onClick={() => {
              /* @ts-ignore */
              setQuestInstance("modified", quest);
              /* @ts-ignore */
              setQuestDialog("modify", true);
            }}
          >
            <Edit fontSize="inherit" />
          </IconButton>

          <svg
            fill="white"
            height="80"
            width="80"
            style={{
              position: "absolute",
              bottom: 25,
              right: i18n.language === "ar" ? "unset" : 20,
              left: i18n.language === "ar" ? 20 : "unset",
              zIndex: 0,
              opacity: 0.1,
            }}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            transform="rotate(-15)"
            className="svg-bg"
          >
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <g>
                <g>
                  <g>
                    <path d="M179.184,170.667h170.667c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533H179.184 c-4.71,0-8.533,3.823-8.533,8.533C170.651,166.844,174.474,170.667,179.184,170.667z"></path>
                    <path d="M484.754,351.497l-17.067-17.067c-13.124-13.116-33.092-13.09-46.199,0L309.684,446.234 c-1.604,1.596-2.5,3.772-2.5,6.033v51.2c0,4.71,3.814,8.533,8.533,8.533h51.2c2.27,0,4.437-0.896,6.033-2.5l111.804-111.804 C498.348,384.102,498.348,365.099,484.754,351.497z M410.454,369.596l13.534,13.534l-74.138,74.138l-13.534-13.534 L410.454,369.596z M324.251,494.933v-39.134l39.134,39.134H324.251z M375.451,482.867l-13.534-13.534l74.138-74.138 l13.525,13.534L375.451,482.867z M472.688,385.63l-11.034,11.034l-39.134-39.134l11.034-11.034c6.758-6.75,15.292-6.767,22.067,0 l17.067,17.067C479.591,370.475,479.591,378.726,472.688,385.63z"></path>
                    <path d="M315.717,51.2h17.067c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533h-17.067 c-4.719,0-8.533,3.823-8.533,8.533C307.184,47.377,310.998,51.2,315.717,51.2z"></path>
                    <path d="M366.917,102.4c14.114,0,25.6-11.486,25.6-25.6c0-11.11-7.159-20.489-17.067-24.03V8.533c0-4.71-3.814-8.533-8.533-8.533 s-8.533,3.823-8.533,8.533V52.77c-9.907,3.541-17.067,12.919-17.067,24.03C341.317,90.914,352.803,102.4,366.917,102.4z M366.917,68.267c4.71,0,8.533,3.831,8.533,8.533c0,4.702-3.823,8.533-8.533,8.533s-8.533-3.831-8.533-8.533 C358.384,72.098,362.207,68.267,366.917,68.267z"></path>
                    <path d="M179.184,221.867h153.6c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533h-153.6 c-4.71,0-8.533,3.823-8.533,8.533C170.651,218.044,174.474,221.867,179.184,221.867z"></path>
                    <path d="M401.051,51.2h17.067c12.442,0,25.6,13.158,25.6,25.6v221.158c0,4.71,3.814,8.533,8.533,8.533s8.533-3.823,8.533-8.533 V76.8c0-21.931-20.736-42.667-42.667-42.667h-17.067c-4.719,0-8.533,3.823-8.533,8.533C392.517,47.377,396.332,51.2,401.051,51.2 z"></path>
                    <path d="M281.584,102.4c14.114,0,25.6-11.486,25.6-25.6c0-11.11-7.159-20.489-17.067-24.03V8.533c0-4.71-3.814-8.533-8.533-8.533 c-4.719,0-8.533,3.823-8.533,8.533V52.77c-9.907,3.541-17.067,12.919-17.067,24.03C255.984,90.914,267.47,102.4,281.584,102.4z M281.584,68.267c4.71,0,8.533,3.831,8.533,8.533c0,4.702-3.823,8.533-8.533,8.533s-8.533-3.831-8.533-8.533 C273.051,72.098,276.874,68.267,281.584,68.267z"></path>
                    <path d="M375.451,264.533c0-4.71-3.814-8.533-8.533-8.533H179.184c-4.71,0-8.533,3.823-8.533,8.533 c0,4.71,3.823,8.533,8.533,8.533h187.733C371.636,273.067,375.451,269.244,375.451,264.533z"></path>
                    <path d="M179.184,307.2c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h170.667c4.719,0,8.533-3.823,8.533-8.533 s-3.814-8.533-8.533-8.533H179.184z"></path>
                    <path d="M281.584,443.733c4.719,0,8.533-3.823,8.533-8.533s-3.814-8.533-8.533-8.533H34.117V76.8c0-12.442,13.158-25.6,25.6-25.6 h17.067c4.71,0,8.533-3.823,8.533-8.533c0-4.71-3.823-8.533-8.533-8.533H59.717c-21.931,0-42.667,20.736-42.667,42.667v392.533 c0,21.931,20.736,42.667,42.667,42.667h221.867c4.719,0,8.533-3.823,8.533-8.533s-3.814-8.533-8.533-8.533H59.717 c-9.574,0-19.507-7.808-23.612-17.067h245.478c4.719,0,8.533-3.823,8.533-8.533s-3.814-8.533-8.533-8.533H34.117v-17.067H281.584 z"></path>
                    <path d="M127.984,204.8h-17.067c-4.71,0-8.533,3.823-8.533,8.533c0,4.71,3.823,8.533,8.533,8.533h17.067 c4.71,0,8.533-3.823,8.533-8.533C136.517,208.623,132.694,204.8,127.984,204.8z"></path>
                    <path d="M127.984,358.4h-17.067c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h17.067c4.71,0,8.533-3.823,8.533-8.533 S132.694,358.4,127.984,358.4z"></path>
                    <path d="M230.384,51.2h17.067c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533h-17.067 c-4.71,0-8.533,3.823-8.533,8.533C221.851,47.377,225.674,51.2,230.384,51.2z"></path>
                    <path d="M298.651,358.4H179.184c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h119.467 c4.719,0,8.533-3.823,8.533-8.533S303.37,358.4,298.651,358.4z"></path>
                    <path d="M127.984,153.6h-17.067c-4.71,0-8.533,3.823-8.533,8.533c0,4.71,3.823,8.533,8.533,8.533h17.067 c4.71,0,8.533-3.823,8.533-8.533C136.517,157.423,132.694,153.6,127.984,153.6z"></path>
                    <path d="M127.984,256h-17.067c-4.71,0-8.533,3.823-8.533,8.533c0,4.71,3.823,8.533,8.533,8.533h17.067 c4.71,0,8.533-3.823,8.533-8.533C136.517,259.823,132.694,256,127.984,256z"></path>
                    <path d="M145.051,51.2h17.067c4.71,0,8.533-3.823,8.533-8.533c0-4.71-3.823-8.533-8.533-8.533h-17.067 c-4.71,0-8.533,3.823-8.533,8.533C136.517,47.377,140.34,51.2,145.051,51.2z"></path>
                    <path d="M127.984,307.2h-17.067c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h17.067c4.71,0,8.533-3.823,8.533-8.533 S132.694,307.2,127.984,307.2z"></path>
                    <path d="M196.251,102.4c14.114,0,25.6-11.486,25.6-25.6c0-11.11-7.151-20.489-17.067-24.03V8.533c0-4.71-3.823-8.533-8.533-8.533 s-8.533,3.823-8.533,8.533V52.77c-9.916,3.541-17.067,12.919-17.067,24.03C170.651,90.914,182.137,102.4,196.251,102.4z M196.251,68.267c4.702,0,8.533,3.831,8.533,8.533c0,4.702-3.831,8.533-8.533,8.533c-4.702,0-8.533-3.831-8.533-8.533 C187.717,72.098,191.549,68.267,196.251,68.267z"></path>
                    <path d="M110.917,102.4c14.114,0,25.6-11.486,25.6-25.6c0-11.11-7.151-20.489-17.067-24.03V8.533c0-4.71-3.823-8.533-8.533-8.533 c-4.71,0-8.533,3.823-8.533,8.533V52.77C92.468,56.311,85.317,65.69,85.317,76.8C85.317,90.914,96.803,102.4,110.917,102.4z M110.917,68.267c4.702,0,8.533,3.831,8.533,8.533c0,4.702-3.831,8.533-8.533,8.533c-4.702,0-8.533-3.831-8.533-8.533 C102.384,72.098,106.215,68.267,110.917,68.267z"></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </Grid>
      </Grid>

      <Box>
        <Grid
          container
          className="task-column resizable-div"
          sx={{
            width: xs
              ? "var(--task-column-width)"
              : "calc(var(--task-card-width) * 2.08)",
            overflowY: xs ? "hidden" : "scroll",
          }}
          bgcolor={colors?.column_bg_color}
          pt={1}
          px={1}
          gap={0.5}
          mt={-2}
        >
          {/* <div className="resizer top-left"></div> */}
          {/* <div className="resizer top"></div> */}
          {/* <div className="resizer top-right"></div> */}
          <div className="resizer right"></div>
          {/* <div className="resizer bottom-right"></div> */}
          <div className="resizer bottom"></div>
          {/* <div className="resizer bottom-left"></div> */}
          {/* <div className="resizer left"></div> */}
          {filteredJobs
            .filter(
              (job) =>
                /* @ts-ignore */
                job.projects?.includes(questId) &&
                recordFilter(job, "full", dayOfRecord)
            )
            .map((job, index) => (
              /* @ts-ignore */
              <Grow in timeout={1000} key={`${job.$id}-${index}`}>
                <Card
                  variant="outlined"
                  sx={{
                    width: "var(--task-card-width)",
                    cursor: "pointer",
                    /* @ts-ignore */
                    backgroundColor: job.color || "",
                  }}
                >
                  {/* Card Header */}
                  <TaskHeader
                    task={job}
                    /* @ts-ignore */
                    checkedObserver={job.done ? true : false}
                    handleTaskCheck={() => handleJobCheck(job)}
                    setInstance={setInstance}
                    setDialog={setDialog}
                  />
                  {/* End of Card Header */}

                  {/* Card Info */}
                  <TaskInfo task={job} />
                  {/* End of Card Info */}

                  {/* Daily Sub-Tasks */}
                  <TaskSubTasks
                    task={job}
                    listFilter={(item) => item.done}
                    checklistStatus={jobChecklistStatus}
                    localStorageChecklistStatus={"jobChecklistStatus"}
                    setChecklistStatus={setJobChecklistStatus}
                  />
                  <TaskSubTasksCollapse
                    checklistStatus={jobChecklistStatus}
                    task={job}
                    parentIndex={index}
                    /* @ts-ignore */
                    handleChecklistItemCheck={handleChecklistItemCheck}
                    checkedObserver={(item) => (item.done ? true : false)}
                  />
                  {/* End of Daily Sub-Tasks */}
                </Card>
              </Grow>
            ))}
        </Grid>
      </Box>
    </Grid>
  );
};

export default QuestTasks;

const PropertyLine: React.FC<{
  label: string;
  icon: any;
  value: any;
  renderedValue: any;
}> = ({ label, icon, value, renderedValue }) => {
  const { xs } = useMediaQueries();

  if (value)
    return (
      <TableRow>
        <TableCell
          sx={{ border: "none", outline: "none", width: xs ? "39%" : "auto" }}
        >
          <Grid container alignItems="center" justifyContent="start" gap={0.5}>
            {icon}
            {label}
          </Grid>
        </TableCell>
        <TableCell sx={{ textAlign: "start", border: "none", outline: "none" }}>
          {renderedValue}
        </TableCell>
      </TableRow>
    );
};
