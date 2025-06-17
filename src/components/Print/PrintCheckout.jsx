import dayjs from 'dayjs';
import './PrintPrescription/PrintPrescription.scss';
import { useSelector } from 'react-redux';
import { formatCurrency } from '@/utils/formatCurrency';
import { useEffect } from 'react';

const PrintCheckout = () => {
    const { patientData, staffData, tableData, examId } = useSelector(state => state.printCheckout.data);
    useEffect(() => {
        window.print();
    }, []);
    return (
        <div className="print-checkout w-full max-w-[148mm] mx-auto bg-white p-4 text-black text-sm leading-tight print:shadow-none shadow-lg">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-400">
                        <div className="text-xs font-bold text-center">
                            <div>BVHS</div>
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="font-bold">SỞ Y TẾ TP.HCM</div>
                        <div className="font-bold">BỆNH VIỆN ĐA KHOA HOA SEN</div>
                        <div className="text-xs mt-1">
                            Cơ sở 215 Hồng Bàng, Phường 11, Quận 5, TP.HCM
                            <br />
                            Điện thoại: 0353366459
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <svg className="w-24 h-8" viewBox="0 0 200 50">
                            {/* Barcode representation */}
                            {[...Array(30)].map((_, i) => (
                                <rect key={i} x={i * 6} y="0" width={Math.random() > 0.5 ? "2" : "4"} height="40" fill="black" />
                            ))}
                        </svg>
                    </div>
                    <div className="text-xs">
                        <div>Đơn khám: {examId || ''}</div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-center text-xl font-bold mb-4">PHIẾU THANH TOÁN</h1>

            {/* Patient Info Section */}
            <div className="mb-4">
                <div className="flex w-full gap-4 mb-2">
                    <div className="w-[50%]">
                        <span>Họ tên: </span>
                        <span className="font-bold">{patientData?.name || ''}</span>
                    </div>
                    <div className="w-[30%]">
                        <span>Ngày sinh: </span>
                        <span className="font-bold">{patientData?.dob ? dayjs(patientData?.dob).format('DD/MM/YYYY') : ''}</span>
                    </div>
                    <div className="w-[20%]">
                        <span>Giới tính: </span>
                        <span className="font-bold">{patientData?.gender === null ? "" : patientData?.gender === 1 ? 'Nữ' : 'Nam'}</span>
                    </div>
                </div>
                <div className="flex w-full gap-4 mb-2">
                    <div className="w-[50%]">
                        <span>CCCD: </span>
                        <span className="font-bold">{patientData?.cid || ''}</span>
                    </div>
                    <div className="w-[30%]">
                        <span>Số BHYT:</span>
                        <span className="font-bold">{patientData?.insurance || 'Chưa có'}</span>
                    </div>
                    <div className="w-[20%]">
                    </div>
                </div>

            </div>

            {/* Results Table */}
            <table className="w-full border border-gray-400 text-xs mb-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-400 p-2 text-center">Phòng</th>
                        <th className="border border-gray-400 p-2 w-[200px]">YÊU CẦU</th>
                        <th className="border border-gray-400 p-2 text-center">Bác sĩ</th>
                        <th className="border border-gray-400 p-2 text-center">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData?.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 p-2 text-center">{item?.room}</td>
                            <td className="border border-gray-400 p-2 w-[200px] whitespace-normal break-words ">{item?.service}</td>
                            <td className="border border-gray-400 p-2 text-center">{item?.doctor}</td>
                            <td className="border border-gray-400 p-2 text-center">{formatCurrency(item?.price)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>

            {/* Footer Section */}
            <div className="flex justify-end items-end mt-4">
                <div className="text-center">
                    <div className="mb-2">.... ngày .... tháng .... năm ....</div>
                    <div className="font-bold">Nhân viên thu ngân</div>
                    <div className="mt-12">{staffData || ''}</div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
        @media print {
          @page {
            size: A5;
            margin: 0mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
        </div>
    )
}

export default PrintCheckout;