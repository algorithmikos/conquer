// @ts-nocheck
import { useState } from "react";
import { useProjectStore } from "../../../../store";

import { toast } from "react-toastify";
import { TextField } from "@mui/material";

import DelDialog from "../../../../components/CustomDialog/DelDialog";
import PillarController from "../../../../backend/functions/Pillar";
import QuestController from "../../../../backend/functions/Quest";
import { useTranslation } from "react-i18next";

const DeleteProjectDialog = () => {
  const { deleteQuest } = QuestController();
  const questState = useProjectStore((state) => state);
  const { instance, setInstance, dialogs, setDialog } = questState;

  const [titleConfirmation, setTitleConfirmation] = useState("");

  const { t } = useTranslation();

  return (
    <DelDialog
      state={dialogs.delete}
      setState={setDialog}
      dailogType="delete"
      title={t("Delete_Quest")}
      content={t("Quest_Delete_Message")}
      contentFields={
        <TextField
          color="warning"
          label={t("Quest_Title")}
          defaultValue={titleConfirmation}
          onChange={(e) => setTitleConfirmation(e.target.value)}
        />
      }
      instanceTitle={{
        original: instance.modified.title,
        confirmation: titleConfirmation,
      }}
      delFunction={async () => {
        await deleteQuest(instance.modified);
        toast.success(t("Quest_Delete_Success_Message"));
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

export default DeleteProjectDialog;
