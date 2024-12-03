import { Route, Routes } from "react-router-dom";
// @ts-ignore
import Login from "../pages/Login/Login";
// @ts-ignore
import Landing from "../pages/Landing/Landing";
import Contributors from "../pages/Contributors/Contributors";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/conquer/contributors" element={<Contributors />} />
    </Routes>
  );
};

export default AuthRoutes;
