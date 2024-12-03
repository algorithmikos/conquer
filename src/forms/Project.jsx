import React, { useEffect } from "react";
import "./Project.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Typography,
} from "@mui/material";
import { useMediaQueries } from "../functions/screenSizes";
import { useProjectStore } from "../store";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useTranslation } from "react-i18next";

const Project = ({
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

  const projectState = useProjectStore((state) => state);
  const { projects, setProjects, getProjectById } = projectState;

  const { t } = useTranslation();

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
          <Grid item>{dialogTitle}</Grid>
          <Grid item>
            <Button variant="text" color="error" onClick={closeDialog}>
              {t("Cancel")}
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>

      {/* <Divider /> */}
      <Grid container direction="column" p={0}>
        <Grid item mt={-3} pr={1} pl={1}>
          <DialogContent mb={1}>
            <Grid item container direction="column" gap={xs ? 2 : 1} mt={1}>
              {/* Title Field Start */}
              <Grid item>
                <TextField
                  label={t("Title")}
                  value={taskState.title}
                  onChange={(e) =>
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
              <Grid item>
                <TextField
                  label={t("Details")}
                  value={taskState.details}
                  onChange={(e) =>
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

        <Grid item sx={{ backgroundColor: "#444444" }} pr={1} pl={1}>
          <DialogContent>
            <Grid container direction="column" gap={xs ? 2 : 1} mt={-1}>
              {/* Status Field Start */}
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel>{t("Status")}</InputLabel>
                  <Select
                    label={t("Status")}
                    value={taskState.status || ""}
                    onChange={(e) =>
                      setTaskState(instanceType, {
                        ...taskState,
                        status: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="in-progress">{t("In_Progress")}</MenuItem>
                    <MenuItem value="on-hold">{t("On_Hold")}</MenuItem>
                    <MenuItem value="done">{t("Done")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Status Field End */}

              {/* Beginning Date Field Start */}
              <Grid item>
                <TextField
                  label={t("Beginning_Date")}
                  type="date"
                  value={taskState.beginning || ""}
                  onChange={(e) =>
                    setTaskState(instanceType, {
                      ...taskState,
                      beginning: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              {/* Beginning Date Field End */}

              {/* End Date Field Start */}
              <Grid item>
                <TextField
                  label={t("End_Date")}
                  type="date"
                  value={taskState.end || ""}
                  onChange={(e) =>
                    setTaskState(instanceType, {
                      ...taskState,
                      end: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              {/* End Date Field End */}

              {/* Advanced Settings Field Start */}
              <Accordion defaultExpanded={taskState.requirements}>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography className="settings-section">
                    {t("Advanced_Settings")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction="column" gap={1}>
                    {/* Requirements Field Start */}
                    <Grid item>
                      <TextField
                        disabled
                        label={t("Requirements")}
                        value={taskState.requirements}
                        onChange={(e) =>
                          setTaskState(instanceType, {
                            ...taskState,
                            requirements: e.target.value,
                          })
                        }
                        fullWidth
                        multiline
                        // maxRows={3}
                      />
                    </Grid>
                    {/* Requirements Field End */}

                    {/* Scope Field Start */}
                    <Grid item>
                      <TextField
                        disabled
                        label={t("Scope")}
                        value={taskState.scope}
                        onChange={(e) =>
                          setTaskState(instanceType, {
                            ...taskState,
                            scope: e.target.value,
                          })
                        }
                        fullWidth
                        multiline
                        // maxRows={3}
                      />
                    </Grid>
                    {/* Scope Field End */}

                    {/* Resources Field Start */}
                    <Grid item>
                      <TextField
                        disabled
                        label={t("Resources")}
                        value={taskState.resources}
                        onChange={(e) =>
                          setTaskState(instanceType, {
                            ...taskState,
                            resources: e.target.value,
                          })
                        }
                        fullWidth
                        multiline
                        // maxRows={3}
                      />
                    </Grid>
                    {/* Resources Field End */}

                    {/* Objectives Field Start */}
                    <Grid item>
                      <TextField
                        disabled
                        label={t("Objectives")}
                        value={taskState.objectives}
                        onChange={(e) =>
                          setTaskState(instanceType, {
                            ...taskState,
                            objectives: e.target.value,
                          })
                        }
                        fullWidth
                        multiline
                        // maxRows={3}
                      />
                    </Grid>
                    {/* Objectives Field End */}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              {/* Advanced Settings Field Start */}

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

export default Project;
