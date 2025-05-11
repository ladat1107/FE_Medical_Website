import { PATHS } from "@/constant/path"
import { LINK } from "@/constant/value"
import { formatDate } from "@/utils/formatDate"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"

const HandbookCardHorizontal = ({ item, index }) => {
    const navigate = useNavigate()
    return (
        <div
            className="w-full flex flex-col md:flex-row gap-2 rounded-xl transition-all duration-300 p-2 mb-2 border-1 
            border-gray-200 hover:!border-primary-tw  hover:shadow-md"
            key={index} >
            <div className="w-full md:w-1/3 h-[110px]" >
                <img src={item?.image || LINK.IMAGE_HANDBOOK} alt="Ảnh cẩm nang y tế"
                    className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-2/3" >
                <div className="flex items-center gap-2 text-sm text-gray-600 text-[10px]" >
                    <FontAwesomeIcon icon={faCircle} beatFade size="2xs" style={{ color: "#FFD43B", }} />{item?.tags?.split(",")[0] || "Tin y tế"}
                </div>
                <p className="line-clamp-2 text-sm text-secondaryText-tw font-bold" >{item?.title || "Mô tả ngắn"}</p>
                <div className="flex gap-2 text-[11px] text-secondaryText-tw" >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="13" width="13" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5a2 2 0 01-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"></path></svg>
                    <span>{formatDate(item?.updatedAt || new Date())}</span>
                </div>
                <div className="text-orange-500 text-[12px] font-semibold">{item?.handbookStaffData?.position || ""}. {item?.handbookStaffData?.staffUserData?.lastName + " " + item?.handbookStaffData?.staffUserData?.firstName} {" "}</div>
                <div className="text-primary-tw text-end cursor-pointer font-semibold me-3" onClick={() => navigate(PATHS.HOME.HANDBOOK_DETAIL + "/" + item.id)}>Xem tiếp →</div>
            </div>
        </div>
    )
}

export default HandbookCardHorizontal
