import { Close } from "@mui/icons-material";
import {
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2 as Grid,
  IconButton,
  Slide,
  SxProps,
  DialogProps,
} from "@mui/material";
import Draggable from "react-draggable";
import { useMediaQueries } from "../../functions/screenSizes";

export interface CustomDialogProps {
  state: boolean;
  setState: (dialogType: string, state: boolean) => void;
  logic?: {
    before?: () => void;
    after?: () => void;
  };
  dailogType: string;
  fullScreen?: boolean;
  title: string | JSX.Element;
  content: string | JSX.Element;
  buttons?: JSX.Element;
  dialogProps?: DialogProps;
  dialogContentSx?: SxProps;
}

function PaperComponent(props: any) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const CustomDialog: (props: CustomDialogProps) => JSX.Element = ({
  state,
  setState,
  dailogType,
  fullScreen,
  logic,
  title,
  content,
  buttons,
  dialogProps,
  dialogContentSx,
}) => {
  const { xs } = useMediaQueries();

  return (
    <Dialog
      open={state}
      fullScreen={fullScreen ? true : false}
      maxWidth="xs"
      TransitionComponent={Slide}
      scroll="paper"
      PaperComponent={xs ? Paper : PaperComponent}
      aria-labelledby="draggable-dialog-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          logic?.before && logic.before();
          setState(dailogType, false);
          logic?.after && logic.after();
        }
      }}
      {...dialogProps}
    >
      <DialogTitle
        sx={{ mx: xs ? 2 : 0, cursor: "move" }}
        id="draggable-dialog-title"
        className="app-font"
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>{title}</Grid>
          <Grid>
            <IconButton
              onClick={() => {
                logic?.before && logic.before();
                setState(dailogType, false);
                logic?.after && logic.after();
              }}
            >
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mx: xs ? 2 : 0, ...dialogContentSx }}>
        {content}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ m: "auto" }}>{buttons}</DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
