import { useProjectStore } from "../../../../store";
import { DialogOptions, InstanceOptions } from "../../../../stores/recurring";

// @ts-ignore
import Project from "../../../../forms/Project";

import { Button } from "@mui/material";
import QuestController from "../../../../backend/functions/Quest";
import { useTranslation } from "react-i18next";

const NewProjectDialog = () => {
  const { createQuest } = QuestController();
  const projectState = useProjectStore((state) => state);
  const { instance, dialogs, setInstance, setDialog } = projectState;

  const { t } = useTranslation();

  return (
    <Project
      closeDialog={() => {
        setDialog(DialogOptions.New, false);
        setInstance(InstanceOptions.New, {});
      }}
      dialogStatus={dialogs.new}
      dialogTitle={t("New_Quest")}
      taskState={instance.new}
      instanceType={"new"}
      setTaskState={setInstance}
      buttons={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            /* @ts-ignore */
            await createQuest(instance.new);
            setDialog(DialogOptions.New, false);
            setInstance(InstanceOptions.New, {});
          }}
        >
          {t("Start_Quest")}
        </Button>
      }
    />
  );
};

export default NewProjectDialog;
