import { Skeleton } from 'antd';

const SkeletonTable = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="bg-white border-b">
                <td>
                    <Skeleton.Avatar active size="small" shape="square" />
                </td>
                <td className="ps-2 py-3 min-content-width g-0">
                    <Skeleton.Input active style={{ width: 150 }} />
                </td>
                <td className="text-center px-2 py-3">
                    <Skeleton.Input active style={{ width: 100 }} />
                </td>
                <td className="text-center px-1 py-3">
                    <Skeleton.Input active style={{ width: 120 }} />
                </td>
                <td className="text-center px-1 py-3">
                    <Skeleton.Input active style={{ width: 100 }} />
                </td>
                <td className="text-center px-1 py-3">
                    <Skeleton.Button active />
                </td>
                <td className="px-6 py-4">
                    <Skeleton.Button active />
                </td>
            </tr>
        ))
    )
}
export default SkeletonTable;