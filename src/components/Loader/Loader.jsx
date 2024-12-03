import React from "react";
import { Backdrop } from "@mui/material";

const Loader = ({ isLoading }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/7750/7750510.png"
        className="beating-heart"
        height={150}
        width={150}
      />
    </Backdrop>
  );
};

export default Loader;
