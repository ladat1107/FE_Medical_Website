import { Modal, Button, Table, message, Input, DatePicker, InputNumber, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { useCreateMedicine } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

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

const MedicineInsertModal = ({ open, onClose, initialRows = [] }) => {
    const [dataSource, setDataSource] = useState([]);
    const client = useQueryClient();
    const { mutate: createMedicine, isPending } = useCreateMedicine();
    const [errorText, setErrorText] = useState('');
    const [form] = Form.useForm();
    const isMobile = useMobile();

    // Reset form khi đóng modal
    useEffect(() => {
        if (!open) {
            form.resetFields();
            setDataSource([]);
        }
    }, [open, form]);

    // Cập nhật dataSource khi initialRows thay đổi
    useEffect(() => {
        if (initialRows && initialRows.length > 0) {
            console.log("Nhận initialRows:", initialRows);

            // Đảm bảo các trường ngày tháng là đối tượng dayjs
            const formattedRows = initialRows.map(row => ({
                ...row,
                id: row.id || Date.now() + Math.random()
            }));

            form.setFieldsValue({ rows: formattedRows });
            setDataSource(formattedRows);
        }
    }, [initialRows, form]);

    const inputCell = (index, field, type = 'text') => {
        if (type === 'number' && field === 'insuranceCovered') {
            return (
                <Form.Item name={['rows', index, field]} noStyle rules={[{
                    validator(rule, value, callback) {
                        if (value < 0 || value > 1 || !value) {
                            callback('Giá trị phải nằm trong khoảng từ 0 đến 1');
                        }
                        callback();
                    }
                }]}>
                    <InputNumber
                        min={0}
                        max={1}
                        step={0.01}
                        style={{ width: '100%' }}
                        className='border-none focus:border-none focus:ring-0 outline-none shadow-none'
                        placeholder={`${field}`}
                    />
                </Form.Item>
            );
        }
        if (type === 'number') {
            return (
                <Form.Item name={['rows', index, field]} noStyle rules={[{
                    validator(rule, value, callback) {
                        if (value < 0 || !value) {
                            callback('Giá trị không hợp lệ');
                        }
                        callback();
                    }
                }]}>
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        className='border-none focus:border-none focus:ring-0 outline-none shadow-none'
                        placeholder={`${field}`}
                    />
                </Form.Item>
            );
        }
        if (type === 'date') {
            return (
                <Form.Item name={['rows', index, field]} noStyle rules={[{
                    validator(rule, value, callback) {
                        if (!value) {
                            callback('Giá trị không hợp lệ');
                        }
                        callback();
                    }
                }]}>
                    <DatePicker
                        className='border-none focus:border-none focus:ring-0 outline-none shadow-none'
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder={`DD/MM/YYYY`}
                    />
                </Form.Item>
            );
        }

        return (
            <Form.Item name={['rows', index, field]} noStyle rules={[{
                validator(rule, value, callback) {
                    if (!value) {
                        callback('Giá trị không hợp lệ');
                    }
                    callback();
                }
            }]}>
                <Input
                    className='border-none focus:border-none focus:ring-0 outline-none shadow-none '
                    placeholder={`${field}`}
                />
            </Form.Item>
        );
    };

    const columns = [
        {
            title: '',
            dataIndex: 'actions',
            width: 30,
            render: (_, __, index) => (
                <Button size={18} className='text-red-500 border-none ' onClick={() => handleDeleteRow(index)} icon={<DeleteOutlined />}></Button>
            ),
        },
        { title: 'Số ĐK', dataIndex: 'registrationNumber', width: 140, render: (_, r, i) => inputCell(i, 'registrationNumber') },
        { title: 'Tên thuốc', dataIndex: 'name', width: 180, render: (_, r, i) => inputCell(i, 'name') },
        { title: 'Số lô', dataIndex: 'batchNumber', width: 130, render: (_, r, i) => inputCell(i, 'batchNumber') },
        { title: 'Hoạt chất', dataIndex: 'activeIngredient', width: 150, render: (_, r, i) => inputCell(i, 'activeIngredient') },
        { title: 'Hàm lượng', dataIndex: 'concentration', width: 100, render: (_, r, i) => inputCell(i, 'concentration') },
        { title: 'Đơn vị', dataIndex: 'unit', width: 80, render: (_, r, i) => inputCell(i, 'unit') },
        { title: 'Dạng bào chế', dataIndex: 'dosageForm', width: 120, render: (_, r, i) => inputCell(i, 'dosageForm') },
        { title: 'NSX', dataIndex: 'mfg', width: 160, render: (_, r, i) => inputCell(i, 'mfg', 'date') },
        { title: 'HSD', dataIndex: 'exp', width: 160, render: (_, r, i) => inputCell(i, 'exp', 'date') },
        { title: 'Giá', dataIndex: 'price', width: 100, render: (_, r, i) => inputCell(i, 'price', 'number') },
        { title: 'Tồn kho', dataIndex: 'inventory', width: 100, render: (_, r, i) => inputCell(i, 'inventory', 'number') },
        { title: 'Số phê duyệt', dataIndex: 'approvalNumber', width: 130, render: (_, r, i) => inputCell(i, 'approvalNumber') },
        { title: 'Ngày phê duyệt', dataIndex: 'approvalDate', width: 160, render: (_, r, i) => inputCell(i, 'approvalDate', 'date') },
        { title: 'Nước SX', dataIndex: 'manufacturerCountry', width: 130, render: (_, r, i) => inputCell(i, 'manufacturerCountry') },
        { title: 'Mô tả', dataIndex: 'description', width: 200, render: (_, r, i) => inputCell(i, 'description') },
        { title: 'Nhóm', dataIndex: 'group', width: 130, render: (_, r, i) => inputCell(i, 'group') },
        { title: 'BHYT chi trả (%)', dataIndex: 'insuranceCovered', width: 120, render: (_, r, i) => inputCell(i, 'insuranceCovered', 'number') },
    ];

    const handleAddRow = () => {
        const current = form.getFieldValue('rows') || [];
        const newRow = { ...defaultRow, id: Date.now() };
        form.setFieldsValue({ rows: [...current, newRow] });
        setDataSource([...current, newRow]); // Ensure dataSource is updated to trigger re-render
    };

    const handleSave = () => {
        setErrorText('');
        form.validateFields().then((values) => {
            const rows = values.rows || [];
            const uniquePairs = new Set();
            let hasDuplicate = false;

            rows.forEach(row => {
                const pair = `${row.registrationNumber}-${row.batchNumber}`;
                if (uniquePairs.has(pair)) {
                    hasDuplicate = `Số lô ${row.batchNumber} của thuốc ${row.name} trùng nhau`;
                } else {
                    uniquePairs.add(pair);
                }
                row.status = 1;
                row.isCovered = row.insuranceCovered ? 1 : 0;
            });

            if (hasDuplicate) {
                message.error(hasDuplicate);
                return;
            }
            createMedicine(values.rows, {
                onSuccess: (data) => {
                    if (data.EC === 0) {
                        message.success(data.EM);
                        client.invalidateQueries({ queryKey: ['medicines'] });
                        form.resetFields();
                        setDataSource([]);
                        setErrorText('');
                        onClose();
                    } else if (data.EC === 1) {
                        setErrorText(data.DT);
                    } else {
                        message.error(data.EM);
                    }
                },
            });
        }).catch((errorInfo) => {
            const { errorFields } = errorInfo;
            if (errorFields.length > 0) {
                form.scrollToField(errorFields[0].name);
            }
            message.error('Dữ liệu không hợp lệ');
        });
    };

    const handleDeleteRow = (index) => {
        const current = form.getFieldValue('rows') || [];
        const row = current[index];
        const hasData = Object.values(row).some(value => value !== null && value !== '');

        if (hasData) {
            Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Dữ liệu hiện tại sẽ không thể khôi phục. Bạn có chắc chắn muốn xóa không?',
                onOk: () => {
                    const newRows = current.filter((_, i) => i !== index);
                    form.setFieldsValue({ rows: newRows });
                    setDataSource(newRows);
                },
            });
        } else {
            const newRows = current.filter((_, i) => i !== index);
            form.setFieldsValue({ rows: newRows });
            setDataSource(newRows); // Update dataSource to trigger re-render
        }
    };

    return (
        <Modal
            title="Thêm thuốc mới"
            open={open}
            onCancel={onClose}
            width={isMobile ? '100%' : "95%"}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button loading={isPending} key="submit" type="primary" onClick={handleSave}>
                    {isPending ? 'Đang xử lý...' : 'Lưu'}
                </Button>,
            ]}
        >
            <Form form={form} initialValues={{ rows: initialRows.length > 0 ? initialRows : [] }}>
                <div className='p-3'>
                    <div className="flex items-center gap-2 mb-4 ">
                        <Button icon={<PlusOutlined />} onClick={handleAddRow}>
                            Thêm dòng
                        </Button>
                    </div>

                    {errorText && <div className="text-red-500 mb-2">{errorText}</div>}

                    <div className="min-h-[300px] overflow-auto
                [&_.ant-table-cell]:border [&_.ant-table-cell]:border-gray-400
                [&_.ant-table-thead>tr>th]:!bg-blue-100 [&_.ant-table-thead>tr>th]:text-black [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-center" >

                        <Table
                            bordered
                            scroll={{ x: 'max-content' }}
                            size="small"
                            rowKey="id"
                            pagination={false}
                            columns={columns}
                            dataSource={dataSource}
                        />
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default MedicineInsertModal;
