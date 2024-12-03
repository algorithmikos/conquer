import { Grid2 as Grid } from "@mui/material";
/* @ts-ignore */
import UpperBar from "../../components/Navigation/UpperBar/UpperBar";
/* @ts-ignore */
import BottomBar from "../../components/Navigation/BottomBar/BottomBar";
import AuthRoutes from "../../routes/AuthRoutes";

const MobileAuth = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
    >
      <UpperBar />

      <Grid container justifyContent="center" mt={10} mb={5}>
        <AuthRoutes />
      </Grid>
    </Grid>
  );
};

export default MobileAuth;
