import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHospital } from "@fortawesome/free-regular-svg-icons";
import { faBriefcaseMedical, faHandHoldingMedical } from "@fortawesome/free-solid-svg-icons";
import { formatDateDD_MM } from "@/utils/formatDate";
import { useSelector } from "react-redux";
const BookingInformation = () => {
    let { specialty, doctor, schedule } = useSelector(state => state.booking);
    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-primary text-white font-bold text-lg py-2 px-3 text-center mb-2">Thông tin cơ sở y tế</div>
                <div className="px-4 py-1 text-secondaryText-tw text-sm flex items-start">
                    <FontAwesomeIcon className="mt-2" icon={faHospital} />
                    <div className="ml-2">
                        <div className="font-semibold mb-1">Bệnh viện Hoa Sen</div>
                        <div className="text-gray-600">
                            Cơ sở 215 Hồng Bàng, Phường 11, Quận 5, TP.HCM
                        </div>
                    </div>
                </div>
                {specialty && <div className="px-4 py-1 text-secondaryText-tw text-sm flex items-start">
                    <FontAwesomeIcon className="mt-1" icon={faBriefcaseMedical} />
                    <div className="ml-2">
                        <div className="font-semibold">Chuyên khoa: {specialty.name}</div>
                    </div>
                </div>}
                {doctor && <div className="px-4 py-1 text-secondaryText-tw text-sm flex items-start">
                    <FontAwesomeIcon className="mt-1" icon={faHandHoldingMedical} />
                    <div className="ml-2">
                        <div className="font-semibold">{doctor?.position || "BS"}. {doctor?.staffUserData.lastName + " " + doctor?.staffUserData.firstName}</div>
                    </div>
                </div>}
                {schedule && <div className="px-4 py-1 text-secondaryText-tw text-sm flex items-start">
                    <FontAwesomeIcon className="mt-1" icon={faClock} />
                    <div className="ml-2">
                        <div className="font-semibold">Thời gian: </div>
                        <div className="text-gray-600">
                            Ngày {formatDateDD_MM(schedule.date)}   ({schedule.time.label})
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}
export default BookingInformation;