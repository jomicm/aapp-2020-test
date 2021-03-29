/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { LastLocationProvider } from "react-router-last-location";
import { useIdleTimer } from "react-idle-timer";
import { Routes } from "./app/router/Routes";
import { I18nProvider, LayoutSplashScreen, ThemeProvider } from "./_metronic";
import { getDB } from './app/crud/api';

export default function App({ store, persistor, basename }) {
  const [logoutPreferences, setlogoutPreferences] = useState({
    inactivityPeriod: 600000,
    selectedInactivity: 0
  });

  const handleIdle = () => {
    const hrefSplitted = window.location.href.split('/');
    if (hrefSplitted[hrefSplitted.length - 1] !== 'login' && logoutPreferences.selectedInactivity === 1) {
      window.location.replace('/logout');
    };
  };

  useEffect(() => {
    getDB('settingsGeneral')
      .then(response => response.json())
      .then(data => {
        const { inactivityPeriod, selectedInactivity } = data.response[0];
        setlogoutPreferences({inactivityPeriod, selectedInactivity});
      })
      .catch(error => console.log('error>', error));
  }, []);

  useIdleTimer({
    timeout: logoutPreferences.inactivityPeriod,
    onActive: () => { },
    onIdle: () => handleIdle(),
  });

  return (
    /* Provide Redux store */
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
        <Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <BrowserRouter basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <LastLocationProvider>
              {/* Provide Metronic theme overrides. */}
              <ThemeProvider>
                {/* Provide `react-intl` context synchronized with Redux state.  */}
                <I18nProvider>
                  {/* Render routes with provided `Layout`. */}
                  <Routes />
                </I18nProvider>
              </ThemeProvider>
            </LastLocationProvider>
          </BrowserRouter>
        </Suspense>
      </PersistGate>
    </Provider>
  );
}
