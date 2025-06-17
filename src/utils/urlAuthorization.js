import { PATHS } from "@/constant/path";
import { ROLE } from "@/constant/role";


export const urlAuthorization = (role) => {
    if (role === ROLE.ADMIN) {
        return PATHS.ADMIN.DASHBOARD;
    } else if (role === ROLE.PATIENT) {
        return PATHS.HOME.HOMEPAGE;
    } else if (role === ROLE.DOCTOR) {
        return PATHS.STAFF.APPOINTMENT;
    } else if (role === ROLE.RECEPTIONIST) {
        return PATHS.RECEPTIONIST.DASHBOARD;
    } else if (role === ROLE.PHARMACIST) {
        return PATHS.RECEPTIONIST.PRESCRIBE;
    } else if (role === ROLE.ACCOUNTANT) {
        return PATHS.RECEPTIONIST.CASHIER;
    } else if (role === ROLE.NURSE) {
        return PATHS.STAFF.APPOINTMENT;
    }
}