import { useEffect } from "react";
import "./Pillars.css";
import { usePillarStore } from "../../../store";
import { Grid2 as Grid } from "@mui/material";
import Container from "../Container/Container";

const Pillars = () => {
  const pillarState = usePillarStore((state) => state);
  const { filteredPillars, setInstance, setDialog } = pillarState;

  return (
    <Grid container direction="column">
      <Container
        title="pillars"
        containers={filteredPillars}
        setInstance={setInstance}
        setDialog={setDialog}
      />
    </Grid>
  );
};

export default Pillars;
