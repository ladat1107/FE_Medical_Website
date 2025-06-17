import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Status.scss"
import { faCircle } from "@fortawesome/free-solid-svg-icons";
const Status = (props) => {
    return (
        // <div className="status">
        //     {+props?.data === 1 ? <>
        //         <span className="pe-2"><FontAwesomeIcon icon={faCircle} beatFade size="2xs" style={{ color: "#04a9f3", }} /></span>Hoạt động
        //     </> : <>
        //         <span className="pe-2"><FontAwesomeIcon icon={faCircle} size="2xs" style={{ color: "#ec3609", }} /></span>Khóa</>}
        // </div>
        <div className="status-content">
            <span className={`status-${+props?.data === 1 ? "on" : "off"}`}>
                <span className="whitespace-nowrap">{+props?.data === 1 ? "Hoạt động" : "Khóa"}</span>
            </span>
        </div>
    )
}
export default Status;