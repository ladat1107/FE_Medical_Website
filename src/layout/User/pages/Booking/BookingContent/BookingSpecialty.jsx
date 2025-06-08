import { Input } from 'antd';
import { SearchOutlined } from '@mui/icons-material';
import userService from '@/services/userService';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '@/components/Loading/Loading';
import { useMutation } from '@/hooks/useMutation';
import dayjs from 'dayjs';
const BookingSpecialty = (props) => {
    let [listSpecialty, setListSpecialty] = useState([]);

    let [search, setSearch] = useState('');
    let searchDebounce = useDebounce(search || "", 500);
    const {
        data: dataSpecialty,
        loading: loadingSepcialty,
        execute: fetchSpecialty,
    } = useMutation(() => userService.getSpecialty({ search: searchDebounce, date: dayjs().format("YYYY-MM-DD 00:00:00") }));
    useEffect(() => {
        if (dataSpecialty) {
            setListSpecialty(dataSpecialty?.DT || []);
        }
    }, [dataSpecialty]);
    useEffect(() => {
        fetchSpecialty();
    }, [searchDebounce]);
    let handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    return (
        <div>
            <div className="relative bg-gradient-primary text-white text-center text-lg font-bold py-2 px-4 rounded-t-lg mb-2">
                <FontAwesomeIcon className='absolute top-[15px] left-[25px] cursor-pointer' icon={faLeftLong} onClick={() => { props.back() }} />
                Vui lòng chọn chuyên khoa
            </div>
            <div className='p-4 min-h-[300px]'>
                <Input
                    onChange={(e) => handleChangeSearch(e)}
                    style={{ height: '40px', borderRadius: '5px', }}
                    placeholder="Tìm nhanh chuyên khoa hoặc triệu chứng"
                    suffix={<SearchOutlined />}
                />
                {loadingSepcialty ?
                    <div className="h-[500px] overflow-auto scrollbar-none mt-3"><Loading /></div>
                    :
                    <div className="h-[500px] overflow-auto scrollbar-none mt-3">
                        {listSpecialty?.length > 0 && listSpecialty.map((specialty, index) => (
                            <div key={index}
                                className="p-2.5 border-b border-gray-300 cursor-pointer hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] transition-transform last:border-none"
                                onClick={() => props.next(specialty)}>
                                <strong className="block font-bold mb-1 text-[#007bbf]">{specialty.name}</strong>
                                {specialty?.shortDescription && (
                                    <div className="text-sm text-gray-600 m-0">
                                        <span className="text-[#FFA500] font-semibold">Triệu chứng: </span>
                                        {specialty.shortDescription}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}
export default BookingSpecialty;