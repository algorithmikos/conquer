import { Grid2 as Grid } from "@mui/material";
import AuthRoutes from "../../routes/AuthRoutes";
/* @ts-ignore */
import UpperBar from "../../components/Navigation/UpperBar/UpperBar";

const WidescreenAuth = () => {
  return (
    <main>
      <UpperBar />
      <Grid container direction="column" alignItems="center">
        <AuthRoutes />
      </Grid>
    </main>
  );
};

export default WidescreenAuth;
