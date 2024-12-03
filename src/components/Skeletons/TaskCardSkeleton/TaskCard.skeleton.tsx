import {
  Card,
  Checkbox,
  Grid2 as Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const TaskCard = () => {
  const { i18n } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={{
        width: "var(--task-card-width)",
        height: 100,
        bgcolor: "gray.500",
        mt: 0.2,
      }}
    >
      <Grid
        container
        alignItems="center"
        direction={i18n.language === "ar" ? "row-reverse" : "row"}
        pt={0.5}
      >
        <Checkbox disabled size="medium" />
        <Typography variant="caption" width="80%">
          <Skeleton animation="wave" height={35} />
        </Typography>
      </Grid>

      <Grid sx={{ px: 2, my: -1 }}>
        <Skeleton animation="wave" height={50} />
      </Grid>
    </Card>
  );
};

export default TaskCard;
