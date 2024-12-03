import { Button, DialogContentText, Grid2 as Grid } from "@mui/material";
import CustomDialog, { CustomDialogProps } from "./CustomDialog";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface DelDialogProps extends CustomDialogProps {
  delFunction: (params?: any) => void;
  instanceTitle: {
    original: string;
    confirmation: string;
  };
  contentFields: JSX.Element;
}

const DelDialog: (props: DelDialogProps) => JSX.Element = ({
  state,
  setState,
  dailogType,
  logic,
  fullScreen,
  title,
  content,
  contentFields,
  delFunction,
  instanceTitle,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <CustomDialog
      state={state}
      setState={setState}
      dailogType={dailogType}
      title={title}
      // Optional
      logic={logic}
      fullScreen={fullScreen}
      // ** Optional **
      content={
        <Grid container direction="column" gap={1} alignItems="center">
          <DialogContentText className="app-font">{content}</DialogContentText>
          {contentFields && contentFields}
        </Grid>
      }
      buttons={
        <Grid container justifyContent="center" alignItems="center" gap={1}>
          <Button
            className="app-font"
            disabled={instanceTitle.original !== instanceTitle.confirmation}
            variant="contained"
            // loadingPosition={i18n.language !== "ar" ? "start" : "end"}
            startIcon={i18n.language !== "ar" && <Delete />}
            endIcon={i18n.language === "ar" && <Delete />}
            color="error"
            onClick={() => {
              delFunction();
            }}
          >
            {t("Delete")}
          </Button>
        </Grid>
      }
    />
  );
};

export default DelDialog;
