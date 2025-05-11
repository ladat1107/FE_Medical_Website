import { Modal } from 'antd';
import './StepModal.scss';
import PropTypes from 'prop-types';
import { cutSuffix } from '@/utils/numberSeries';

const StepModal = ({ isOpen, onClose, examinationData }) => {
    const renderProgressFlow = (title, stepsData) => {
        return (
            <div className="progress-section">
                <h3 className="progress-title">{title}</h3>
                <div className="steps-container">
                    {stepsData.completedSteps.map((step, index) => (
                        <div key={index} className="step-item">
                            {/* Connector */}
                            {index < stepsData.completedSteps.length - 1 && (
                                <div className={`step-connector ${step.isCompleted ? 'completed' : ''}`} />
                            )}

                            {/* Circle */}
                            <div className={`step-circle ${step.isCompleted ? 'completed' :
                                    step.isActive ? 'active' : ''
                                }`}>
                                {step.isCompleted ? (
                                    <i className="fa-solid fa-check"></i>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="step-content">
                                <h4>{step.label}</h4>
                                <p>
                                    {step.isActive && stepsData.currentStep === "Đang khám bệnh"
                                        ? stepsData.roomInfo
                                        : step.isActive
                                            ? `Đang ${step.label.toLowerCase()}`
                                            : step.isCompleted
                                                ? 'Đã hoàn thành'
                                                : 'Chưa bắt đầu'
                                    }
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Modal
            title="Theo dõi tiến trình khám bệnh"
            open={isOpen}
            onCancel={onClose}
            width={1000}
            footer={null}
            className="step-modal"
        >
            <div className="modal-content">
                {examinationData?.DT?.mainExamination &&
                    renderProgressFlow(`Khám bệnh - ${cutSuffix(examinationData?.DT?.mainExamination.roomInfo)}`, examinationData.DT.mainExamination)}

                {examinationData?.DT?.paraclinicalTests?.map((test, index) => (
                    <div key={index}>
                        {renderProgressFlow(
                            `Cận lâm sàng: ${test.name} - ${test.room}`,
                            test.steps
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    );
};

StepModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    examinationData: PropTypes.shape({
        EC: PropTypes.number,
        EM: PropTypes.string,
        DT: PropTypes.shape({
            mainExamination: PropTypes.object,
            paraclinicalTests: PropTypes.object
        })
    })
};

export default StepModal;