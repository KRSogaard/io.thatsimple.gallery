import * as React from 'react';
import { Alert, Row, Col } from 'antd';

export function ErrorAlert({ message }: ErrorRequest) {
  if (!message || message === null || message === undefined) {
    return null;
  }
  return (
    <Row style={{ marginBottom: '10px' }}>
      <Col span={12} offset={6}>
        <Alert message={message} type="error" showIcon closable />
      </Col>
    </Row>
  );
}

interface ErrorRequest {
  message: string | null;
}

export default ErrorAlert;