export const GENDER = [
    {
        value: 0,
        label: "Nam"
    }
    ,
    {
        value: 1,
        label: "Nữ"
        ,
    }
]
export const TABLE = {
    USER: "USER",
    DEPARTMENT: "DEPARTMENT",
    SERVICE: "SERVICE",
    ROOM: "ROOM",
    SPECIALTY: "SPECIALTY",
    EXAMINATION: "EXAMINATION",
    MEDICINE: "MEDICINE"
}
export const TAGS = [
    {
        value: 1,
        label: "Sức khỏe cộng đồng"
    },
    {
        value: 2,
        label: "Phòng ngừa bệnh tật"
    },
    {
        value: 3,
        label: "Dinh dưỡng hợp lý"
    },
    {
        value: 4,
        label: "Cẩm nang y tế"
    },
    {
        value: 5,
        label: "Lời khuyên bác sĩ"
    },
    {
        value: 6,
        label: "Cập nhật y học"
    },
    {
        value: 7,
        label: "Chăm sóc sức khỏe trẻ em"
    },
    {
        value: 8,
        label: "Sức khỏe phụ nữ"
    },
    {
        value: 9,
        label: "Kiến thức bệnh lý"
    },
    {
        value: 10,
        label: "Sống khỏe mạnh"
    }
]
export const TIMESLOTS = [
    {
        value: 1,
        label: "7:00 - 7:30"
    },
    {
        value: 2,
        label: "7:30 - 8:00"
    },
    {
        value: 3,
        label: "8:00 - 8:30"
    },
    {
        value: 4,
        label: "8:30 - 9:00"
    },
    {
        value: 5,
        label: "9:00 - 9:30"
    },
    {
        value: 6,
        label: "9:30 - 10:00"
    },
    {
        value: 7,
        label: "10:00 - 10:30"
    },
    {
        value: 8,
        label: "10:30 - 11:00"
    },
    {
        value: 9,
        label: "11:00 - 11:30"
    },
    {
        value: 10,
        label: "11:30 - 12:00"
    },
    {
        value: 11,
        label: "12:00 - 12:30"
    },
    {
        value: 12,
        label: "12:30 - 13:00"
    },
    {
        value: 13,
        label: "13:00 - 13:30"
    },
    {
        value: 14,
        label: "13:30 - 14:00"
    },
    {
        value: 15,
        label: "14:00 - 14:30"
    },
    {
        value: 16,
        label: "14:30 - 15:00"
    },
    {
        value: 17,
        label: "15:00 - 15:30"
    },
    {
        value: 18,
        label: "15:30 - 16:00"
    },
    {
        value: 19,
        label: "16:00 - 16:30"
    },
    {
        value: 20,
        label: "16:30 - 17:00"
    }
]
export const POSITION = [
    {
        label: "Bác sĩ",
        value: "BS"
    },
    {
        label: "CK1",
        value: "CK1"
    },
    {
        label: "CK2",
        value: "CK2"
    },
    {
        label: "Thạc sĩ",
        value: "THS"
    },
    {
        label: "Tiến sĩ",
        value: "TS"
    },
    {
        label: "Phó giáo sư",
        value: "PGS"
    },
    {
        label: "Giáo sư",
        value: "GS"
    }
]
export const STATUS = [
    {
        label: "Hoạt động",
        value: 1
    },
    {
        label: "Khóa",
        value: 0
    }
]
export const AOB = [
    {
        label: "Chưa biết",
        value: 0
    },
    {
        label: "Nhóm máu A",
        value: 1
    },
    {
        label: "Nhóm máu B",
        value: 2
    },
    {
        label: "Nhóm máu AB",
        value: 3
    },
    {
        label: "Nhóm máu O",
        value: 4
    }
]
export const RH = [
    {
        label: "Chưa biết",
        value: 0
    },
    {
        label: "Nhóm máu RH+",
        value: 1
    },
    {
        label: "Nhóm máu RH-",
        value: 2
    },
]
export const MARITALSTATUS = [
    {
        label: "Đã kết hôn",
        value: 1
    },
    {
        label: "Độc thân",
        value: 2
    },
]
export const LINK = {
    AVATAR_NULL: "https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg",
    IMAGE_HANDBOOK: "https://medpro.vn/_next/image?url=https%3A%2F%2Fcms.medpro.com.vn%2Fuploads%2F1732334644872_df53184776.png&w=1920&q=75"
}
export const CLOUDINARY_FOLDER = {
    AVATAR: "Avatar",
    DEPARTMENT: "Department",
    HANDBOOK: "Handbook",
    PARACLINICAL: "Paraclinical",
    SPECIALTY: "Specialty",
    TEST: "Test"
}
export const EMIT = {
    EVENT_PROFILE: {
        key: "EVENT_PROFILE",
        info: "information",
        changePassword: "changePassword",
        staff: "staff",
        insurance: "insurance",
        notifications: "notifications"
    }
}
export const STATUS_HOSPITAL = {
    ACTIVE: {
        value: 1,
        label: "Hoạt động"
    },
    INACTIVE: {
        value: 0,
        label: "Khóa"
    },
    PENDING: {
        value: 2,
        label: "Chờ duyệt"
    },
    REJECT: {
        value: 3,
        label: "Không duyệt"
    }
}
export const SPECIAL_EXAMINATION = {
    NORMAL: {
        value: "normal",
        label: "Không thuộc dạng ưu tiên",
        // description: ""
    },
    OLD: {
        value: "old",
        label: "Người già",
        description: "Trên 75 tuổi",
    },
    CHILD: {
        value: "children",
        label: "Trẻ em",
        description: "Dưới 6 tuổi",
    },
    PREGNANT: {
        value: "pregnant",
        label: "Phụ nữ mang thai",
        // description: "Đang mang thai",
    },
    DISABLED: {
        value: "disabled",
        label: "Người khuyết tật",
        // description: "Người khuyết tật",
    }
}

export const STATUS_BE = {
    DONE_INPATIENT: 8,
    DONE: 7, // đã khám xong
    EXAMINING: 6, // đang khám
    PAID: 5, // đã thanh toán chờ để khám
    WAITING: 4, // chờ thanh toán
    REJECT: 3, // không duyệt
    PENDING: 2, // chờ duyệt << sẽ để thêm ở exam để nhân viên tiếp nhận lấy ra --> nhân viên tiếp nhận ok thì chuyển lên 4
    ACTIVE: 1,
    INACTIVE: 0
}

export const PAYMENT_METHOD = {
    MOMO: 1,
    VN_PAY: 2,
    CASH: 3
}

export const TYPE_NUMBER = {
    PRIORITY: "priorityNumber",
    NORMAL: "normalNumber",
}

export const COVERED = {
    1: 1,
    2: 0.95,
    3: 0.8,
    4: 1
}

export const STATUS_MESSAGE = {
    FAILED: "failed",
    SENDING: "sending",
    SENT: "sent",
    RECEIVED: "received",
    READ: "read"
}

export const MEDICAL_TREATMENT_TIER = {
    INPATIENT: 1,
    OUTPATIENT: 2,
    EMERGENCY: 3
}
export const PAYMENT_STATUS = {
    UNPAID: 0,
    PENDING: 1,
    PAID: 2
}

