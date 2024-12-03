import React, { useState } from "react";
import Task from "../../../../forms/Task";
import { Button, Grid2 as Grid, Tooltip, Zoom } from "@mui/material";
import { usePillarStore } from "../../../../store";
import RecurringFields from "./RecurringFields";
import TagCreator from "../../../../components/TagCreator/TagCreator";
import { useRecurringStore } from "../../../../stores/recurring";

import RecurringTaskController from "../../../../functions/backend/functions/RecurringTask";
import { useTranslation } from "react-i18next";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { LoadingButton } from "@mui/lab";

const NewRecurringDialog = () => {
  const { t, i18n } = useTranslation();
  const { xs } = useMediaQueries();
  const { createRecurringTask } = RecurringTaskController();

  const dailyState = useRecurringStore((state) => state);
  const {
    instance,
    setInstance,

    dialogs,
    setDialog,
  } = dailyState;

  const pillarState = usePillarStore((state) => state);
  const { pillars } = pillarState;

  const [isCreating, setIsCreating] = useState(false);

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
      title={t("Add_New_Recurring_Task")}
      dialogContentSx={{ p: 0 }}
      dialogProps={{
        dir: i18n.dir(),
      }}
      content={
        <Task
          taskState={instance.new}
          instanceType="new"
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
                    taskState={instance.new}
                    instanceType="new"
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

              <RecurringFields type="new" />
            </>
          }
        />
      }
      buttons={
        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton
            loading={isCreating}
            disabled={!instance.new.title}
            variant="contained"
            color="info"
            className="app-font"
            onClick={async () => {
              try {
                setIsCreating(true);
                await createRecurringTask(instance.new);
                setDialog("new", false);
                setInstance("new", {});
                setIsCreating(false);
              } catch (e) {
                setIsCreating(false);
                console.error("From NewRecurringDialog", e);
              }
            }}
          >
            {t("Create_Recurring_Task")}
          </LoadingButton>
        </Grid>
      }
    />
  );
};

export default NewRecurringDialog;
