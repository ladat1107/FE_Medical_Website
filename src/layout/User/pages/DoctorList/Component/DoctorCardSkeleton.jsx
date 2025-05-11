import { Skeleton } from 'antd';

const DoctorCardSkeleton = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[450px] w-[270px] rounded-2xl shadow-md overflow-hidden transition-all duration-300 bg-white">
            {/* Avatar Skeleton */}
            <Skeleton.Avatar
                active
                shape="circle"
                size={170}
                className="m-4"
                style={{ width: 170, height: 170 }}
            />

            {/* Name */}
            <Skeleton.Input
                active
                size="small"
                style={{ width: '60%', height: 20, marginBottom: 12 }}
            />

            {/* Info container */}
            <div className="pt-3 px-3 pb-2 w-[80%] space-y-2">
                {/* Specialty */}
                <Skeleton.Input
                    active
                    size="small"
                    style={{ width: '100%', height: 18 }}
                />

                {/* Price */}
                <Skeleton.Input
                    active
                    size="small"
                    style={{ width: '100%', height: 18 }}
                />

                {/* Visits */}
                <Skeleton.Input
                    active
                    size="small"
                    style={{ width: '100%', height: 18 }}
                />

                {/* Rating */}
                <Skeleton.Input
                    active
                    size="small"
                    style={{ width: '100%', height: 18 }}
                />
            </div>

            {/* Button */}
            <Skeleton.Button
                active
                shape="round"
                style={{ width: '200%', height: 40, borderRadius: 8, marginTop: 12 }}
            />
        </div>
    );
};

export default DoctorCardSkeleton;
