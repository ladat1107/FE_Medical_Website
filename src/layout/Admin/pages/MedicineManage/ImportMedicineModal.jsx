import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { useMobile } from '@/hooks/useMobile';
import dayjs from 'dayjs';

const defaultRow = {
    name: '',
    registrationNumber: '',
    concentration: '',
    mfg: null,
    exp: null,
    price: null,
    inventory: null,
    unit: '',
    approvalNumber: '',
    approvalDate: null,
    dosageForm: '',
    manufacturerCountry: '',
    description: '',
    activeIngredient: '',
    group: '',
    insuranceCovered: null,
    batchNumber: '',
};

const ImportMedicineModal = ({ open, onClose, onImportSuccess }) => {
    const [importing, setImporting] = useState(false);
    const isMobile = useMobile();

    const parseDate = (dateString) => {
        if (!dateString) return null;

        if (typeof dateString === 'string') {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                return dayjs(new Date(year, month, day));
            }
        }
        return null;
    };

    const handleImport = (file) => {
        setImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wb = XLSX.read(e.target.result, { type: 'binary' });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const rawRows = XLSX.utils.sheet_to_json(sheet);

                if (rawRows.length === 0) {
                    message.error('File không có dữ liệu');
                    setImporting(false);
                    return;
                }

                // Ánh xạ tên cột từ file Excel vào trường dữ liệu
                const processedRows = rawRows.map((row, index) => {
                    const mfgDate = parseDate(row['NSX (DD/MM/YYYY)'] || row['NSX']);
                    const expDate = parseDate(row['HSD (DD/MM/YYYY)'] || row['HSD']);
                    const approvalDate = parseDate(row['Ngày phê duyệt (DD/MM/YYYY)'] || row['Ngày phê duyệt']);

                    // Map dữ liệu từ Excel vào cấu trúc đúng
                    return {
                        ...defaultRow,
                        id: Date.now() + index,
                        name: row['Tên thuốc'] || '',
                        registrationNumber: row['Số ĐK'] || '',
                        batchNumber: row['Số lô'] || '',
                        activeIngredient: row['Hoạt chất'] || '',
                        concentration: row['Hàm lượng'] || '',
                        unit: row['Đơn vị'] || '',
                        dosageForm: row['Dạng bào chế'] || '',
                        mfg: mfgDate,
                        exp: expDate,
                        price: row['Giá'] || 0,
                        inventory: row['Tồn kho'] || 0,
                        approvalNumber: row['Số phê duyệt'] || '',
                        approvalDate: approvalDate,
                        manufacturerCountry: row['Nước SX'] || '',
                        description: row['Mô tả'] || '',
                        group: row['Nhóm'] || '',
                        insuranceCovered: (row['BHYT chi trả (%)'] !== undefined) ? ((row['BHYT chi trả (%)'])) : 0,
                        status: 1
                    };
                });

                console.log('Dữ liệu đã xử lý:', processedRows);
                onImportSuccess(processedRows);
                message.success(`Đã import ${processedRows.length} thuốc thành công`);
                onClose();
            } catch (error) {
                console.error('Import error:', error);
                message.error('Có lỗi khi đọc file. Vui lòng kiểm tra lại định dạng file');
            } finally {
                setImporting(false);
            }
        };

        reader.onerror = () => {
            message.error('Không thể đọc file');
            setImporting(false);
        };

        reader.readAsBinaryString(file);
        return false;
    };

    const handleDownloadTemplate = () => {
        window.location.href = '/themes/excel/Medicine_Template.xlsx';
    };

    return (
        <Modal
            title="Nhập thuốc"
            open={open}
            onCancel={onClose}
            width={isMobile ? '100%' : "500px"}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>
            ]}
        >
            <div className="p-3">
                <p className='text-secondaryText-tw'>Nhập thuốc từ file excel.</p>
                <p className='text-secondaryText-tw'> Nếu chưa có file mẫu, vui lòng
                    <a className="text-amber-500 hover:text-amber-600" href="/themes/excel/Medicine_Template.xlsx" download> tải file mẫu
                        tại đây. </a></p>
                <div className="flex flex-col items-center justify-center gap-4 my-4">
                    <div className="border-2 border-dashed border-gray-300 p-8 w-full rounded text-center">
                        <Upload.Dragger
                            name="file"
                            accept=".xlsx,.xls"
                            showUploadList={false}
                            beforeUpload={handleImport}
                            disabled={importing}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Kéo thả file vào đây hoặc nhấn để chọn file</p>
                            <p className="ant-upload-hint">Định dạng hỗ trợ: .xls, .xlsx</p>
                        </Upload.Dragger>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImportMedicineModal;
