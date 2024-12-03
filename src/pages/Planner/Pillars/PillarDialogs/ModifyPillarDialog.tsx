import { Button } from "@mui/material";
import { usePillarStore } from "../../../../store";
// @ts-ignore
import Pillar from "../../../../forms/Pillar";
import PillarController from "../../../../backend/functions/Pillar";
import { compare2Objects } from "../../../../utils/compare2Objects";
import { useTranslation } from "react-i18next";

const ModifyPillarDialog = () => {
  const { updatePillar } = PillarController();
  const pillarState = usePillarStore((state) => state);
  const { instance, setInstance, dialogs, setDialog } = pillarState;

  const { t } = useTranslation();

  return (
    <Pillar
      closeDialog={() => {
        setDialog("modify", false);
        setInstance("modified", {});
      }}
      dialogStatus={dialogs.modify}
      dialogTitle={t("Edit_Pillar")}
      instanceType="modified"
      taskState={instance.modified}
      setTaskState={setInstance}
      buttons={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            const changes = compare2Objects(instance.old, instance.modified);
            if (changes && Object.keys(changes).length) {
              /* @ts-ignore */
              await updatePillar(changes, instance.modified.$id);
              setDialog("modify", false);
              setInstance("modified", {});
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

export default ModifyPillarDialog;
