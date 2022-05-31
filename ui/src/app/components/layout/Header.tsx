import React from "react";
import { Layout, Menu, Row, Col } from "antd";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Auth from "../../../services/AuthService";
import {
  UnlockOutlined,
  LockOutlined,
  SettingOutlined,
  GithubOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  KeyOutlined,
} from "@ant-design/icons";

export const Header = () => {
  const items = [
    { label: "item 1", key: "item-1" }, // remember to pass the key prop
    { label: "item 2", key: "item-2" }, // which is required
    {
      label: "sub menu",
      key: "submenu",
      children: [{ label: "item 3", key: "submenu-item-1" }],
    },
  ];

  const location = useLocation();
  const { SubMenu } = Menu;

  return (
    <Layout.Header>
      <>
        <Row>
          <Col flex="auto">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" items={items} />
          </Col>
          <Col flex="250px">
            <Menu theme="dark" mode="horizontal">
              {Auth.isAuthenticated() ? (
                <SubMenu
                  key="SubMenu"
                  icon={<SettingOutlined />}
                  title="Profile"
                >
                  {/* <Menu.ItemGroup title="Account">
                    <Menu.Item
                      key="/account/change"
                      icon={<UserSwitchOutlined />}
                      disabled
                    >
                      Change account
                    </Menu.Item>
                    <Menu.Item
                      key="/account/manage/invite"
                      icon={<UserAddOutlined />}
                      disabled
                    >
                      Invite to account
                    </Menu.Item>
                    <Menu.Item
                      key="/account/manage/git"
                      icon={<GithubOutlined />}
                    >
                      <NavLink to="/account/manage/git">Git settings</NavLink>
                    </Menu.Item>
                    <Menu.Item
                      key="/account/manage/access"
                      icon={<KeyOutlined />}
                    >
                      <NavLink to="/account/manage/access">Access</NavLink>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="User">
                    <Menu.Item key="/user" disabled>
                      Profile
                    </Menu.Item>
                    <Menu.Item key="/user/email" disabled>
                      Change email
                    </Menu.Item>
                  </Menu.ItemGroup> */}
                  <Menu.Item key="/auth/sign-out" icon={<LockOutlined />}>
                    <NavLink to={"/auth/sign-out"}>Sign Out</NavLink>
                  </Menu.Item>
                </SubMenu>
              ) : (
                <>
                  <Menu.Item key="/account/register" icon={<UnlockOutlined />}>
                    <NavLink to={"/account/register?path=" + location.pathname}>
                      Register
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="/authorize" icon={<UnlockOutlined />}>
                    <NavLink to={"/authorize?path=" + location.pathname}>
                      Sign In
                    </NavLink>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </Col>
        </Row>
      </>
    </Layout.Header>
  );
};
