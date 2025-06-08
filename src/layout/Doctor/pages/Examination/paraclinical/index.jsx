import { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Paracdetail from '../Paracdetail';
import { message } from 'antd';
import { createRequestParaclinical, getServiceLaboratory } from '@/services/doctorService';
import './Paraclinical.scss';
import { useMutation } from '@/hooks/useMutation';

const Paraclinical = ({ listParaclinicals, examinationId, refresh, isEditMode }) => {
    const [paracDetails, setParacDetails] = useState(listParaclinicals);

    const [inputParac, setInputParac] = useState('');
    const [shakeId, setShakeId] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedParaclinicals, setSelectedParaclinicals] = useState([]);
    const [paracOptions, setParacOptions] = useState([]);

    const paraclinicalContainerRef = useRef(null);
    const inputref = useRef(null);
    const searchResultsRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    //Paraclinical options
    let {
        data: dataParaclinicals,
        loading: comorbiditiesLoading,
        error: comorbiditiesError,
        execute: fetchParaclinical,
    } = useMutation((query) =>
        getServiceLaboratory()
    );

    useEffect(() => {
        if (dataParaclinicals && dataParaclinicals.DT) {
            const paracOptions = dataParaclinicals.DT.map(item => ({
                id: item.id,
                label: item.name,
                price: item.price,
            }));
            setParacOptions(paracOptions);
        }
    }, [dataParaclinicals]);

    const sortedParacDetails = useMemo(() => {
        return [...paracDetails].sort((a, b) => b.id - a.id);
    }, [paracDetails]);

    const handleParacRequest = async () => {
        if (selectedParaclinicals.length === 0) {
            message.warning('Vui lòng chọn ít nhất một xét nghiệm!');
            return;
        }

        const data = {
            examinationId: examinationId,
            listParaclinicals: selectedParaclinicals
        }

        setIsLoading(true);

        try {
            // Gọi API tạo yêu cầu xét nghiệm
            const response = await createRequestParaclinical(data);

            // console.log("Response:", response);
            if (response.DT && response.EC === 0) {
                message.success('Tạo yêu cầu xét nghiệm thành công!');
                refresh();
                setSelectedParaclinicals([]);
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error('Error creating request:', error);
            message.error('Đã xảy ra lỗi khi tạo yêu cầu xét nghiệm!');
        } finally {
            setIsLoading(false);
        }
    }

    // Bệnh đi kèm
    const handleInputChange = (event) => {
        setInputParac(event.target.value);
        setShowSearchResults(true);
    };

    const filteredParaclinicals = paracOptions.filter(paraclinical =>
        paraclinical.label.toLowerCase().includes(inputParac.toLowerCase())
    );
    useEffect(() => {
        fetchParaclinical();
        const handleClickOutside = (event) => {
            if (
                paraclinicalContainerRef.current &&
                !paraclinicalContainerRef.current.contains(event.target)
            ) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectParaclinical = (paraclinical) => {
        // Kiểm tra xem paraclinical đã tồn tại trong danh sách chưa
        if (selectedParaclinicals.some(item => item.id === paraclinical.id)) {
            setShakeId(paraclinical.id);
            setTimeout(() => setShakeId(null), 1000);
            return;
        }

        const isDuplicate = paracDetails.some(detail =>
            detail.paraclinical === paraclinical.id
        );

        if (isDuplicate) {
            message.warning('Xét nghiệm đã tồn tại trong danh sách!');
            return;
        }

        setSelectedParaclinicals((prevSelected) => [
            ...prevSelected,
            paraclinical
        ]);
        setInputParac('');
        setShowSearchResults(false);
    };

    const handleRemoveParaclinical = (id) => {
        setSelectedParaclinicals(selectedParaclinicals.filter(item => item.id !== id));
    };

    return (
        <>
            <div className="parac-container">
                <div className='exam-info mt-4'>
                    <div
                        ref={paraclinicalContainerRef}
                        className='paraclinicals-action'
                    >
                        <div className='paraclinicals-list'>
                            {selectedParaclinicals.map(comorbidity => (
                                <div
                                    key={comorbidity.id}
                                    className={`paraclinicals-item mb-2 ${shakeId === comorbidity.id ? 'shake' : ''}`}
                                >
                                    <p>{comorbidity.label}</p>
                                    <i
                                        className="fa-solid me-2 fa-times"
                                        onClick={() => handleRemoveParaclinical(comorbidity.id)}
                                    ></i>
                                </div>
                            ))}
                        </div>
                        {/* Input tìm kiếm bệnh đi kèm */}
                        <input
                            ref={inputref}
                            className='input-add-prac'
                            type='text'
                            placeholder='Thêm yêu cầu cận lâm sàng...'
                            style={{ background: '#eeeeee', border: 'none', boxShadow: 'none' }}
                            value={inputParac}
                            onChange={handleInputChange}
                            readOnly={!isEditMode} 
                            onFocus={() => setShowSearchResults(true)}
                        />
                        {/* Hiển thị danh sách bệnh đi kèm khi có kết quả tìm kiếm */}
                        {showSearchResults && inputParac && (
                            <div
                                ref={searchResultsRef}
                                className='search-results'
                            >
                                {filteredParaclinicals.map(paraclinical => (
                                    <div
                                        key={paraclinical.id}
                                        className='search-item'
                                        onClick={() => handleSelectParaclinical(paraclinical)}
                                    >
                                        {paraclinical.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className='col-12'>
                        <button className={`add-button ${!isEditMode ? "disable-button" : ""}`}
                            disabled={!isEditMode}
                            onClick={handleParacRequest}>
                            {isLoading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                    Đang xử lý...
                                </>
                            ) : 'Thêm xét nghiệm'}
                        </button>
                    </div>
                </div>
                <div className="row">
                    {sortedParacDetails.length > 0 ? (
                        sortedParacDetails.map(detail => (
                            <Paracdetail
                                key={detail.id}
                                id={detail.id}
                                paraclinicalData={detail}
                            />
                        ))
                    ) : (
                        <div className="empty-list-message">
                            <div>Phiếu xét nghiệm trống</div>
                            <hr />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

Paraclinical.propTypes = {
    listParaclinicals: PropTypes.array.isRequired,
    examinationId: PropTypes.number.isRequired,
    refresh: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
};

export default Paraclinical;