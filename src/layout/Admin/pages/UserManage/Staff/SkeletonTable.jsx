import { Skeleton } from 'antd';

export const SkeletonTable = () => {
    return (
        Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="bg-white border-b text-start">
                <td className="d-none d-md-table-cell">
                    <Skeleton.Avatar active size="small" />
                </td>
                <td className="px-1 py-3 min-content-width g-0">
                    <Skeleton.Avatar size="large" shape="circle" />
                    <Skeleton active paragraph={{ rows: 1 }} className="ps-2" />
                </td>
                <td className="text-start px-3 py-3">
                    <Skeleton.Input active size="small" />
                </td>
                <td className="text-start px-1 py-3 text-truncate text-nowrap">
                    <Skeleton.Input active size="small" />
                </td>
                <td className="text-start px-1 py-3">
                    <Skeleton.Input active size="small" />
                </td>
                <td className="text-start line px-1 py-3 d-none d-lg-table-cell">
                    <Skeleton.Input active size="small" />
                </td>
                <td className="text-start line px-1 py-3 d-none d-lg-table-cell">
                    <Skeleton.Input active size="small" />
                </td>
                <td className="text-start px-1 py-3 d-none d-lg-table-cell">
                    <Skeleton.Button active size="small" />
                </td>
                <td className="px-1 py-3">
                    <Skeleton.Button active size="small" />
                </td>
            </tr>
        ))
    )
}