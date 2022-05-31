import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Layout, Row, Col, Typography } from "antd";
import Auth from "../../../services/AuthService";

export function SignOutPage() {
  const { Title } = Typography;
  const navigation = useNavigate();

  React.useEffect(() => {
    Auth.signOut();
    navigation("/");
    window.location.reload();
  }, []);

  return (
    <Layout style={{ padding: "24px 24px 24px" }}>
      <Layout.Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Helmet>
          <title>Sign Out</title>
          <meta name="description" content="Sign out of Gallery" />
        </Helmet>
        <Row>
          <Col
            span={6}
            offset={9}
            className="site-layout-background"
            style={{
              padding: 16,
            }}
          >
            <Title level={2}>You have been signed out</Title>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}

export default SignOutPage;
