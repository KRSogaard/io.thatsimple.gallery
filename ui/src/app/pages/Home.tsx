import React, { useState, useEffect } from "react";
import { Layout, Breadcrumb } from "antd";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [numberOfTasks, setNumberOfTasks] = useState<number>(0);
  const [isTaskEdited, setTaskEdited] = useState(false);

  return (
    <Layout.Content>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">Welcome</div>
    </Layout.Content>
  );
}

export default Home;
