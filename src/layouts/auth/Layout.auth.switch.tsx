import { useMediaQueries } from "../../functions/screenSizes";
import MobileAuth from "./Mobile.auth.layout";
import WidescreenAuth from "./Widescreen.auth.layout";

const AuthLayoutSwitch = () => {
  const { xs } = useMediaQueries();

  return xs ? <MobileAuth /> : <WidescreenAuth />;
};

export default AuthLayoutSwitch;
