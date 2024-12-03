import { Grid2 as Grid, SxProps, Typography } from "@mui/material";
import { useUtilsStore } from "../../store";

interface ExplainerProps {
  svg: JSX.Element;
  text: string;
  sx?: SxProps;
}

const Explainer: (props: ExplainerProps) => JSX.Element = ({
  svg,
  text,
  sx,
}) => {
  const colors = useUtilsStore((state) => state.colors);

  return (
    <Grid
      sx={{
        minWidth: "var(--task-card-width)", // Remove this property after designing the component
        bgcolor: colors?.column_bg_color,
        borderRadius: 2,
        p: 1,
        ...sx,
      }}
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      gap={2}
    >
      {svg}
      <Typography variant="body2">{text}</Typography>
    </Grid>
  );
};

export default Explainer;
