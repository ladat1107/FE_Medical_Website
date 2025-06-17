
import { useGetAllMedicinesAdmin } from "@/hooks";
import { SquareMenu } from "lucide-react";
import MedicineStatistical from "./MedicineStatistical";


const MedicineManage = () => {
    const { data: medicineData, refetch, isRefetching: isRefetchingMedicineData, isLoading: isLoadingMedicineData } = useGetAllMedicinesAdmin();
    return (
        <>
            <div className="bg-bgAdmin p-4">
                <div className="flex items-center gap-2">
                    <SquareMenu className="text-secondaryText-tw" />
                    <span className="text-secondaryText-tw text-[18px] uppercase">Quản lý thuốc</span>
                </div>

                <MedicineStatistical medicineData={medicineData} refetch={refetch} isRefetchingMedicineData={isRefetchingMedicineData} isLoadingMedicineData={isLoadingMedicineData} />

            </div>
        </>
    )
}

export default MedicineManage;


