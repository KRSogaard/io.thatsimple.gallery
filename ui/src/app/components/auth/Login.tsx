import React from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import { ForbiddenError } from "../../../models/exceptions.models";
import AuthService from "../../../services/AuthService";

export const Login = () => {
  const [loginInvalid, setLoginInvalid] = React.useState(false);

  const onFinish = (values: any) => {
    setLoginInvalid(false);
    AuthService.login(values.email, values.password, values.remember).then(
      (r) => {
        if (!r) {
          setLoginInvalid(true);
          return;
        }

        // Refresh the page
        // window.location.reload();

        window.location.href = "/";
      }
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {loginInvalid && (
        <Alert
          message="Invalid login"
          type="error"
          style={{ marginBottom: 10 }}
        />
      )}
      <Form
        name="basic"
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
