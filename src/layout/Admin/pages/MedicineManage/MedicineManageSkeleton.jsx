import { Skeleton } from "antd";

const MedicineManageSkeleton = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-200 py-2 px-4 w-full">
                <Skeleton paragraph={{ rows: 1 }} active size={50} shape="default" className="w-full py-2 px-4" />
            </tr>
        ))
    )
}

export default MedicineManageSkeleton;
