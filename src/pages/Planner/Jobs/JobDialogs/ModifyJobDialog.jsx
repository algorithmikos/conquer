import React, { useState } from "react";
import Task from "../../../../forms/Task";
import JobController from "../../../../functions/backend/functions/Job";
import { compare2Objects } from "../../../../utils/compare2Objects";
import { useTodoStore } from "../../../../store";
import { Grid2 as Grid } from "@mui/material";
import JobFields from "./JobFields";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";
import { useTranslation } from "react-i18next";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { LoadingButton } from "@mui/lab";

const ModifyJobDialog = () => {
  const { t, i18n } = useTranslation();
  const { xs } = useMediaQueries();
  const { updateJob } = JobController();

  const jobState = useTodoStore((state) => state);
  const {
    instance,
    setInstance,

    dialogs,
    setDialog,
  } = jobState;

  const [isSaving, setIsSaving] = useState(false);

  return (
    <CustomDialog
      state={dialogs.modify}
      setState={setDialog}
      dailogType="modify"
      fullScreen={xs}
      logic={{
        after: () => {
          setDialog("modify", false);
          setInstance("modified", {});
          setInstance("old", {});
        },
      }}
      title={t("Edit_Job")}
      dialogContentSx={{ p: 0 }}
      dialogProps={{
        dir: i18n.dir(),
      }}
      content={
        <Task
          taskState={instance.modified}
          instanceType="modified"
          taskType="job"
          setTaskState={setInstance}
          inputFields={<JobFields type="modified" />}
        />
      }
      buttons={
        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton
            loading={isSaving}
            disabled={
              Object.keys(compare2Objects(instance.old, instance.modified))
                .length === 0
            }
            variant="contained"
            color="info"
            className="app-font"
            onClick={async () => {
              setIsSaving(true);

              const updatedFields = compare2Objects(
                instance.old,
                instance.modified
              );

              updateJob(updatedFields, instance.modified.$id)
                .then(() => {
                  setDialog("modify", false);
                  setInstance("modified", {});
                  setInstance("old", {});
                })
                .catch((e) => {
                  console.warn(e);
                })
                .finally(() => {
                  setIsSaving(false);
                });
            }}
          >
            {t("Save_Changes")}
          </LoadingButton>
        </Grid>
      }
    />
  );
};

export default ModifyJobDialog;
