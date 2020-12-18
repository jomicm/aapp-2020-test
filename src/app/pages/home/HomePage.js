import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import Locations from "./Locations/Locations";
import Assets from "./Assets/Assets";
import Reports from "./Reports/Reports";
import Users from "./Users/Users";
import Employees from "./Employees/Employees";
import Processes from "./Processes/Processes";
import Settings from "./Settings/Settings";
import Messages from "./Messages/Messages";
import Help from "./Help/Help";

const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

export default function HomePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact from="/" to="/dashboard" />}
        <Route path="/assets" component={Assets} />
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/Employees" component={Employees} />
        <Route path="/locations" component={Locations} />
        <Route path="/processes" component={Processes} />
        <Route path="/settings" component={Settings} />
        <Route path="/messages" component={Messages} />
        <Route path="/help" component={Help} />
        <Route path="/reports" component={Reports} />
        <Route path="/users" component={Users} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/docs" component={DocsPage} />
        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
