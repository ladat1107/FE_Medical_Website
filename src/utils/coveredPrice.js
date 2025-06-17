import { COVERED } from "@/constant/value";

export const insuranceCovered = (price, coveredLevel) => {

    const numericPrice = Number(price);
    if (!numericPrice || isNaN(numericPrice)) return 0;
    if (!coveredLevel) return 0;

    const covered = COVERED[coveredLevel];

    if (covered !== undefined && covered !== null) {
        return numericPrice * covered;
    }
    
    return 0;
}

export const medicineCovered = (
    price,
    coveredLevel = 0,
    insuranceCovered = 0,
    isWrongTreatment = 0,
    medicalTreatmentTier = 2
) => {
    const numericPrice = Number(price);
    if (!numericPrice || isNaN(numericPrice)) return 0;

    if (!coveredLevel || !insuranceCovered) return 0;

    const H = COVERED[coveredLevel]; // Mức hưởng BHYT
    const T = insuranceCovered;      // Tỷ lệ thanh toán thuốc

    // Xác định R: hệ số đúng tuyến
    let R = 1;
    if (isWrongTreatment === 1 && medicalTreatmentTier === 2) {
        R = 0; // ngoại trú trái tuyến => không thanh toán
    }

    const coveredAmount = numericPrice * (1 - T * (1 - H * R));
    return coveredAmount;
}
