import { createMedicine, getAllMedicinesAdmin, getPrescriptionUsed, updateMedicine } from "@/services/adminService";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllMedicinesAdmin = () => {
    return useQuery({
        queryKey: ["medicines"],
        queryFn: () => getAllMedicinesAdmin(),
        placeholderData: keepPreviousData,
    })
};
export const useGetPrescriptionUsed = (query) => {
    return useQuery({
        queryKey: ["prescriptionUsed", query],
        queryFn: () => getPrescriptionUsed(query),
    })
}

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

