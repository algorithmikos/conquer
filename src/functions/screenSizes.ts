import { useMediaQuery } from "@mui/material";

// Define a custom hook to check media query
export const useMediaQueries: () => {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
} = () => {
  const xs = useMediaQuery("(max-width: 599.95px)");
  const sm = useMediaQuery("(min-width: 600px) and (max-width: 959.95px)");
  const md = useMediaQuery("(min-width: 960px) and (max-width: 1279.95px)");
  const lg = useMediaQuery("(min-width: 1280px) and (max-width: 1919.95px)");
  const xl = useMediaQuery("(min-width: 1920px)");

  return { xs, sm, md, lg, xl };
};
