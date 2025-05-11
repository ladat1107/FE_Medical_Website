import { useMutation } from "@/hooks/useMutation";
import { getSpecialtySelect, getUserById } from "@/services/adminService";
import { useEffect, useState } from "react";
import Information from "./section/Information";
import Password from "./section/Password";
import Notification from "./section/Notification";
import useQuery from "@/hooks/useQuery";
import StaffInfo from "./section/Staff";
import { EMIT } from "@/constant/value";
import emitter from "@/utils/eventEmitter";
import { useSelector } from "react-redux";
import userService from "@/services/userService";

const Profile = () => {
    let { user } = useSelector((state) => state.authen);
    let [profile, setProfile] = useState({});
    const [selectedItem, setSelectedItem] = useState(EMIT.EVENT_PROFILE.info);
    const [folks, setListfolks] = useState([]);
    let { data: folkdata } = useQuery(() => userService.getFolk())
    let [specialty, setSpecailty] = useState([]);
    let { data: specialtyData } = useQuery(() => getSpecialtySelect())
    let {
        data: dataProfile,
        loading: listProfileLoading,
        execute: fetchProfile,
    } = useMutation((query) =>
        getUserById(user?.id)
    )
    useEffect(() => {
        if (specialtyData && specialtyData?.DT?.length > 0) {
            setSpecailty(specialtyData.DT);
        }
    }, [specialtyData])
    useEffect(() => {
        if (folkdata) {
            let _folk = folkdata.DT?.map((item) => {
                return {
                    value: +item.id,
                    label: item.name
                }
            })
            setListfolks(_folk);
        }
    }, [folkdata])
    useEffect(() => {
        if (dataProfile && dataProfile.DT) {
            setProfile(dataProfile.DT)
        }
    }, [dataProfile])
    let handleEvent = (event) => {
        setSelectedItem(event);
    }
    useEffect(() => {
        fetchProfile();
        emitter.on(EMIT.EVENT_PROFILE.key, handleEvent);
        // Cleanup khi component unmount để tránh rò rỉ bộ nhớ
        return () => {
            emitter.removeListener(EMIT.EVENT_PROFILE.key, handleEvent);
        };

    }, []);
    let refresh = (value) => {
        dataProfile = null;
        setSelectedItem(value);
        fetchProfile();
    }
    return (
        <div className="flex justify-center items-center w-full bg-bgAdmin">
            <div className="w-full md:w-11/12 lg:w-4/5 xl:w-3/4 p-4">
                <div className="w-full">
                    {selectedItem === EMIT.EVENT_PROFILE.info && profile?.id && folks.length > 0 &&
                        <Information
                            page={EMIT.EVENT_PROFILE.info}
                            refresh={(value) => refresh(value)}
                            folks={folks}
                            data={profile}
                            key={Date.now() + profile.id}
                        />}
                    {selectedItem === EMIT.EVENT_PROFILE.changePassword && profile?.id &&
                        <Password
                            page={EMIT.EVENT_PROFILE.changePassword}
                            data={profile.id}
                        />}
                    {selectedItem === EMIT.EVENT_PROFILE.staff && specialty.length > 0 && <StaffInfo
                        page={EMIT.EVENT_PROFILE.staff}
                        refresh={(value) => refresh(value)}
                        department={profile?.staffUserData?.staffDepartmentData}
                        specialty={specialty}
                        data={profile}
                        key={Date.now() + profile.id}
                    />}
                    {selectedItem === EMIT.EVENT_PROFILE.insurance && <div>Bảo hiểm</div>}
                    {selectedItem === EMIT.EVENT_PROFILE.notifications && <Notification />}
                </div>
            </div>
        </div>
    )
}
export default Profile;