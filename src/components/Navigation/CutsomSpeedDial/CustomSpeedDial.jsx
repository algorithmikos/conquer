import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";

const CustomSpeedDial = ({ actions }) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic"
      sx={{ position: "absolute", bottom: 70, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

export default CustomSpeedDial;
