import React, { useState, useEffect } from "react";
import { Login } from "../../components/auth/Login";
import { Layout, Breadcrumb } from "antd";

function Authorize() {
  return (
    <Layout.Content>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Login</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">
        <Login />
      </div>
    </Layout.Content>
  );
}

export default Authorize;
