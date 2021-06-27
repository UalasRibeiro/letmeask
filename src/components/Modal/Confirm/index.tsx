import { FaTimesCircle } from 'react-icons/fa';
import Modal from 'react-modal';

import '../style.scss';

type ModalConfirmProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmButtonText?:string;
    confirmButtonClassName?:string;
    onRequestClose: () => void;
    onRequestConfirm: () => void;
}

export function ModalConfirm({
                            isOpen, 
                            title,
                            message,
                            confirmButtonText="Confirmar",
                            confirmButtonClassName="danger",
                            onRequestClose,
                            onRequestConfirm
                        }: ModalConfirmProps) {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                className="modal"
                overlayClassName="modal-overlay"
                ariaHideApp = {false}
            >
                <div className="modal-container">
                    <div className="modal-header">
                        <FaTimesCircle />
                        <h3>{title}</h3>
                    </div>
                    <div className="modal-content">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onRequestClose}
                            >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className={confirmButtonClassName}
                            onClick={onRequestConfirm}
                        >
                            {confirmButtonText}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}