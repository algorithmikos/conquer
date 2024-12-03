import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useUserStore } from "../../../store";

const SystemForm = ({ fields }) => {
  const userStore = useUserStore((state) => state);
  const { systemInstance, setSystemInstance } = userStore;

  useEffect(() => {
    // fields.forEach((field) => {
    //   const fieldValue = objectKeyMaker(field.label);
    //   console.log(fieldValue);
    // });

    console.log(systemInstance);
  }, [systemInstance]);

  const objectKeyMaker = (fieldLabel) => {
    return fieldLabel.replace(" ", "_").toLowerCase().trim();
  };

  return (
    <Grid container justifyContent="center" alignItems="center" gap={1}>
      {fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <TextField
                fullWidth
                label={field.label}
                placeholder={field.placeholder || ""}
                size={field.size || "medium"}
                value={systemInstance[field.key] || ""}
                onChange={(e) => {
                  setSystemInstance({
                    ...systemInstance,
                    [field.key]: e.target.value,
                  });
                }}
              />
            );

          case "number":
            return (
              <TextField
                fullWidth
                label={field.label}
                placeholder={field.placeholder || ""}
                size={field.size || "medium"}
                value={systemInstance[field.key] || ""}
                onChange={(e) => {
                  setSystemInstance({
                    ...systemInstance,
                    [field.key]: e.target.value,
                  });
                }}
              />
            );

          case "select":
            return (
              <TextField
                fullWidth
                select
                label={field.label}
                placeholder={field.placeholder || ""}
                size={field.size || "medium"}
                value={systemInstance[field.key] || ""}
                onChange={(e) => {
                  setSystemInstance({
                    ...systemInstance,
                    [field.key]: e.target.value,
                  });
                }}
              >
                {field.selectValues.map((value, index) => (
                  <MenuItem key={value} value={value}>
                    {field.selectLabels[index]}
                  </MenuItem>
                ))}
              </TextField>
            );

          case "multiselect":
            return (
              <FormControl fullWidth size={field.size || "medium"}>
                <InputLabel id={`multiple-${field.label}`}>
                  {field.label}
                </InputLabel>
                <Select
                  labelId={`multiple-${field.label}`}
                  id={`${field.label}`}
                  multiple
                  input={<OutlinedInput label={field.label} />}
                  value={systemInstance[field.key] || []}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSystemInstance({
                      ...systemInstance,
                      [field.key]:
                        typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            field.selectLabels[
                              field.selectValues.indexOf(value)
                            ]
                          }
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                >
                  {field.selectValues.map((value, index) => (
                    <MenuItem key={value} value={value}>
                      <Checkbox
                        checked={systemInstance[field.key]?.indexOf(value) > -1}
                      />
                      <ListItemText primary={field.selectLabels[index]} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );

          case "date":
            return (
              <TextField
                fullWidth
                label={field.label}
                placeholder={field.placeholder || ""}
                size={field.size || "medium"}
                type="date"
                value={systemInstance[field.key] || ""}
                onChange={(e) => {
                  setSystemInstance({
                    ...systemInstance,
                    [field.key]: e.target.value,
                  });
                }}
              />
            );
        }
      })}
    </Grid>
  );
};

export default SystemForm;
