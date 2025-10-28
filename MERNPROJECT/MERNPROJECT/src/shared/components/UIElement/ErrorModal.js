import React from "react";
import Modal from "./Modal";
import Button from "../FormElements/Button";
import "./ErrorModal.css";

const ErrorModal = ({ onClear, error }) => {
  return (
    <Modal
      onCancel={onClear}
      header="⚠️ An Error Occurred"
      show={!!error}
      footer={
        <div className="error-modal__footer">
          <Button onClick={onClear} className="error-modal__button">
            Okay
          </Button>
        </div>
      }
    >
      <p className="error-modal__text">{error}</p>
    </Modal>
  );
};

export default ErrorModal;
