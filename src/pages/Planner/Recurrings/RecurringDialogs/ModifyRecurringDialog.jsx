import React from "react";
import Task from "../../../../forms/Task";
import { usePillarStore } from "../../../../store";
import { Button, Grid2 as Grid, Tooltip, Zoom } from "@mui/material";
import RecurringFields from "./RecurringFields";
import TagCreator from "../../../../components/TagCreator/TagCreator";
import { useRecurringStore } from "../../../../stores/recurring";
import RecurringTaskController from "../../../../functions/backend/functions/RecurringTask";
import { compare2Objects } from "../../../../utils/compare2Objects";
import { useTranslation } from "react-i18next";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";
import { useMediaQueries } from "../../../../functions/screenSizes";

const ModifyRecurringDialog = () => {
  const recurringState = useRecurringStore((state) => state);
  const {
    instance,
    setInstance,

    dialogs,
    setDialog,
  } = recurringState;

  const pillarState = usePillarStore((state) => state);
  const { pillars } = pillarState;

  const { t, i18n } = useTranslation();
  const { xs } = useMediaQueries();
  const { updateRecurringTask } = RecurringTaskController();

  return (
    <CustomDialog
      state={dialogs.modify}
      setState={setDialog}
      dailogType="new"
      fullScreen={xs}
      logic={{
        after: () => {
          setDialog("modify", false);
          setInstance("modified", {});
          setInstance("old", {});
        },
      }}
      title={t("Edit_Recurring_Task")}
      dialogContentSx={{ p: 0 }}
      dialogProps={{
        dir: i18n.dir(),
      }}
      content={
        <Task
          taskState={instance.modified}
          instanceType="modified"
          taskType="rTask"
          setTaskState={setInstance}
          inputFields={
            <>
              {/* Pillars Field Start */}

              <Tooltip
                title={
                  !pillars.length
                    ? "You've no pillars yet. Start typing a new one title, then click Enter"
                    : ""
                }
                placement="top"
                TransitionComponent={Zoom}
                followCursor
              >
                <Grid>
                  <TagCreator
                    taskState={instance.modified}
                    instanceType="modified"
                    setTaskState={setInstance}
                    field="pillars"
                    label={t("Pillars")}
                    placeholder={t("Erect_a_new_pillar")}
                    collection={pillars}
                    createFunction={() => {}}
                    existingValue={pillars.map((pillar) => pillar.$id)}
                  />
                </Grid>
              </Tooltip>
              {/* Pillars Field End */}

              <RecurringFields type="modified" />
            </>
          }
        />
      }
      buttons={
        <Grid container justifyContent="center" alignItems="center">
          <Button
            disabled={
              !Object.keys(compare2Objects(instance.old, instance.modified))
                .length
            }
            variant="contained"
            color="info"
            className="app-font"
            onClick={() => {
              setDialog("modify", false);
              const updatedData = compare2Objects(
                instance.old,
                instance.modified
              );
              updateRecurringTask(
                updatedData,
                instance.modified.$id ?? instance.modified.$id
              ).then(() => {
                setInstance("modified", {});
                setInstance("old", {});
              });
            }}
          >
            {t("Save_Changes")}
          </Button>
        </Grid>
      }
    />
  );
};

export default ModifyRecurringDialog;
