


import React, { useEffect, useRef, useState } from 'react'
import ParseHtml from '@/components/ParseHtml';
import HandbookCardHorizontal from '@/components/HandbookItem/HandbookCard/HandbookCardHorizontal';

const DoctorDetailBody = (props) => {
    let { data, handbook } = props;
    const [showMore, setShowMore] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            setIsOverflowing(contentRef.current.scrollHeight > 500); // Kiểm tra vượt max-height không
        }
    }, [data]);

    useEffect(() => {
        if (!showMore) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [showMore]);
    return (
        <div className={'doctor-body'} >
            <div className="flex gap-6" >
                <div className="flex flex-col gap-6 w-full sm:w-1/2 lg:w-[60%]">
                    <div className="p-8 bg-white rounded-2xl shadow-card-doctor leading-[1.8] min-h-[300px] text-justify">
                        <h3 className="text-2xl font-bold mb-2">Giới thiệu</h3>
                        <p>{data?.staffUserData?.shortDescription}</p>
                    </div>
                    {/* Phần nội dung chi tiết */}
                    <div className={`p-8 bg-white rounded-2xl shadow-card-doctor leading-[1.8] text-justify overflow-hidden transition-all duration-500
                     ${showMore ? "" : "max-h-[550px]"}`}>
                        <div className={`${showMore ? "" : "h-[95%] overflow-hidden text-ellipsis"} mb-2`} ref={contentRef}>
                            <ParseHtml htmlString={data?.staffUserData?.htmlDescription || ""} />
                        </div>
                        {isOverflowing && (
                            <div className="text-primary-tw text-end mt-1 cursor-pointer font-semibold"
                                onClick={() => setShowMore(!showMore)}>
                                {showMore ? "Ẩn bớt" : "Xem thêm"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden sm:block w-full sm:w-1/2 lg:w-[40%] bg-white rounded-2xl shadow-card-doctor h-fit" >
                    <div className="mb-[20px] text-2xl font-bold text-primary-tw px-6 pt-8" >Bài viết Liên quan</div>
                    <div className="overflow-y-auto overflow-x-hidden max-h-[800px] px-6" >
                        {handbook?.length > 0 && handbook.map((item, index) => (
                            <HandbookCardHorizontal key={index} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorDetailBody