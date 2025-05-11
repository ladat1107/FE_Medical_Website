import { Skeleton } from "antd";
import { ArrowLeftOutlined, SearchOutlined, SendOutlined, PaperClipOutlined } from "@ant-design/icons";
import SkeletonChatContent from "./SkeletonChatContent";

const MessageSkeleton = () => {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Left sidebar */}
            <div style={{ width: "300px", borderRight: "1px solid #e8e8e8", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div style={{ backgroundColor: "white", padding: "12px", display: "flex", alignItems: "center", height: "68px" }}>
                    <ArrowLeftOutlined style={{ marginRight: "8px" }} />
                    <Skeleton.Input active style={{ width: "100%", height: 40 }} size="large" />
                </div>

                {/* Search bar */}
                <div style={{ padding: "8px", borderBottom: "1px solid #e8e8e8" }}>
                    <div style={{ backgroundColor: "#f5f5f5", borderRadius: "4px", display: "flex", alignItems: "center", padding: "8px 12px" }}>
                        <SearchOutlined style={{ color: "#a0a0a0", marginRight: "8px" }} />
                        <Skeleton.Input active style={{ width: 180, height: 16 }} size="small" />
                    </div>
                </div>

                {/* Chat list */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} style={{ padding: "12px", borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center" }}>
                            <Skeleton.Avatar active size={40} />
                            <div style={{ marginLeft: "12px" }}>
                                <Skeleton.Input active style={{ width: 120, height: 16 }} size="small" />
                                <Skeleton.Input active style={{ width: 80, height: 14, marginTop: 4 }} size="small" />
                            </div>
                            <Skeleton.Input active style={{ width: 40, height: 12 }} size="small" />
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Chat header */}
                <div style={{ padding: "12px", borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center" }}>
                    <Skeleton.Avatar active size={40} />
                    <div style={{ marginLeft: "12px" }}>
                        <Skeleton.Input active style={{ width: 120, height: 16 }} />
                        <Skeleton.Input active style={{ width: 80, height: 14, marginTop: 4 }} />
                    </div>
                </div>

                <SkeletonChatContent />

                {/* Message input */}
                <div style={{ padding: "6px 16px", borderTop: "1px solid #e8e8e8", display: "flex", alignItems: "center" }}>
                    <PaperClipOutlined style={{ color: "#a0a0a0", fontSize: "20px", marginRight: "12px" }} />
                    <div style={{ flex: 1, backgroundColor: "#f5f5f5", borderRadius: "24px", padding: "8px 16px" }}>
                        <Skeleton.Input active style={{ width: "100%", height: 12 }} size="small" />
                    </div>
                    <SendOutlined style={{ color: "#00bcd4", fontSize: "20px", marginLeft: "12px" }} />
                </div>
            </div>

        </div>
    );
};

export default MessageSkeleton;
