import React, { useEffect } from "react";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "../functions/screenSizes";

const Redirect = () => {
  const navigate = useNavigate();
  const { xs, sm, md, lg, xl } = useMediaQueries();

  useEffect(() => {
    if (xs) {
      navigate("/planner/dailies");
    } else {
      navigate("/planner/tasks");
    }
  }, []);

  return <Loader isLoading={true} />;
};

export default Redirect;
