import { Skeleton, Card, Row, Col } from "antd";

const DoctorDetailSkeleton = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px auto" }}>
            <Card style={{ width: "80%", padding: 20, }}            >
                <Row gutter={16}>
                    {/* Avatar */}
                    <Col span={6}>
                        <Skeleton.Avatar active size={100} shape="circle" />
                    </Col>
                    {/* Thông tin bác sĩ */}
                    <Col span={18}>
                        <Skeleton.Input active size="large" style={{ width: 200 }} />
                        <Skeleton.Input active size="small" style={{ width: 150, marginTop: 10 }} />
                        <Skeleton.Input active size="small" style={{ width: 100, marginTop: 10 }} />
                    </Col>
                </Row>
                <Skeleton active rows={3} style={{ marginTop: 20 }} />
                <Skeleton.Button active shape="round" block />
            </Card>
        </div>
    );
};

export default DoctorDetailSkeleton;
