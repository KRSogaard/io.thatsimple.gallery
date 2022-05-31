import * as React from "react";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import { Typography } from "antd";

import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

export function Time({ epoc }: TimeRequest) {
  const [useAgoTime, setUseTimeAgo] = React.useState(true);

  if (!epoc || epoc === 0 || epoc === NaN) {
    return null;
  }
  let date = new Date(epoc);

  if (useAgoTime) {
    return (
      <span
        onClick={(e) => {
          setUseTimeAgo(false);
        }}
        style={{ cursor: "pointer" }}
      >
        <ReactTimeAgo date={date} locale="en-US" timeStyle="round-minute" />
      </span>
    );
  } else {
    return (
      <span
        onClick={(e) => {
          setUseTimeAgo(true);
        }}
        style={{ cursor: "pointer" }}
      >
        {date.toLocaleString()}
      </span>
    );
  }
}

interface TimeRequest {
  epoc: number;
}

export default Time;
