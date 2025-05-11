import { Skeleton } from 'antd';

const SkeletonRoom = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="text-start">
                <td className="p-2">
                    <Skeleton.Avatar active size="small" shape="square" />
                </td>
                <td className="text-start px-1 py-2 text-uppercase">
                    <Skeleton.Input active size="small" style={{ width: 40 }} />
                </td>
                <td className="text-start px-1 py-2">
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                </td>
                <td className="text-center px-1 py-2">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="text-center ps-5 py-2">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="px-1 py-2 d-flex justify-content-end">
                    <Skeleton.Button active size="small" style={{ width: 40 }} />
                </td>
            </tr>
        ))
    )
}
export default SkeletonRoom;