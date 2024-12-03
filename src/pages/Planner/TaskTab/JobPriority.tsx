import { Grade } from "@mui/icons-material";
import { Grid2 as Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { eisenhower } from "../../../functions/eisenhower";

interface JobPriorityProps {
  priority: { urgency?: boolean; importance?: boolean };
}

const JobPriority: React.FC<JobPriorityProps> = ({ priority }) => {
  const { t, i18n } = useTranslation();

  // @ts-ignore
  return (
    priority && (
      <Grid
        container
        justifyContent={i18n.language === "ar" ? "end" : "start"}
        direction={i18n.language === "ar" ? "row-reverse" : "row"}
        alignItems="center"
        gap={0.5}
      >
        {/* @ts-ignore */}
        <Grade fontSize="small" color={eisenhower(priority).color} />
        <Typography
          // sx={{ color: `${eisenhower(priority).color}.dark` }}
          variant="body2"
          className="app-font"
        >
          {t(eisenhower(priority).text)}
        </Typography>
      </Grid>
    )
  );
};

export default JobPriority;
