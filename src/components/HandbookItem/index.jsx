import "./HandbookItem.scss";
import DropdownHandbook from "./DropdownHandbook";
import { formatDate } from "@/utils/formatDate";
const HandbookItem = (props) => {
    let handbook = props?.data;
    return (
        <div className="col-12 col-md-6 col-lg-4 ps-3 pb-3" key={props?.index}>
            <div className="handbook-item-cart w-100">
                <div className="handbook-image" style={{ backgroundImage: `url(${handbook?.image || 'https://ant-cra.cremawork.com/assets/images/extra-pages/blog/blog-img.png'})` }}>
                    <DropdownHandbook 
                    id={handbook.id}
                    handleUpdate={props.handleUpdate}
                     />
                </div>
                <div className="handbook-content">
                    <div className="time"> {formatDate(handbook?.createdAt)}</div>
                    <div className="title">{handbook?.title || "Tiêu đề"}</div>
                    <div className="content-handbook">{handbook?.shortDescription || "Nội dung"}</div>
                    <div className="footer-handbook">
                        <div className="avt-authur" style={{ backgroundImage: `url(${handbook?.handbookStaffData?.staffUserData?.avatar || 'https://ant-cra.cremawork.com/assets/images/avatar/A12.jpg'})` }}>
                        </div>
                        <div className="name">{handbook?.handbookStaffData?.staffUserData?.lastName + " " + handbook?.handbookStaffData?.staffUserData?.firstName}
                            {handbook?.statusLabel && <span className="ps-3"><b>{handbook?.statusLabel}</b></span>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default HandbookItem;