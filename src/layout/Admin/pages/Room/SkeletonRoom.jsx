import { Skeleton } from 'antd';

const SkeletonRoom = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">
                    <Skeleton.Avatar active size="small" shape="square" />
                </td>
                <td className="px-1 py-2 text-uppercase">
                    <Skeleton.Input active size="small" style={{ width: 40 }} />
                </td>
                <td className="px-1 py-2">
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                </td>
                <td className="px-1 py-2 text-center">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="px-1 py-2 text-center">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="px-1 py-2 flex justify-end">
                    <Skeleton.Button active size="small" style={{ width: 40 }} />
                </td>
            </tr>
        ))
    )
}
export default SkeletonRoom;