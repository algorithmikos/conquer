import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useProjectStore } from "../../store";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip({
  taskState,
  setTaskState,
  instanceType,
}) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTaskState(instanceType, {
      ...taskState,
      projects: typeof value === "string" ? value.split(",") : value,
    });
  };

  const projectState = useProjectStore((state) => state);
  const { projects, setProjects } = projectState;

  // This function assumes you have a way to lookup project titles based on ID
  const findProjectTitle = (projectId) => {
    // Implement logic to find the project title based on projectId (e.g., from projects array)
    // You might use a loop, filter, or a lookup table depending on your data structure
    const matchingProject = projects.find(
      (project) => project.$id === projectId
    );
    return matchingProject ? matchingProject.title : ""; // Handle cases where project is not found
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="taskProjects">Project(s)</InputLabel>
        <Select
          labelId="taskProjects"
          id="taskProjectsChip"
          multiple
          value={taskState.projects || []}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Project(s)" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((projectId) => {
                return (
                  <Chip key={projectId} label={findProjectTitle(projectId)} />
                );
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {projects.map((project) => (
            <MenuItem
              key={project.$id}
              value={project.$id}
              // disabled={project.disabled}
              // selected={project.$id}
            >
              {project.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
