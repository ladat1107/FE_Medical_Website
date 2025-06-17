import { DatePicker, Input } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import userService from "@/services/userService";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils/formatCurrency";
import { faLeftLong, faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@/hooks/useMutation";
import Loading from "@/components/Loading/Loading";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const BookingDoctor = (props) => {
    let [specialtyId, setSpecialtyId] = useState(props.specialtyId);
    let [date, setDate] = useState(null);
    let [listDoctor, setListDoctor] = useState([]);
    let [listDoctorFilter, setListDoctorFilter] = useState([]);
    let [search, setSearch] = useState('');
    let searchDebounce = useDebounce(search || "", 500);
    const {
        data: dataDoctor,
        loading: loadingDoctor,
        execute: fetchDoctor,
    } = useMutation(() => userService.getDoctor({ specialtyId: specialtyId, search: searchDebounce, date: '1' }));
    useEffect(() => {
        if (dataDoctor) { setListDoctor(dataDoctor?.DT || []); }
    }, [dataDoctor]);
    
    useEffect(() => {
        fetchDoctor();
    }, [searchDebounce, specialtyId]);

    useEffect(() => {
        if (listDoctor?.length > 0) {
            if (date) {
                const selectedDate = dayjs(date).format("YYYY-MM-DD");
                const _listDoctor = listDoctor.filter((doctor) => {
                    return doctor?.staffScheduleData?.some(item =>
                        dayjs(item.date).isSame(selectedDate, 'day')
                    );
                });
                setListDoctorFilter(_listDoctor);
            } else {
                setListDoctorFilter(listDoctor);
            }
        }
    }, [date, listDoctor]);

    let handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }

    return (
        <>
            <div className="relative bg-gradient-primary text-white text-center text-lg font-bold py-2 px-4 rounded-t-lg mb-2">
                <FontAwesomeIcon className="absolute top-[15px] left-[25px] cursor-pointer" icon={faLeftLong} onClick={() => { props.back() }} />
                Vui lòng chọn bác sĩ
            </div>
            <div className="p-4">
                <div>
                    <Input
                        onChange={(e) => handleChangeSearch(e)}
                        style={{ height: '40px', borderRadius: '5px', }}
                        placeholder="Tìm nhanh bác sĩ"
                        suffix={<SearchOutlined className="text-gray-500" />}
                    />
                </div>
                <div className="mt-2">
                    <DatePicker
                        className="w-full sm:w-1/2 lg:w-1/3 h-[40px] "
                        onChange={(date) => setDate(date)}
                        allowClear={true}
                        placeholder="Chọn ngày khám"
                        format={'DD/MM/YYYY'}
                        disabledDate={(current) => current && current.valueOf() <= dayjs().endOf("day").valueOf()}
                    />
                </div>

                {loadingDoctor ? <div className="h-[500px] overflow-auto scrollbar-none mt-3"><Loading /></div> :
                    <div className="h-[500px] overflow-auto scrollbar-none mt-3">
                        {listDoctorFilter?.length > 0 ? listDoctorFilter.map((doctor, index) => (
                            <div
                                className="border-2 border-[#eceff3] rounded-lg p-4 mb-1 transition-all hover:border-[#1cd7e4] hover:shadow-md"
                                key={index}
                                onClick={() => props.next(doctor)}>
                                <div className="text-lg font-bold text-[#f9bc4b] mb-2">
                                    <FontAwesomeIcon className="mr-3" icon={faUserDoctor} />
                                    {doctor?.staffUserData?.lastName + " " + doctor?.staffUserData?.firstName}
                                </div>
                                <p className="text-sm text-secondaryText-tw py-0.5 my-1">
                                    <span>Giới tính:</span> {doctor?.staffUserData?.gender === 1 ? "Nữ" : "Nam"}
                                </p>
                                <p className="text-sm text-secondaryText-tw py-0.5 my-1">
                                    <span>Chuyên khoa:</span> {doctor?.staffSpecialtyData?.name || "Đa khoa"}
                                </p>
                                <p className="text-sm text-secondaryText-tw py-0.5 my-1">
                                    <span>Lịch khám: </span>
                                    <span className="ml-[3px] capitalize"> {doctor?.staffScheduleData?.slice(0, 3).map(item =>
                                        dayjs(item.date).locale('vi').format('dddd (DD-MM)')
                                    ).join(", ")} {" ,....."}</span>
                                </p>
                                <p className="text-sm text-secondaryText-tw py-0.5 my-1">
                                    <span>Giá khám:</span> {formatCurrency(doctor?.price || 0)}
                                </p>
                            </div>
                        )) :
                            <div className="text-center">Không tìm thấy bác sĩ</div>}
                    </div>
                }
            </div>
        </>
    );
}
export default BookingDoctor;