"use client"
import { formatCurrency } from "@/utils/formatCurrency"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/constant/path"
import { Star, User, Briefcase, ArrowRight } from "lucide-react"

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()

  // Fallback values
  const firstName = doctor?.staffUserData?.firstName || ""
  const lastName = doctor?.staffUserData?.lastName || ""
  const fullName = `${lastName} ${firstName}`.trim()
  const position = doctor?.position || "Bác sĩ"
  const specialty = doctor?.staffDepartmentData?.name || "Đa khoa"
  const price = doctor?.price || 80000
  const examCount = doctor?.examinationStaffData?.length || 0
  const avatar = doctor?.staffUserData?.avatar || "/placeholder.svg?height=300&width=300"
  const rating = 5 // Default rating

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col w-[270px]
    shadow-card-doctor">
      {/* Doctor image with position badge */}
      <div className="relative h-64">
        <div className="absolute top-4 left-0 z-10">
          <div className="bg-primary-tw text-white px-4 py-1.5 rounded-r-full text-sm font-medium">{position}</div>
        </div>
        <img src={avatar || "/placeholder.svg"} alt={fullName} className="w-full h-full object-cover" />

        {/* Doctor name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-white text-xl font-semibold">{fullName}</h3>
        </div>
      </div>

      {/* Rating and examination count */}
      <div className="px-4 py-2 flex flex-wrap sm:justify-between sm:items-center gap-2 ">

        <div className="flex items-center text-secondaryText-tw">
          <User className="h-4 w-4 mr-1" />
          <span><b>{examCount}</b> lượt khám</span>
        </div>

        <div className="flex items-center text-yellow-500">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="ml-1 font-medium">{rating}</span>
        </div>
      </div>

      {/* Specialty */}
      <div className="px-4 py-2 flex items-center text-secondaryText-tw">
        <Briefcase className="h-5 w-5 mr-2" />
        <span>{specialty}</span>
      </div>

      {/* Price */}
      <div className="px-4 py-2">
        <div className="text-gray-600 text-sm">Giá khám:</div>
        <div className="text-blue-500 font-bold text-lg">{formatCurrency(price)}</div>
      </div>

      {/* View details button */}
      <div className="mt-auto p-4 pt-2">
        <button
          onClick={() => navigate(`${PATHS.HOME.DOCTOR_DETAIL}/${doctor?.staffUserData?.id}`)}
          className="w-full bg-primary-tw hover:bg-primary-tw/80 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          Xem chi tiết
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  )
}

export default DoctorCard
