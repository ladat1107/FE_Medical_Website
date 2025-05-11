import Container from "@/components/Container";
import Profile from "@/components/Profile/Profile";
import emitter from "@/utils/eventEmitter";
import { EMIT } from "@/constant/value";
import { useEffect, useState } from "react";
import HistoryModal from "@/layout/Doctor/components/HistoryModal/HistoryModal";
import { useSelector } from "react-redux";

const ProfileUser = () => {

    let { user } = useSelector(state => state.authen);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="w-full bg-bgAdmin py-12">
            <Container>
                <div className="flex flex-wrap justify-start md:justify-center items-center px-4 md:px-10 lg:px-40 xl:px-60  py-4">
                    <button
                        className="bg-gradient-primary text-white py-2 px-4 rounded-lg mr-2 mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => { emitter.emit(EMIT.EVENT_PROFILE.key, EMIT.EVENT_PROFILE.info) }}
                    >
                        Thông tin cá nhân
                    </button>
                    <button
                        className="bg-gradient-primary text-white py-2 px-4 rounded-lg mr-2 mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => { emitter.emit(EMIT.EVENT_PROFILE.key, EMIT.EVENT_PROFILE.changePassword) }}
                    >
                        Đổi mật khẩu
                    </button>
                    <button
                        className="bg-gradient-primary text-white py-2 px-4 rounded-lg mr-2 mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={showModal}
                    >
                        Lịch sử khám bệnh
                    </button>
                </div>
                <Profile />
            </Container>
            <div className="modal-history-content">
                <HistoryModal
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                />
            </div>
        </div>
    );
};
export default ProfileUser;