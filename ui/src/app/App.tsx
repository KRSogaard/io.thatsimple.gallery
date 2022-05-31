import React from "react";
import "antd/dist/antd.css";
import "../style/page.css";
import { Layout } from "antd";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Authorize from "./pages/auth/Authorize";
import SignOut from "./pages/auth/SignOut";
import RegisterPage from "./pages/account/Register";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/authorize" element={<Authorize />} />
          <Route path="/auth/sign-out" element={<SignOut />} />
          <Route path="/account/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
