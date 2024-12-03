import { useMediaQueries } from "../../functions/screenSizes";
import Widescreen from "./Widescreen.layout";
import Mobile from "./Mobile.layout";
import AppDialogs from "./Dialogs.layout";
import useBackend from "../../hooks/useBackend";

const AppLayoutSwitch = () => {
  useBackend();

  const { xs } = useMediaQueries();

  return (
    <>
      {xs ? <Mobile /> : <Widescreen />}
      <AppDialogs />
    </>
  );
};

export default AppLayoutSwitch;
