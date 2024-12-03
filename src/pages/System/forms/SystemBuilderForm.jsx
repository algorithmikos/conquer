import React, { useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Preview } from "@mui/icons-material";

import SystemForm from "./SystemForm";

import { useUserStore } from "../../../store";

const SystemBuilderForm = () => {
  const userState = useUserStore((state) => state);
  const {
    fieldsNumber,
    fields,
    systemData,
    setFieldsNumber,
    setFields,
    setSystemData,
    systemHolder,
  } = userState;

  const [previewMode, setPreviewMode] = useState(false);

  // useEffect(() => {
  //   console.table(fields);
  //   console.table(systemData);
  // }, [fields, systemData]);

  // useEffect(() => {
  //   setPreviewMode(false);
  // }, [fields, fieldsNumber]);

  const objectKeyMaker = (fieldLabel) => {
    return fieldLabel.replace(" ", "_").toLowerCase().trim();
  };

  const [keyAlert, setKeyAlert] = useState(false);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      gap={1}
      sx={{ mt: 2 }}
    >
      {/* System Data Start */}
      <TextField
        autoComplete="off"
        fullWidth
        label="System Name"
        defaultValue={systemData.systemName}
        onBlur={(e) => {
          setSystemData({
            ...systemData,
            systemName: e.target.value,
          });
        }}
      />
      <TextField
        autoComplete="off"
        fullWidth
        label="New Instance Title"
        defaultValue={systemData.newInstanceDialogTitle}
        onBlur={(e) => {
          setSystemData({
            ...systemData,
            newInstanceDialogTitle: e.target.value,
          });
        }}
      />
      <TextField
        autoComplete="off"
        fullWidth
        label="Edit Instance Title"
        defaultValue={systemData.editInstanceDialogTitle}
        onBlur={(e) => {
          setSystemData({
            ...systemData,
            editInstanceDialogTitle: e.target.value,
          });
        }}
      />
      <TextField
        autoComplete="off"
        fullWidth
        label="New Primary Button Name"
        defaultValue={systemData.newInstanceDialogPrimaryBtnLabel}
        onBlur={(e) => {
          setSystemData({
            ...systemData,
            newInstanceDialogPrimaryBtnLabel: e.target.value,
          });
        }}
      />
      <TextField
        autoComplete="off"
        fullWidth
        label="Edit Primary Button Name"
        defaultValue={systemData.editInstanceDialogPrimaryBtnLabel}
        onBlur={(e) => {
          setSystemData({
            ...systemData,
            editInstanceDialogPrimaryBtnLabel: e.target.value,
          });
        }}
      />
      {/* System Data End */}

      {/* Fields Data Start */}
      {Array(fieldsNumber)
        .fill({})
        .map((_, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{ py: 3, width: "100%" }}
            component={Grid}
            container
            justifyContent="center"
            gap={1}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              gap={1}
              mb={1}
            >
              <Typography variant="h6" component="h1">
                Field {index + 1}
              </Typography>
              <IconButton
                color="error"
                sx={{ display: !index && "none" }}
                onClick={() => {
                  fields.splice(index, 1);
                  setFields(fields);
                  setFieldsNumber(fieldsNumber - 1);
                }}
              >
                <Delete />
              </IconButton>

              <Chip
                variant="outlined"
                color="secondary"
                label={
                  <Grid container alignItems="center">
                    <Checkbox
                      sx={{ ml: -1 }}
                      color="secondary"
                      checked={fields?.[index]?.modifier}
                      onChange={(e) => {
                        const field = { ...fields?.[index] };
                        field.modifier = e.target.checked;

                        const filteredFields = [...fields] || [];
                        filteredFields[index] = field;
                        setFields(filteredFields);
                      }}
                    />
                    <Typography variant="body2">Modifier property?</Typography>
                  </Grid>
                }
              />
            </Grid>
            <Grid container justifyContent="center" alignItems="center" gap={1}>
              <TextField
                sx={{ width: "91%" }}
                select
                label={`Type ${index + 1}`}
                value={fields?.[index]?.type || ""}
                onChange={(e) => {
                  const field = { ...fields?.[index] };
                  field.type = e.target.value;

                  const filteredFields = [...fields] || [];
                  filteredFields[index] = field;
                  setFields(filteredFields);
                }}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="multiselect">Multiselect</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </TextField>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" gap={1}>
              <TextField
                autoComplete="off"
                sx={{ width: "45%" }}
                label={`Label ${index + 1}`}
                defaultValue={fields?.[index]?.label || ""}
                onBlur={(e) => {
                  const field = { ...fields[index] };
                  field.label = e.target.value;

                  const filteredFields = [...fields] || [];
                  filteredFields[index] = field;
                  setFields(filteredFields);
                }}
              />

              <TextField
                sx={{ width: "45%" }}
                autoComplete="off"
                label={`Key ${index + 1}`}
                disabled={fields?.[index]?.key && systemHolder}
                placeholder={
                  fields?.[index]?.label &&
                  `E.g. ${objectKeyMaker(fields?.[index]?.label)}`
                }
                onFocus={() => setKeyAlert(true)}
                defaultValue={fields?.[index]?.key || ""}
                onBlur={(e) => {
                  const field = { ...fields[index] };
                  field.key = e.target.value;

                  const filteredFields = [...fields] || [];
                  filteredFields[index] = field;
                  setFields(filteredFields);
                }}
              />
            </Grid>

            {keyAlert && !fields?.[index]?.key && (
              <Alert
                sx={{ width: "91%", my: 0.5, fontWeight: "bold" }}
                severity="warning"
                variant="outlined"
                onClose={() => setKeyAlert(false)}
              >
                {"Once a key is created, it cannot be changed later!".toUpperCase()}
              </Alert>
            )}

            <Grid container justifyContent="center" alignItems="center" gap={1}>
              <TextField
                autoComplete="off"
                sx={{ width: "45%" }}
                label={`Placeholder ${index + 1}`}
                defaultValue={fields?.[index]?.placeholder || ""}
                onBlur={(e) => {
                  const field = { ...fields[index] };
                  field.placeholder = e.target.value;

                  const filteredFields = [...fields] || [];
                  filteredFields[index] = field;
                  setFields(filteredFields);
                }}
              />

              <TextField
                sx={{ width: "45%" }}
                select
                label={`Size ${index + 1}`}
                value={fields?.[index]?.size || ""}
                onChange={(e) => {
                  const field = { ...fields[index] };
                  field.size = e.target.value;

                  const filteredFields = [...fields] || [];
                  filteredFields[index] = field;
                  setFields(filteredFields);
                }}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
              </TextField>

              {(fields?.[index]?.type === "select" ||
                fields?.[index]?.type === "multiselect") && (
                <>
                  <Grid
                    container
                    gap={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TextField
                      autoComplete="off"
                      sx={{ width: "45%" }}
                      multiline
                      label={`Option Values`}
                      helperText={`Separate options with comma ,`}
                      value={fields?.[index]?.selectValues || []}
                      onChange={(e) => {
                        const field = { ...fields[index] };
                        field.selectValues = e.target.value.trim().split(",");

                        const filteredFields = [...fields] || [];
                        filteredFields[index] = field;
                        setFields(filteredFields);
                      }}
                    />

                    <TextField
                      autoComplete="off"
                      sx={{ width: "45%" }}
                      multiline
                      label={`Option Labels`}
                      helperText={`Separate options with comma ,`}
                      value={fields?.[index]?.selectLabels || []}
                      onChange={(e) => {
                        const field = { ...fields[index] };
                        field.selectLabels = e.target.value.split(",");

                        const filteredFields = [...fields] || [];
                        filteredFields[index] = field;
                        setFields(filteredFields);
                      }}
                    />
                  </Grid>

                  {fields?.[index]?.selectValues?.length !==
                    fields?.[index]?.selectLabels?.length && (
                    <Alert severity="error" variant="filled">
                      Values are {fields[index].selectValues?.length} but labels
                      are {fields[index].selectLabels?.length}. They must be the
                      same number of items!
                    </Alert>
                  )}
                </>
              )}
            </Grid>
          </Paper>
        ))}
      {/* Fields Data End */}

      <ButtonGroup>
        <Button
          variant="contained"
          startIcon={<Add />}
          disableRipple
          disableElevation
          disableTouchRipple
          disableFocusRipple
          onClick={() => {
            setFieldsNumber(fieldsNumber + 1);
            setFields([...fields, { modifier: false }]);
          }}
        >
          Add Field
        </Button>

        <Button
          variant="contained"
          color="warning"
          startIcon={<Preview />}
          disableRipple
          disableElevation
          disableTouchRipple
          disableFocusRipple
          onClick={() => setPreviewMode(true)}
        >
          Preview
        </Button>
      </ButtonGroup>

      {previewMode && <SystemForm fields={fields} />}
      {/* <UserSystems /> */}
    </Grid>
  );
};

export default SystemBuilderForm;
