import GUI from "./pages/gui";
import History from "./pages/history";
import Help from "./pages/help";
import Layout from "./components/Layout";
import { createContext, useEffect } from "react";
import useContinueGUIProtocol from "./hooks/useWebsocket";
import ContinueGUIClientProtocol from "./hooks/ContinueGUIClientProtocol";
import { useDispatch } from "react-redux";
import {
  setApiUrl,
  setVscMachineId,
  setSessionId,
  setVscMediaUrl,
  setDataSwitchOn,
  setWorkspacePaths,
} from "./redux/slices/configSlice";
import {
  setHighlightedCode,
  setServerStatusMessage,
} from "./redux/slices/miscSlice";
import { postVscMessage } from "./vscode";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import ErrorPage from "./pages/error";
import SettingsPage from "./pages/settings";
import Models from "./pages/models";
import HelpPage from "./pages/help";
import ModelConfig from "./pages/modelconfig";
import { usePostHog } from "posthog-js/react";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/index.html",
        element: <GUI />,
      },
      {
        path: "/",
        element: <GUI />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/help",
        element: <Help />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/models",
        element: <Models />,
      },
      {
        path: "/help",
        element: <HelpPage />,
      },
      {
        path: "/modelconfig/:modelName",
        element: <ModelConfig />,
      },
    ],
  },
]);

export const GUIClientContext = createContext<
  ContinueGUIClientProtocol | undefined
>(undefined);

function App() {
  const client = useContinueGUIProtocol(false);
  const posthog = usePostHog();

  const dispatch = useDispatch();
  useEffect(() => {
    const eventListener = (event: any) => {
      switch (event.data.type) {
        case "onLoad":
          dispatch(setApiUrl(event.data.apiUrl));
          dispatch(setVscMachineId(event.data.vscMachineId));
          dispatch(setSessionId(event.data.sessionId));
          dispatch(setVscMediaUrl(event.data.vscMediaUrl));
          dispatch(setDataSwitchOn(event.data.dataSwitchOn));
          if (event.data.uniqueId) {
            posthog?.identify(event.data.vscMachineId);
          }
          dispatch(setWorkspacePaths(event.data.workspacePaths));
          break;
        case "highlightedCode":
          dispatch(setHighlightedCode(event.data.rangeInFile));
          break;
        case "serverStatus":
          dispatch(setServerStatusMessage(event.data.message));
          break;
      }
    };
    window.addEventListener("message", eventListener);
    postVscMessage("onLoad", {});
    return () => window.removeEventListener("message", eventListener);
  }, []);

  useEffect(() => {
    if (document.body.style.getPropertyValue("--vscode-editor-foreground")) {
      localStorage.setItem(
        "--vscode-editor-foreground",
        document.body.style.getPropertyValue("--vscode-editor-foreground")
      );
    }
    if (document.body.style.getPropertyValue("--vscode-editor-background")) {
      localStorage.setItem(
        "--vscode-editor-background",
        document.body.style.getPropertyValue("--vscode-editor-background")
      );
    }
    if (document.body.style.getPropertyValue("--vscode-list-hoverBackground")) {
      localStorage.setItem(
        "--vscode-list-hoverBackground",
        document.body.style.getPropertyValue("--vscode-list-hoverBackground")
      );
    }
  }, []);

  return (
    <GUIClientContext.Provider value={client}>
      <RouterProvider router={router} />
    </GUIClientContext.Provider>
  );
}

export default App;
