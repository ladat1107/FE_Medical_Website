import { Skeleton } from "antd";

const NotificationSkeleton = () => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-table-admin h-[600px] mt-5">
            <div className="flex">
                <Skeleton active paragraph={{ rows: 1 }} className="w-full h-[50px] rounded-lg" />
                <Skeleton active paragraph={{ rows: 1 }} className="w-full h-[50px] rounded-lg" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex justify-between items-center h-[70px] !border-blue-100 border-1 w-full bg-slate-50 rounded-lg mt-1 px-4 shadow-table-admin">
                            <div className="flex flex-col gap-2 h-[50px]">
                                <Skeleton.Input active className="w-full !h-[20px]" />
                                <Skeleton.Input active className="w-full !h-[20px]" />
                            </div>
                            <div className="flex flex-col gap-2 h-[50px] pr-24">
                                <Skeleton.Input active className="w-full !h-[20px]" />
                                <Skeleton.Input active className="w-full !h-[20px]" />
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}
export default NotificationSkeleton;
