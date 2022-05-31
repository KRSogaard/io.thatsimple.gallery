import * as React from "react";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  Layout,
  Row,
  Col,
  Button,
  Card,
  Form,
  Input,
  Result,
} from "antd";

import UserService from "../../../services/UserService";
import ErrorAlert from "../../components/common/ErrorAlert";
import { ConflictError } from "../../../models/exceptions.models";

export function RegisterPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setErrorMessage(null);
      await UserService.registerUser({
        username: values.name,
        email: values.email,
        password: values.password,
      });
      setIsRegistered(true);
    } catch (err) {
      console.error("Failed registering", err);
      if (err && err instanceof ConflictError) {
        setErrorMessage("An account with that email already exists");
        return;
      }
      setErrorMessage("Faild to register account");
    }
  };

  return (
    <>
      <Helmet>
        <title>Account - Register</title>
        <meta name="description" content="Archipelago" />
      </Helmet>
      <Layout>
        <Layout.Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
            <Breadcrumb.Item>Github</Breadcrumb.Item>
          </Breadcrumb>
        </Layout.Content>

        <ErrorAlert message={errorMessage} />

        {isRegistered && (
          <Result
            status="success"
            title="Account successfully registered"
            subTitle="You can now log in. You should be redirected to the login page in 10 seconds"
            extra={[
              <a href="/authorize">
                <Button type="primary" key="console">
                  Go Login
                </Button>
              </a>,
            ]}
          />
        )}

        {!isRegistered && (
          <Row>
            <Col span={8} offset={8}>
              <Card title="New user">
                <Form form={form} onFinish={onFinish}>
                  <Form.Item
                    labelCol={{ span: 6 }}
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Name is required",
                      },
                    ]}
                  >
                    <Input autoComplete="name" />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 6 }}
                    label="email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Email is required",
                      },
                    ]}
                  >
                    <Input type="email" autoComplete="email" />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 6 }}
                    label="password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password is required",
                      },
                    ]}
                  >
                    <Input type="password" autoComplete="new-password" />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 20, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                      Register
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Layout>
    </>
  );
}

export default RegisterPage;
