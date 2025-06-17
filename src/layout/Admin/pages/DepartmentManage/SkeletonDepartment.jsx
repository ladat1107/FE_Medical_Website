import { Skeleton } from "antd";

const SkeletonDepartment = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="text-start">
                <td className="p-2">
                    <Skeleton.Avatar active size="small" shape="square" />
                </td>
                <td className="text-start px-1 py-2 name">
                    <Skeleton.Input active style={{ width: 150 }} />
                </td>
                <td className="px-1 py-2 ps-1">
                    <Skeleton.Input active style={{ width: 100 }} />
                    <Skeleton.Input active style={{ width: 150 }} />
                </td>
                <td className="text-center px-1 py-2">
                    <Skeleton.Input active style={{ width: 100 }} />
                </td>
                <td className="text-start px-1 py-2">
                    <Skeleton.Input active style={{ width: 150 }} />
                </td>
                <td className="text-start px-1 py-2 d-none d-lg-table-cell">
                    <Skeleton.Input active style={{ width: 150 }} />
                </td>
                <td className="text-center px-1 py-2 d-none d-lg-table-cell">
                    <Skeleton.Button active />
                </td>
                <td className="px-1 py-2">
                    <Skeleton circle width={24} height={24} />
                </td>
            </tr>
        ))
    )
}
export default SkeletonDepartment;