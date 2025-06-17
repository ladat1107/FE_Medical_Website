import React from "react";
import { Skeleton, Card } from "antd";

const DeparmentCardSkeleton = () => {
  return (
    <Card
      style={{
        width: 256,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <Skeleton.Avatar active size={150} shape="circle" style={{ marginBottom: 10 }} />
      <Skeleton.Input active style={{ width: 150, height: 24, marginBottom: 10 }} />
      <Skeleton paragraph={{ rows: 2 }} />
      <Skeleton.Button active block style={{ height: 40, borderRadius: 8 }} />
    </Card>
  );
};

export default DeparmentCardSkeleton;
