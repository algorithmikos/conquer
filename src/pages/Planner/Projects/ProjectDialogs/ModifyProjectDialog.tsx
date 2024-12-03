import { useProjectStore } from "../../../../store";
import { DialogOptions, InstanceOptions } from "../../../../stores/recurring";

// @ts-ignore
import Project from "../../../../forms/Project";

import { Button } from "@mui/material";
import QuestController from "../../../../backend/functions/Quest";
import { compare2Objects } from "../../../../utils/compare2Objects";
import { useTranslation } from "react-i18next";

const ModifyProjectDialog = () => {
  const { updateQuest } = QuestController();
  const projectState = useProjectStore((state) => state);
  const { instance, dialogs, setInstance, setDialog } = projectState;

  const { t } = useTranslation();

  return (
    <Project
      closeDialog={() => {
        setDialog(DialogOptions.Modify, false);
        setInstance(InstanceOptions.Modified, {});
      }}
      dialogStatus={dialogs.modify}
      dialogTitle={t("Edit_Quest")}
      taskState={instance.modified}
      instanceType={"modified"}
      setTaskState={setInstance}
      buttons={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            const result = compare2Objects(instance.old, instance.modified);
            if (result && Object.keys(result).length) {
              /* @ts-ignore */
              await updateQuest(result, instance.modified.$id);
              setDialog(DialogOptions.Modify, false);
              setInstance(InstanceOptions.Modified, {});
              /* @ts-ignore */
              setInstance("old", {});
            }
          }}
        >
          {t("Save_Changes")}
        </Button>
      }
    />
  );
};

export default ModifyProjectDialog;
