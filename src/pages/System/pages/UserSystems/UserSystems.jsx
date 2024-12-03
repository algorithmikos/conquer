import React, { useEffect, useState } from "react";
import { useUserStore } from "../../../../store";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2 as Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close,
  DataObjectSharp,
  Delete,
  Edit,
  FileOpen,
  Save,
  Storage,
} from "@mui/icons-material";
import SystemBuilderForm from "../../forms/SystemBuilderForm";
import SystemForm from "../../forms/SystemForm";
import {
  createSystem,
  createSystemInstance,
  updateSystem,
  updateSystemInstance,
} from "../../../../functions/db/models/systems";
import { LoadingButton } from "@mui/lab";

const UserSystems = () => {
  const userStore = useUserStore((state) => state);
  const {
    systems,
    systemData,
    fields,
    systemHolder,

    newSystemDialog,
    editSystemDialog,

    newInstanceDialog,
    editInstanceDialog,

    systemInstance,
    systemInstances,

    setFields,
    setSystemData,
    setSystemHolder,

    setNewSystemDialog,
    setEditSystemDialog,

    setNewInstanceDialog,
    setEditInstanceDialog,

    setSystemInstance,
  } = userStore;

  useEffect(() => {
    console.table(systems);
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  return (
    // User Systems' Start
    <Grid container direction="column" alignItems="center" gap={1} mt={5}>
      <Button
        variant="outlined"
        startIcon={<Storage />}
        onClick={() => {
          setSystemData({});
          setFields([{ modifier: false }]);
          setNewSystemDialog(true);
        }}
      >
        New System
      </Button>

      {systems.map((system) => (
        // System Card Start
        <Card key={system.$id}>
          <CardHeader title={`System of ${system.systemData.systemName}`} />
          <Divider />
          <CardContent>
            <Grid container justifyContent="center" alignItems="center" gap={1}>
              {systemInstances
                .filter((instance) => instance.system === system.$id)
                .map((instance, index) => (
                  <Card key={instance.$id} elevation={3}>
                    <CardHeader title={instance.book_name} />
                    <Divider />
                    <CardContent>
                      <Typography variant="body2">
                        Author: {instance.bookAuthor}
                      </Typography>
                      <Typography variant="body2">
                        Genre: {instance.book_genre?.join(" and ")}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Grid container justifyContent="space-around">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSystemInstance(instance);
                            setSystemHolder(system.$id);
                            setSystemData(system.systemData);
                            setFields(system.fields);
                            setEditInstanceDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </Grid>
                    </CardActions>
                  </Card>
                ))}
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Grid container justifyContent="space-around" alignItems="center">
              <IconButton
                color="primary"
                onClick={() => {
                  setSystemHolder(system.$id);
                  setSystemData(system.systemData);
                  setFields(system.fields);
                  setEditSystemDialog(true);
                }}
              >
                <Edit />
              </IconButton>

              <IconButton
                color="secondary"
                onClick={() => {
                  setSystemHolder(system.$id);
                  setSystemData(system.systemData);
                  setFields(system.fields);
                  setNewInstanceDialog(true);
                }}
              >
                <FileOpen />
              </IconButton>

              <IconButton color="error">
                <Delete />
              </IconButton>
            </Grid>
          </CardActions>
        </Card>
        // System Card End
      ))}

      {/* New System Dialog Start */}
      <Dialog
        open={newSystemDialog}
        onClose={() => {
          setSystemHolder("");
          setSystemData({});
          setFields([{ modifier: false }]);
          setNewSystemDialog(false);
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>New System</Grid>
            <Grid>
              <IconButton
                onClick={() => {
                  setSystemHolder("");
                  setSystemData({});
                  setFields([{ modifier: false }]);
                  setNewSystemDialog(false);
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <SystemBuilderForm />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container justifyContent="space-around" alignItems="center">
            <LoadingButton
              variant="contained"
              color="primary"
              startIcon={<DataObjectSharp />}
              loading={isSaving}
              loadingPosition="start"
              onClick={() => {
                setIsSaving(true);
                createSystem(systemData, fields)
                  .then((result) => {
                    console.log(result);
                    setIsSaving(false);
                  })
                  .catch((e) => {
                    console.warn(e);
                  });
              }}
            >
              Create System
            </LoadingButton>
          </Grid>
        </DialogActions>
      </Dialog>
      {/* New System Dialog End */}

      {/* Edit System Dialog Start */}
      <Dialog
        open={editSystemDialog}
        onClose={() => {
          setSystemHolder("");
          setSystemData({});
          setFields([{ modifier: false }]);
          setEditSystemDialog(false);
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>Edit System</Grid>
            <Grid>
              <IconButton
                onClick={() => {
                  setSystemHolder("");
                  setSystemData({});
                  setFields([{ modifier: false }]);
                  setEditSystemDialog(false);
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <SystemBuilderForm />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container justifyContent="space-around" alignItems="center">
            <LoadingButton
              variant="contained"
              color="primary"
              startIcon={<Save />}
              loading={isSaving}
              loadingPosition="start"
              onClick={() => {
                setIsSaving(true);
                updateSystem(systemHolder, systemData, fields)
                  .then((result) => {
                    console.log(result);
                    setIsSaving(false);
                  })
                  .catch((e) => {
                    console.warn(e);
                  });
              }}
            >
              Save Changes
            </LoadingButton>
          </Grid>
        </DialogActions>
      </Dialog>
      {/* Edit System Dialog End */}

      {/* System Object New Instance Dialog Start */}
      <Dialog
        open={newInstanceDialog}
        onClose={() => {
          setSystemData({});
          setFields([{ modifier: false }]);
          setNewInstanceDialog(false);
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>{systemData.newInstanceDialogTitle}</Grid>
            <Grid>
              <IconButton
                onClick={() => {
                  setSystemData({});
                  setFields([{ modifier: false }]);
                  setNewInstanceDialog(false);
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <SystemForm fields={fields} />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container justifyContent="space-around" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={() => {
                createSystemInstance(systemHolder, systemInstance)
                  .then((result) => console.log(result))
                  .catch((e) => console.warn(e));
              }}
            >
              {systemData.newInstanceDialogPrimaryBtnLabel}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
      {/* System Object New Instance Dialog Start */}

      {/* System Object Edit Instance Dialog Start */}
      <Dialog
        open={editInstanceDialog}
        onClose={() => {
          setSystemData({});
          setFields([{ modifier: false }]);
          setEditInstanceDialog(false);
          setSystemInstance({});
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>{systemData.editInstanceDialogTitle}</Grid>
            <Grid>
              <IconButton
                onClick={() => {
                  setSystemData({});
                  setFields([{ modifier: false }]);
                  setEditInstanceDialog(false);
                  setSystemInstance({});
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <SystemForm fields={fields} />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container justifyContent="space-around" alignItems="center">
            <LoadingButton
              loading={isSaving}
              loadingPosition="start"
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={() => {
                setIsSaving(true);
                updateSystemInstance(systemInstance)
                  .then((result) => {
                    console.log(result);
                    setIsSaving(false);
                  })
                  .catch((e) => {
                    console.warn(e);
                    setIsSaving(false);
                  });
              }}
            >
              {systemData.editInstanceDialogPrimaryBtnLabel}
            </LoadingButton>
          </Grid>
        </DialogActions>
      </Dialog>
      {/* System Object Edit Instance Dialog Start */}
    </Grid>
    // User Systems' End
  );
};

export default UserSystems;
