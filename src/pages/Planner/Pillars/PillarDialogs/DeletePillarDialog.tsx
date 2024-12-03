// @ts-nocheck
import { useState } from "react";
import { usePillarStore } from "../../../../store";
import { db } from "../../../../firebase.config";
import { deleteDoc, doc } from "firebase/firestore";

import { toast } from "react-toastify";
import { TextField } from "@mui/material";

import DelDialog from "../../../../components/CustomDialog/DelDialog";
import PillarController from "../../../../backend/functions/Pillar";
import { useTranslation } from "react-i18next";

const DeletePillarDialog = () => {
  const { deletePillar } = PillarController();
  const pillarState = usePillarStore((state) => state);
  const { instance, setInstance, dialogs, setDialog } = pillarState;

  const [titleConfirmation, setTitleConfirmation] = useState("");

  const { t } = useTranslation();

  return (
    <DelDialog
      state={dialogs.delete}
      setState={setDialog}
      dailogType="delete"
      title={t("Delete_Pillar")}
      content={t("Pillar_Delete_Message")}
      contentFields={
        <TextField
          color="warning"
          label={t("Pillar_Title")}
          defaultValue={titleConfirmation}
          onChange={(e) => setTitleConfirmation(e.target.value)}
        />
      }
      instanceTitle={{
        original: instance.modified.title,
        confirmation: titleConfirmation,
      }}
      delFunction={async () => {
        await deletePillar(instance.modified);
        toast.success(t("Pillar_Delete_Success_Message"));
        setDialog("delete", false);
        setInstance("modified", {});
        setTitleConfirmation("");
      }}
      logic={{
        after: () => {
          setInstance("modified", {});
          setTitleConfirmation("");
        },
      }}
    />
  );
};

export default DeletePillarDialog;
