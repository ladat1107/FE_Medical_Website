import React from "react";
import { Card, Row, Col, List, Alert, Typography, Progress } from "antd";
import { Bar } from "react-chartjs-2";
import styles from "./HomePage.module.scss"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import socket from "@/Socket/socket";
// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const { Title } = Typography;

const AdminHomePage = () => {
    // Mock Data
    const stats = [
        { title: "Bệnh nhân hôm nay", value: 120 },
        { title: "Bác sĩ trực", value: 45 },
        { title: "Khoa hoạt động", value: 12 },
        { title: "Giường bệnh trống", value: 32 },
    ];

    const recentPatients = [
        { name: "Nguyễn Văn A", department: "Khoa Nội", time: "10:30 sáng" },
        { name: "Trần Thị B", department: "Khoa Sản", time: "11:00 sáng" },
        { name: "Nguyễn Văn A", department: "Khoa Nội", time: "10:30 sáng" },
        { name: "Trần Thị B", department: "Khoa Sản", time: "11:00 sáng" },
        { name: "Nguyễn Văn A", department: "Khoa Nội", time: "10:30 sáng" },
        { name: "Trần Thị B", department: "Khoa Sản", time: "11:00 sáng" },
        { name: "Nguyễn Văn A", department: "Khoa Nội", time: "10:30 sáng" },
        { name: "Trần Thị B", department: "Khoa Sản", time: "11:00 sáng" },
        { name: "Nguyễn Văn A", department: "Khoa Nội", time: "10:30 sáng" },
        { name: "Trần Thị B", department: "Khoa Sản", time: "11:00 sáng" },
    ];

    const chartData = {
        labels: ["Nội", "Ngoại", "Nhi", "Tim", "Sản"],
        datasets: [
            {
                label: "Tỷ lệ sử dụng (%)",
                data: [80, 60, 90, 70, 50],
                backgroundColor: "rgba(24, 144, 255, 0.6)",
            },
        ],
    };

    return (
        <div className={styles.dashboard}>
            <Row gutter={[16, 16]}>
                {/* Tổng quan */}
                {stats.map((stat, index) => (
                    <Col key={index} xs={12} md={6}>
                        <Card className={styles.card}>
                            <Title level={4}>{stat.title}</Title>
                            <Title level={2} style={{ color: "#1890ff" }}>
                                {stat.value}
                            </Title>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Biểu đồ */}
            <Row gutter={[16, 16]} className={styles.row}>
                <Col xs={24} md={12}>
                    <Card title="Tỷ lệ sử dụng giường bệnh">
                        <Bar data={chartData} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Hiệu suất hoạt động (KPI)">
                        <Progress percent={75} status="active" />
                        <Progress percent={90} status="active" />
                        <Progress percent={65} status="active" />
                    </Card>
                </Col>
            </Row>

            {/* Danh sách hoạt động */}
            <Row gutter={[16, 16]} className={styles.row}>
                <Col xs={24} md={12}>
                    <Card title="Bệnh nhân mới nhập viện">
                        <List
                            dataSource={recentPatients}
                            renderItem={(patient) => (
                                <List.Item>
                                    {patient.name} - {patient.department} ({patient.time})
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Cảnh báo & Thông báo">
                        <Alert
                            message="Cảnh báo: Khoa Nhi sắp hết giường trống!"
                            type="warning"
                            showIcon
                            className={styles.alert}
                        />
                        <Alert
                            message="Thông báo: Bảo trì hệ thống vào 10:00 tối."
                            type="info"
                            showIcon
                            className={styles.alert}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminHomePage;
