import { Skeleton } from "antd";
import "./HandbookItem.scss";

const HandbookItemSkeleton = () => {
    return (
        Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 ps-3 pb-3">
                <div className="handbook-item-cart w-100">
                    <div className="w-100 h-100" >
                        <Skeleton.Input style={{ width: "100%", height: "150px", borderRadius: "8px" }} active />
                    </div>
                    <div className="handbook-content">
                        <div className="time">
                            <Skeleton.Button size="small" />
                        </div>
                        <div className="title">
                            <Skeleton.Input style={{ width: 200 }} active />
                        </div>
                        <div className="content-handbook">
                            <Skeleton active />
                        </div>
                        <div className="footer-handbook d-flex align-items-center">
                            <div className="avt-authur" style={{ backgroundColor: "#f0f0f0", borderRadius: "50%", width: 40, height: 40 }}>
                                <Skeleton.Avatar size="large" active />
                            </div>
                            <div className="name ps-2">
                                <Skeleton.Input style={{ width: 150 }} active />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )));
};

export default HandbookItemSkeleton;
