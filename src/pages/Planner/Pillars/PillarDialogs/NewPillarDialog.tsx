import { Button } from "@mui/material";
import { usePillarStore } from "../../../../store";
// @ts-ignore
import Pillar from "../../../../forms/Pillar";
// @ts-ignore
import { auth } from "../../../../firebase.config";
import PillarController from "../../../../backend/functions/Pillar";
import { useTranslation } from "react-i18next";

const NewPillarDialog = () => {
  const { createPillar } = PillarController();
  const pillarState = usePillarStore((state) => state);
  const { instance, setInstance, dialogs, setDialog } = pillarState;

  const { t } = useTranslation();

  return (
    <Pillar
      closeDialog={() => {
        setDialog("new", false);
        setInstance("new", {});
      }}
      dialogStatus={dialogs.new}
      dialogTitle={t("New_Pillar")}
      instanceType="new"
      taskState={instance.new}
      setTaskState={setInstance}
      buttons={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            /* @ts-ignore */
            await createPillar(instance.new);
            setDialog("new", false);
            setInstance("new", {});
          }}
        >
          {t("Erect_Pillar")}
        </Button>
      }
    />
  );
};

export default NewPillarDialog;
