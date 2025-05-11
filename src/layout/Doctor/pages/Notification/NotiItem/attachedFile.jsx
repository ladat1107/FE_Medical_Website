import { CSV, DOCX, JPG, PDF, PNG, PPT, RAR, TXT, XLS } from '@/components/TypeFile/typefile';
import PropTypes from 'prop-types';
import "./attachedFile.scss";
const AttachedFile = ({ link, type }) => {
    const getFileIcon = () => {
        switch (type) {
            case 'csv':
                return <CSV />;
            case 'pdf':
                return <PDF />;
            case 'doc':
            case 'docx':
                return <DOCX />;
            case 'jpg':
            case 'jpeg':
                return <JPG />;
            case 'png':
                return <PNG />;
            case 'zip':
            case 'rar':
                return <RAR />;
            case 'txt':
                return <TXT />;
            case 'ppt':
            case 'pptx':
                return <PPT />;
            case 'xls':
            case 'xlsx':
                return <XLS />;
            default:
                return <DOCX />;
        }
    };

    const fileName = decodeURIComponent(link.split('/').pop());

    return (
        <div className="attached-file-item">
            <div className="icon-container">
                {getFileIcon()}
            </div>
            <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="file-name"
            >
                {fileName}
            </a>
        </div>
    );
};

AttachedFile.propTypes = {
    link: PropTypes.string.isRequired,
    type: PropTypes.string
};

export default AttachedFile;