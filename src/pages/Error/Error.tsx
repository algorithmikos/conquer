import { Grid2 as Grid, Typography } from "@mui/material";
// import { useMediaQueries } from "../../functions/screenSizes";

interface propstypes {
  error: { [key: string]: any };
  resetErrorBoundary?: Function | undefined;
}
const ErrorPage: (props: propstypes) => JSX.Element = ({
  error,
  resetErrorBoundary,
}) => {
  // const { xs, sm, md, lg, xl } = useMediaQueries();
  {
    resetErrorBoundary && resetErrorBoundary();
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid>
        <Typography variant="body2">Something went wrong!</Typography>
      </Grid>
      <Grid>
        <pre>{error?.message}</pre>
      </Grid>
    </Grid>
  );
};

export default ErrorPage;
