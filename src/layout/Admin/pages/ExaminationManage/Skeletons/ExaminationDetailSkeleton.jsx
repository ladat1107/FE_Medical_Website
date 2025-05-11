import { Skeleton, Card, Row, Col, Divider } from "antd"

const ExaminationDetailSkeleton = () => {
    return (
        <div className="space-y-4">
            {/* Header Skeleton */}
            <Card className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <Skeleton.Input active size="large" style={{ width: 200 }} />
                        <Skeleton.Input active size="small" style={{ width: 150, marginTop: 8 }} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Skeleton.Input active size="large" style={{ width: 150 }} />
                        <Skeleton.Input active size="large" style={{ width: 150 }} />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton.Button active size="large" style={{ width: 120 }} />
                    <Skeleton.Button active size="large" style={{ width: 120 }} />
                    <Skeleton.Button active size="large" style={{ width: 120 }} />
                </div>
            </Card>

            {/* Patient Info Skeleton */}
            <Card className="mb-4">
                <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 16 }} />
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card bordered={false} className="h-full bg-bgAdmin">
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={false} className="h-full bg-bgAdmin">
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* Vital Signs Skeleton */}
            <Card className="mb-4">
                <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 16 }} />
                <Row gutter={[16, 16]}>
                    {[...Array(6)].map((_, index) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={index}>
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Examination Info Skeleton */}
            <Card className="mb-4">
                <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 16 }} />
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card bordered={false} className="h-full bg-bgAdmin">
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={false} className="h-full bg-bgAdmin">
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* Payment Info Skeleton */}
            <Card className="mb-4">
                <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 16 }} />
                <Row gutter={[16, 16]}>
                    {[...Array(3)].map((_, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Card className="bg-bgAdmin h-full">
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Divider />
                <Skeleton active paragraph={{ rows: 4 }} />
            </Card>

            {/* Prescription Skeleton */}
            <Card className="mb-4">
                <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 16 }} />
                <Card bordered={false} className="mb-4 bg-gray-50">
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
            </Card>

            {/* Paraclinical Tests Skeleton */}
            <Card className="mb-4">
                <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 16 }} />
                <Card bordered={false} className="mb-4 bg-gray-50">
                    <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
            </Card>
        </div>
    )
}

export default ExaminationDetailSkeleton;
