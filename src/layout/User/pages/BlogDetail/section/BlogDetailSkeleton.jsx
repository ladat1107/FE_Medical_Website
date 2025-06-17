import { Skeleton } from "antd";

const BlogDetailSkeleton = () => {
    return (
        <div className="w-full">
            {/* Banner đầu trang */}
            <div className="py-4">
                <div className="w-full h-[200px] md:h-[250px] rounded-xl bg-primary-tw/10">
                </div>
            </div>

            {/* Nội dung và ảnh bên phải */}
            <div className="mt-10 flex flex-col md:flex-row gap-6 items-start relative">
                {/* Nội dung */}
                <div className="flex-1 space-y-4">
                    <Skeleton.Input active size="large" className="!h-8 !w-[80%]" />
                    <Skeleton paragraph={{ rows: 1, width: '60%' }} active />
                    <Skeleton paragraph={{ rows: 1, width: '90%' }} active />

                    <div className=" py-2 rounded-tr-lg rounded-br-lg bg-cyan-50">
                        <Skeleton paragraph={{ rows: 2 }} active />
                    </div>

                    <Skeleton paragraph={{ rows: 6 }} active />
                    <Skeleton paragraph={{ rows: 4 }} active />
                    <Skeleton paragraph={{ rows: 2, width: '80%' }} active />

                    <div className="text-center">
                        <Skeleton.Button active shape="round" />
                    </div>
                </div>

                {/* Ảnh bên phải - chỉ hiển thị khi màn hình >= md */}
                <div className="hidden md:block w-[230px] sticky top-10 self-start">
                    <div className="w-full h-[300px] rounded-xl bg-primary-tw/10">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailSkeleton;
