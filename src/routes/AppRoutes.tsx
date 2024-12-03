// @ts-nocheck
// Hooks
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore, useUtilsStore } from "../store";

// Pages
import Redirect from "./Redirect";
import Home from "../pages/Home/Home";
import Email from "../pages/Email/Email";

import Recurrings from "../pages/Planner/Recurrings";
import Jobs from "../pages/Planner/Jobs";
import Habits from "../pages/Planner/Habits/Habits";

import Pillars from "../pages/Planner/Pillars/Pillars";
import PillarTasks from "../pages/Planner/Pillars/PillarTasks";
import Projects from "../pages/Planner/Projects/Projects";

import UserSystems from "../pages/System/pages/UserSystems/UserSystems";

import Settings from "../pages/Settings/Settings";
import Page404 from "../pages/Page404/Page404";
import TaskHistory from "../pages/Planner/Recurrings/TaskHistory/TaskHistory";
import { useEffect } from "react";
import { auth } from "../firebase.config";
import { useRecurringStore } from "../stores/recurring";
import moment from "moment";
import Playground from "../pages/Playground/Playground";
import Chat from "../pages/Playground/Chat";
import useLocalStorageState from "use-local-storage-state";
import EmailConfirmation from "../pages/Email/EmailConfirmation";
import QuestTasks from "../pages/Planner/Projects/QuestTasks";
import Contributors from "../pages/Contributors/Contributors";
import Admin from "../pages/Admin";

interface RouteType {
  path: string;
  element: JSX.Element;
}

const routes: RouteType[] = [
  { path: "/", element: <Redirect /> },
  { path: "/login", element: <Redirect /> },

  { path: "/planner/tasks", element: <Home /> },

  { path: "/planner/pillars", element: <Pillars /> },
  { path: "/planner/pillars/:pillarId", element: <PillarTasks /> },
  { path: "/planner/projects", element: <Projects /> },
  { path: "/planner/projects/:questId", element: <QuestTasks /> },

  { path: "/planner/todos", element: <Jobs /> },
  { path: "/planner/dailies", element: <Recurrings /> },
  { path: "/planner/habits", element: <Habits /> },

  { path: "/planner/history", element: <TaskHistory /> },

  { path: "/settings", element: <Settings /> },
  { path: "/systems", element: <UserSystems /> },

  { path: "/play", element: <Playground /> },
  { path: "/chat", element: <Chat /> },

  { path: "/email", element: <Email /> },
  { path: "/verify-email", element: <EmailConfirmation /> },

  { path: "/admin", element: <Admin /> },

  { path: "/conquer/contributors", element: <Contributors /> },

  { path: "/*", element: <Page404 /> },
];

const AppRoutes = () => {
  const location = useLocation();

  const [authState] = useLocalStorageState<Record<string, any>>("authState");
  const [prefs, setPrefs] =
    useLocalStorageState<Record<string, string>>("prefs");

  const recurringState = useRecurringStore((state) => state);
  const { dayOfRecord, setTimemachineDate, tabValue } = recurringState;

  useEffect(() => {
    const dayStart = prefs?.dayStart || "00:00";

    const now = moment();
    const dayStartTime = moment(
      `${now.format("YYYY-MM-DD")} ${dayStart}`,
      "YYYY-MM-DD HH:mm"
    );

    if (now.isBefore(dayStartTime)) {
      setTimemachineDate(moment(now).subtract(1, "days").format("YYYY-MM-DD"));
    } else {
      if (dayOfRecord !== moment().format("YYYY-MM-DD")) {
        setTimemachineDate(moment(now).format("YYYY-MM-DD"));
      }
    }
  }, [tabValue, prefs]);

  return authState?.emailVerification ? (
    <Routes location={location}>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  ) : (
    <Routes>
      <Route path="/verify-email" element={<EmailConfirmation />} />
      <Route path="/*" element={<Email />} />
    </Routes>
  );
};

export default AppRoutes;
