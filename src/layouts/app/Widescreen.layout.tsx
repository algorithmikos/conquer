import AppRoutes from "../../routes/AppRoutes";
import { Box } from "@mui/material";

// @ts-ignore
import UpperBar from "../../components/Navigation/UpperBar/UpperBar";
// @ts-ignore
import MainToolbar from "../../components/MainToolbar/MainToolbar";

// @ts-ignore
import { ErrorBoundary } from "react-error-boundary";
// @ts-ignore
import ErrorPage from "../../pages/Error/Error";
import StickySidebar from "../../components/StickySidebar";
import RightSidebar from "../../components/RightSidebar";

const Widescreen = () => {
  return (
    <main style={{ display: "flex", width: "100vw" }}>
      <Box sx={{ flexBasis: "5%" }}>
        <UpperBar />
        <StickySidebar />
      </Box>

      <Box
        sx={{
          flexBasis: "95%",
          width: "95%", // Ensures the container spans full width
          display: "flex",
          justifyContent: "center",
          mt: 5,
          mb: 10,
        }}
      >
        {/* <ErrorBoundary fallbackRender={ErrorPage}> */}
        <AppRoutes />
        <RightSidebar />
        {/* </ErrorBoundary> */}
      </Box>
      {/* </Grid> */}
    </main>
  );
};

export default Widescreen;
