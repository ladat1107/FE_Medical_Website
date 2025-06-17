import { Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faBell, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames"; // npm install classnames

const statusFilterItems = [
    {
        key: "all",
        icon: faFilter,
        label: "Tất cả",
    },
    {
        key: "unread",
        icon: faBell,
        label: "Chưa đọc",
        badge: true,
    },
    {
        key: "read",
        icon: faCheckDouble,
        label: "Đã đọc",
    },
];

const StatusFilter = ({ statusFilter, handleStatusFilterChange, totalUnreadCount }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {statusFilterItems.map((item) => {
                const isActive = statusFilter === item.key;
                return (
                    <button
                        key={item.key}
                        onClick={() => handleStatusFilterChange(item.key)}
                        className={classNames(
                            "flex items-center gap-2 rounded-full px-4 py-1 border transition",
                            {
                                "bg-primary-tw text-white border-primary-tw": isActive,
                                "bg-white text-gray-800 border-gray-300 hover:border-primary-tw": !isActive,
                            }
                        )}
                    >
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                        {item.badge && totalUnreadCount > 0 && (
                            <Badge count={totalUnreadCount} offset={[6, -2]} />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default StatusFilter;
