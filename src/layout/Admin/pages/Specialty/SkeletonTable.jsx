import { Skeleton } from 'antd';

const SkeletonTable = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index}>
                <td className="p-2">
                    <Skeleton.Avatar active size="small" shape="square" />
                </td>
                <td className="px-1 py-3">
                    <Skeleton.Input active size="small" style={{ width: 40 }} />
                </td>
                <td className="text-start px-1 py-3">
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                </td>
                <td className="text-center px-1 py-3">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="px-1 py-3 d-flex justify-content-end">
                    <Skeleton.Button active size="small" style={{ width: 40 }} />
                </td>
            </tr>
        )
        ))
}
export default SkeletonTable;