import React from 'react';
import { Button, Modal } from 'antd';
const { useState } = React;;
const ModelBill: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                onCancel={handleCancel}
            >
            </Modal>
        </>
    );
};

export default ModelBill;


