import { useEffect } from "react";
import BookingDoctor from "./BookingDoctor";
import BookingSpecialty from "./BookingSpecialty";
import BookingCalendar from "./BookingCalendar";
import BookingPersonal from "./BookingPersonal";
import BookingConfirm from "./BookingConfirm";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constant/path";
import { useDispatch, useSelector } from "react-redux";
import { setSpecialty, setDoctor, setSchedule, setProfile, setCurrentContent } from "@/redux/bookingSlice";
import { BOOKING_CONTENT } from "@/constant/value";


const BookingContent = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let { specialty, doctor, schedule, profile, currentContent } = useSelector(state => state.booking);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentContent]);

    useEffect(() => {
        if (doctor) {
            dispatch(setSpecialty(doctor?.staffSpecialtyData || null));
        }
    }, [doctor])

    let handleStepSpecialty = (specialty) => {
        dispatch(setSpecialty(specialty));
        dispatch(setCurrentContent(BOOKING_CONTENT.DOCTOR));
    }

    let handleStepDoctor = (value) => {
        dispatch(setDoctor(value));
        dispatch(setCurrentContent(BOOKING_CONTENT.SCHEDULE));
    }

    let handleStepSchedule = (value) => {
        dispatch(setSchedule(value));
        dispatch(setCurrentContent(BOOKING_CONTENT.INFORMATION));
    }

    let handleStepInformation = (value) => {
        dispatch(setProfile(value));
        dispatch(setCurrentContent(BOOKING_CONTENT.CONFIRM));
    }

    let handleStepConfirm = async () => {
    }

    return (
        <div>
            <div className="bg-white rounded-lg w-full shadow-md">
                {currentContent === BOOKING_CONTENT.SPECIALTY && <BookingSpecialty
                    next={handleStepSpecialty}
                    back={() => { navigate(PATHS.HOME.HOMEPAGE) }} />}
                {currentContent === BOOKING_CONTENT.DOCTOR && <BookingDoctor
                    specialtyId={specialty?.id}
                    next={handleStepDoctor}
                    back={() => { dispatch(setCurrentContent(BOOKING_CONTENT.SPECIALTY)), dispatch(setSpecialty(null)) }} />}
                {currentContent === BOOKING_CONTENT.SCHEDULE && <BookingCalendar
                    doctor={doctor}
                    next={handleStepSchedule}
                    back={() => { dispatch(setCurrentContent(BOOKING_CONTENT.DOCTOR)), dispatch(setDoctor(null)) }} />}
                {currentContent === BOOKING_CONTENT.INFORMATION && <BookingPersonal
                    schedule={schedule}
                    profile={profile}
                    next={handleStepInformation}
                    back={() => { dispatch(setCurrentContent(BOOKING_CONTENT.SCHEDULE)), dispatch(setSchedule(null)) }}
                />}
                {currentContent === BOOKING_CONTENT.CONFIRM && <BookingConfirm
                    profile={profile}
                    doctor={doctor}
                    schedule={schedule}
                    next={handleStepConfirm}
                    back={() => { dispatch(setCurrentContent(BOOKING_CONTENT.INFORMATION)) }}
                />}
            </div>
        </div>
    );
}

export default BookingContent;