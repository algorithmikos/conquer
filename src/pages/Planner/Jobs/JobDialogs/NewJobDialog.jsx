import React from "react";
import Task from "../../../../forms/Task";
import { Button, Grid2 as Grid } from "@mui/material";
import { useTodoStore } from "../../../../store";
import JobController from "../../../../functions/backend/functions/Job";
import JobFields from "./JobFields";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";
import { useTranslation } from "react-i18next";
import { useMediaQueries } from "../../../../functions/screenSizes";

const NewJobDialog = () => {
  const jobState = useTodoStore((state) => state);
  const {
    instance,
    setInstance,

    dialogs,
    setDialog,
  } = jobState;

  const { xs } = useMediaQueries();
  const { t, i18n } = useTranslation();
  const { createJob } = JobController();

  return (
    <CustomDialog
      state={dialogs.new}
      setState={setDialog}
      dailogType="new"
      fullScreen={xs}
      logic={{
        after: () => {
          setDialog("new", false);
          setInstance("new", {});
        },
      }}
      title={t("Add_New_Job")}
      dialogContentSx={{ p: 0 }}
      dialogProps={{
        dir: i18n.dir(),
      }}
      content={
        <Task
          taskState={instance.new}
          instanceType="new"
          taskType="job"
          setTaskState={setInstance}
          inputFields={<JobFields type="new" />}
        />
      }
      buttons={
        <Grid container justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            color="info"
            className="app-font"
            onClick={() => {
              createJob(instance.new)
                .then(() => {
                  setDialog("new", false);
                  setInstance("new", {});
                })
                .catch((e) => {
                  console.warn(e);
                });
            }}
          >
            {t("Create_Job")}
          </Button>
        </Grid>
      }
    />
  );
};

export default NewJobDialog;
