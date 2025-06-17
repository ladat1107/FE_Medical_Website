import { useQuery } from "@tanstack/react-query";
import userService from "../services/userService";

export const useGetUserByQRCode = (query) => {
    return useQuery({
        queryKey: ["getUserByQRCode", query],
        queryFn: () => userService.getUserByQRCode(query),
        enabled: query?.qrCode !== "",
    });
};