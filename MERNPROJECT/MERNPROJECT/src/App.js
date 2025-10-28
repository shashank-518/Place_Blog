import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import User from "./Users/pages/user";
import NewPlace from "./Places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlace from "./Places/pages/UserPlace";
import UpdatePlace from "./Places/pages/UpdatePlace";
import Auth from "./Users/pages/Auth";
import AuthContext from "./shared/context/AuthContext";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // ✅ Login
  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token })
    );
  }, []);

  // ✅ Logout
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  // ✅ Auto-login on refresh
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  // ✅ Routes
  let routes;
  if (token) {
    routes = (
      <>
        <Route path="/" element={<User />} />
        <Route path="/:uid/places" element={<UserPlace />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placesid" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<User />} />
        <Route path="/:uid/places" element={<UserPlace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <>
          <Routes>{routes}</Routes>
        </>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
