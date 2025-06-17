import { Skeleton } from 'antd';

const SkeletonService = () => {
    return (
        Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="text-start">
                <td className="p-2">
                    <Skeleton.Avatar active size="small" shape="square" />
                </td>
                <td className="px-1 py-3 text-uppercase " >
                    <Skeleton.Input active size="small" style={{ width: 40 }} />
                </td>
                <td className="text-end pe-5 py-3 price">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="text-start px-1 py-3 description">
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                </td>
                <td className="text-center px-1 py-3">
                    <Skeleton.Button active size="small" style={{ width: 80 }} />
                </td>
                <td className="px-1 py-3 d-flex justify-content-end">
                    <Skeleton.Button active size="small" style={{ width: 40 }} />
                </td>
            </tr>
        ))
    )
}
export default SkeletonService;