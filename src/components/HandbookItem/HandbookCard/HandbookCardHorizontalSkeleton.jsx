import { Skeleton } from "antd"
const HandbookCardHorizontalSkeleton = ({ index }) => {
    return (
        <div
            className="w-full flex flex-col md:flex-row gap-2 rounded-xl transition-all duration-300 p-2 mb-2 border-1 
            border-gray-200 hover:!border-primary-tw  hover:shadow-md"
            key={index} >
            <div className="w-full md:w-1/3 h-[110px]" >
                <Skeleton.Node active className="w-full h-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-2/3" >
                <Skeleton active className="w-full h-full rounded-xl" />
            </div>
        </div>
    )
}

export default HandbookCardHorizontalSkeleton
