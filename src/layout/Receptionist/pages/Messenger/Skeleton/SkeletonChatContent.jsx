import { Skeleton } from "antd";
const SkeletonMessage = ({ isSent }) => (
    <div style={{ display: "flex", justifyContent: isSent ? "flex-end" : "flex-start", marginBottom: "16px" }}>
        {!isSent && <Skeleton.Avatar active size={40} />}
        <div style={{ margin: isSent ? "0 8px 0 0" : "0 0 0 8px", maxWidth: "70%" }}>
            <div style={{ backgroundColor: "white", borderRadius: "15px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", height: 36, padding: 10 }}>
                <Skeleton.Input active style={{ width: Math.random() * 100 + 100, height: 16 }} size="small" />
            </div>
        </div>
    </div>
);
const SkeletonChatContent = () => {
    return (
        <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
            <div style={{ textAlign: "center", margin: "16px 0" }}>
                <Skeleton.Input active style={{ width: 150, height: 14 }} size="small" />
            </div>
            {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonMessage key={index} isSent={index % 2 === 0} />
            ))}
        </div>
    )
}

export default SkeletonChatContent;
