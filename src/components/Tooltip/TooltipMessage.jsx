import { convertDateTimeToString } from "@/utils/formatDate";
import { Tooltip } from "antd"
import dayjs from "dayjs"

const TooltipMessage = ({ children, statusName, createdAt }) => {
    return (
        <Tooltip title={statusName + " " + dayjs(createdAt).format("HH:mm") + " " + convertDateTimeToString(createdAt)}
            overlayInnerStyle={{ whiteSpace: "nowrap", padding: "6px", width: "fit-content", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
            overlayStyle={{ maxWidth: 'fit-content' }}
            placement="bottom"
            arrow={false}
        >
            {children}
        </Tooltip>
    )
}
export default TooltipMessage;
