import { createMedicine, getAllMedicinesAdmin, updateMedicine } from "@/services/adminService";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllMedicinesAdmin = () => {
    return useQuery({
        queryKey: ["medicines"],
        queryFn: () => getAllMedicinesAdmin(),
        placeholderData: keepPreviousData,
    })
};

export const useCreateMedicine = () => {
    return useMutation({
        mutationFn: (data) => createMedicine(data),
    })
}

export const useUpdateMedicine = () => {
    return useMutation({
        mutationFn: (data) => updateMedicine(data),
    })
}

