
export const PATHS = {
    ADMIN: {
        DASHBOARD: "/admin",
        PATIENT_MANAGE: "/adminPatientManage",
        STAFF_MANAGE: "/adminStaffManage",
        DEPARTMENT_MANAGE: "/adminDepartmentManage",
        ROOM_MANAGE: "/adminRoomManage",
        SERVICE_MANAGE: "/adminServiceManage",
        PROFILE: "/staffProfile",
        SPECIALTY_MANAGE: "/adminSpecialty",
        HANDBOOK_MANAGE: "/adminHandbook",
        HANDBOOK_DETAIL: "/adminHandbookDetail",
        SCHEDULE_MANAGE: "/adminSchedule",
        //EXAMINATION_MANAGE: "/adminExamination",
    },
    STAFF: {
        DASHBOARD: "/doctor",
        APPOINTMENT: "/doctorAppointment",
        PARACLINICAL: "/doctorParaclinical",
        EXAMINATION: "/doctorExamination/:examId",
        HANDBOOK: "/doctorHandbook",
        SCHEDULE: "/doctorSchedule",
        PROFILE: "/doctorProfile",
    },
    RECEPTIONIST: {
        DASHBOARD: "/receptionist",
        CASHIER: "/cashier",
        PRESCRIBE: "/prescribe",
    },
    HOME: {
        HOMEPAGE: "/",
        DOCTOR_DETAIL: "/doctor-detail",
        DOCTOR_LIST: "/doctor-list",
        HANDBOOK_LIST: "/handbookList",
        HANDBOOK_DETAIL: "/handbookDetail",
        APPOINTMENT_LIST: "/appointmentList",
        EXAMINATION_LIST: "/examinationList",
        DEPARTMENT_LIST: "/departmentList",
        DEPARTMENT_DETAIL: "/departmentDetail",
        SPECIALTY_DETAIL: "/specialtyDetail",
        PROFILE: "/user-profile",
        BOOKING: "/make-appointment",
        INSTRUCTION: "/instruction",
        LOGIN: "/login",
    }
}