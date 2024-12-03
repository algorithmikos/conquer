import React from "react";
import "./Pillar.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid2 as Grid,
  Grow,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMediaQueries } from "../functions/screenSizes";
import { usePillarStore } from "../store";
import { useTranslation } from "react-i18next";

const Pillar = ({
  closeDialog,
  dialogStatus,
  dialogTitle,
  taskState,
  setTaskState,
  instanceType,
  inputFields,
  buttons,
}) => {
  const { xs, sm, md, lg, xl } = useMediaQueries();
  const { t } = useTranslation();

  const pillarState = usePillarStore((state) => state);
  const { pillars, setPillars, getPillarById } = pillarState;

  return (
    <Dialog
      TransitionComponent={Grow}
      onClose={closeDialog}
      open={dialogStatus}
      fullScreen={xs}
      // fullWidth={md || lg || xl}
    >
      <DialogTitle
        sx={{
          fontSize: "20px",
          fontWeight: "bold",
          mr: 1,
          ml: 1,
        }}
      >
        <Grid container justifyContent="space-between">
          <Grid>{dialogTitle}</Grid>
          <Grid>
            <Button variant="text" color="error" onClick={closeDialog}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>

      {/* <Divider /> */}
      <Grid container direction="column" p={0}>
        <Grid mt={-3} pr={1} pl={1}>
          <DialogContent mb={1}>
            <Grid container direction="column" gap={xs ? 2 : 1} mt={1}>
              {/* Title Field Start */}
              <Grid>
                <TextField
                  label={t("Title")}
                  defaultValue={taskState.title || ""}
                  onBlur={(e) =>
                    setTaskState(instanceType, {
                      ...taskState,
                      title: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid>
              {/* Title Field End */}

              {/* Details Field Start */}
              <Grid>
                <TextField
                  label={t("Details")}
                  defaultValue={taskState.details || ""}
                  onBlur={(e) =>
                    setTaskState(instanceType, {
                      ...taskState,
                      details: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  // maxRows={3}
                />
              </Grid>
              {/* Details Field End */}
            </Grid>
          </DialogContent>
        </Grid>

        <Grid sx={{ backgroundColor: "#444444" }} pr={1} pl={1}>
          <DialogContent>
            <Grid container direction="column" gap={xs ? 2 : 1} mt={-1}>
              {/* Status Field Start */}
              <Grid>
                <FormControl fullWidth>
                  <InputLabel>{t("Status")}</InputLabel>
                  <Select
                    label={t("Status")}
                    value={taskState.status || "none"}
                    onChange={(e) =>
                      setTaskState(instanceType, {
                        ...taskState,
                        status: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="active">{t("Active")}</MenuItem>
                    <MenuItem value="idle">{t("Idle")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Status Field End */}

              {inputFields}
            </Grid>
          </DialogContent>
        </Grid>
      </Grid>

      <Divider />
      <DialogActions sx={{ justifyContent: "center" }}>{buttons}</DialogActions>
    </Dialog>
  );
};

export default Pillar;
