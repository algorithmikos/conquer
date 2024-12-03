import React, { useEffect } from "react";
import {
  Grid2 as Grid,
  TextField,
  Tooltip,
  Zoom,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useProjectStore, useTodoStore } from "../../../../store";

import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import BoltIcon from "@mui/icons-material/Bolt";
import TagCreator from "../../../../components/TagCreator/TagCreator";
import moment from "moment";

import { compare2Objects } from "../../../../utils/compare2Objects";
import { useTranslation } from "react-i18next";

const JobFields = ({ type }) => {
  const todoState = useTodoStore((state) => state);
  const { instance, setInstance } = todoState;

  const projectState = useProjectStore((state) => state);
  const { projects } = projectState;

  const { t } = useTranslation();

  const priorityRate = () => {
    let priority = t("Low");
    if (
      instance[type]?.priority?.importance &&
      instance[type]?.priority?.urgency
    ) {
      priority = t("High");
    }

    if (
      instance[type]?.priority?.importance &&
      !instance[type]?.priority?.urgency
    ) {
      priority = t("Medium");
    }

    if (
      !instance[type]?.priority?.importance &&
      instance[type]?.priority?.urgency
    ) {
      priority = t("Low");
    }

    return priority;
  };

  useEffect(() => {
    console.log(compare2Objects(instance.old, instance.modified));
  }, [instance]);

  return (
    <>
      {/* Priority Field Start */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className="field-border"
      >
        <FormControlLabel
          componentsProps={{ typography: { className: "app-font" } }}
          control={<Checkbox color="error" checkedIcon={<BoltIcon />} />}
          label={t("Urgent")}
          value={instance[type]?.priority?.urgency || false}
          checked={instance[type]?.priority?.urgency || false}
          onChange={(e) => {
            const priority = instance[type].priority || {};
            setInstance(type, {
              ...instance[type],
              priority: {
                ...priority,
                urgency: e.target.checked,
              },
            });
          }}
        />

        <Typography
          variant="body1"
          className="app-font"
          sx={{
            // Urgent Style
            textTransform:
              instance[type]?.priority?.urgency === true ? "uppercase" : "none",
            letterSpacing:
              instance[type]?.priority?.urgency === true ? 1.5 : "normal",

            // Important Style
            fontStyle:
              instance[type]?.priority?.importance === true
                ? "normal"
                : "italic",
            textDecoration:
              instance[type]?.priority?.importance === true
                ? "underline"
                : "none",
          }}
        >
          {priorityRate()}
        </Typography>

        <FormControlLabel
          componentsProps={{ typography: { className: "app-font" } }}
          control={
            <Checkbox color="warning" checkedIcon={<LabelImportantIcon />} />
          }
          label={t("Important")}
          value={instance[type]?.priority?.importance || false}
          checked={instance[type]?.priority?.importance || false}
          onChange={(e) => {
            const priority = instance[type].priority || {};
            setInstance(type, {
              ...instance[type],
              priority: {
                ...priority,
                importance: e.target.checked,
              },
            });
          }}
        />
      </Grid>
      {/* Priority Field End */}

      {/* Projects Field Start */}
      <Tooltip
        title={
          !projects?.length
            ? "You've no projects yet. Start typing a new one title, then click Enter"
            : ""
        }
        placement="top"
        TransitionComponent={Zoom}
        followCursor
      >
        <Grid>
          <TagCreator
            taskState={instance[type]}
            setTaskState={setInstance}
            instanceType={type}
            field="projects"
            label={t("Projects")}
            placeholder={t("Create_a_new_project")}
            collection={projects}
            createFunction={() => {}}
            existingValue={projects?.map((project) => project.$id)}
          />
        </Grid>
      </Tooltip>
      {/* Projects Field End */}

      {/* DueDate Field Start */}
      <Grid>
        <TextField
          fullWidth
          label={t("Due_Date")}
          color="warning"
          type="date"
          value={
            instance[type].dueAt
              ? moment
                  .unix(instance[type].dueAt / 1000)
                  .utc()
                  .format("YYYY-MM-DD")
              : null
          }
          onChange={(e) => {
            if (e.target.value) {
              setInstance(type, {
                ...instance[type],
                dueAt: moment.utc(e.target.value).startOf("day").valueOf(),
              });
            } else {
              setInstance(type, {
                ...instance[type],
                dueAt: null,
              });
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ min: moment().format("YYYY-MM-DD") }}
        />
      </Grid>
      {/* DueDate Field End */}

      {/* DoDate Field Start */}
      <Grid>
        <TextField
          fullWidth
          label={t("Do_Date")}
          color="info"
          type="date"
          value={
            instance[type].doAt
              ? moment
                  .unix(instance[type].doAt / 1000)
                  .utc()
                  .format("YYYY-MM-DD")
              : null
          }
          onChange={(e) => {
            if (e.target.value) {
              setInstance(type, {
                ...instance[type],
                doAt: moment.utc(e.target.value).startOf("day").valueOf(),
              });
            } else {
              setInstance(type, {
                ...instance[type],
                doAt: null,
              });
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ min: moment().format("YYYY-MM-DD") }}
        />
      </Grid>
      {/* DoDate Field End */}

      <Grid>
        <TextField
          type="time"
          label={t("Time")}
          value={instance[type].time}
          onChange={(e) =>
            setInstance(type, { ...instance[type], time: e.target.value })
          }
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </>
  );
};

export default JobFields;
