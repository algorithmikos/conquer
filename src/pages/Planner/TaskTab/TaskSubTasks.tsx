// @ts-nocheck
import { Grid2 as Grid, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { textDirection } from "../../../functions/textDirection";
import { useEffect, useState } from "react";
import { useRecurringStore } from "../../../stores/recurring";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSubRecurringStore } from "../../../stores/subRecurring";

interface TaskSubTasksProps {
  task: { [key: string]: any };
  listFilter: (item) => boolean;
  checklistStatus: { [key: string]: boolean };
  localStorageChecklistStatus: string;
  setChecklistStatus: (newState: { [key: string]: boolean }) => void;
  id?: string | number;
}

const TaskSubTasks: (props: TaskSubTasksProps) => JSX.Element | undefined = ({
  task,
  listFilter,
  checklistStatus,
  localStorageChecklistStatus,
  setChecklistStatus,
  id,
}) => {
  const dailyState = useRecurringStore((state) => state);
  const { dayOfRecord } = dailyState;

  const subRTState = useSubRecurringStore((state) => state);
  const { subRTs } = subRTState;
  const [checklist, setChecklist] = useState(task.checklist);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (Object.keys(checklistStatus).length > 0) {
      localStorage.setItem(
        localStorageChecklistStatus,
        JSON.stringify(checklistStatus)
      );
    }
  }, [checklistStatus]);

  useEffect(() => {
    if (localStorage.getItem(localStorageChecklistStatus)) {
      setChecklistStatus(
        JSON.parse(localStorage.getItem(localStorageChecklistStatus))
      );
    }
  }, []);

  useEffect(() => {
    if (task.checklist && task.checklist.length > 0) {
      if (typeof task.checklist[0] === "string") {
        const mappedChecklist = task.checklist.map((itemId) =>
          subRTs.find((subRT) => subRT.$id === itemId)
        );
        setChecklist(mappedChecklist);
      } else {
        setChecklist(task.checklist);
      }
    }
  }, [task.checklist, subRTs]);

  if (checklist && checklist.length > 0) {
    return (
      <Grid container justifyContent={textDirection(checklist[0]?.item)} px={2}>
        <IconButton
          onClick={() => {
            const newFold = { ...checklistStatus };
            newFold[id || task.$id] = !newFold[id || task.$id];
            setChecklistStatus(newFold);
          }}
          sx={{
            borderRadius: 1,
          }}
          disableRipple
          disableFocusRipple
          disableTouchRipple
        >
          <Typography variant="button" className="app-font">
            {textDirection(checklist[0]?.item) !== "right"
              ? `${t("Checklist", {
                  lng: i18n.language === "ar" ? "en" : i18n.language,
                })} (${checklist?.filter(listFilter).length}/${
                  checklist.length
                })`
              : `${t("Checklist", { lng: "ar" })} (${checklist.length}/${
                  checklist?.filter(listFilter).length || 0
                })`}
          </Typography>

          {id ? (
            <ExpandMoreIcon
              className="collapsed-el"
              sx={{
                transform: !checklistStatus[id]
                  ? "rotate(360deg)"
                  : "rotate(180deg)",
              }}
            />
          ) : (
            <ExpandMoreIcon
              className="collapsed-el"
              sx={{
                transform: checklistStatus[task.$id]
                  ? "rotate(360deg)"
                  : "rotate(180deg)",
              }}
            />
          )}
        </IconButton>
      </Grid>
    );
  }
};

export default TaskSubTasks;
