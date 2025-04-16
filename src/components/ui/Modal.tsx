// Modal.tsx
import React from "react";

// import Text from "./Text";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[622px] py-[80px] flex flex-col justify-center items-center">
        {/* <Text className="text-[20px] text-black mb-8 text-center">
          {message}
        </Text> */}
        {/* <div className="bg-black w-full h-[20px] mb-6"></div> */}
        <p
          className="text-[20px] text-black mb-8 text-center font-newCourier"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <div className="flex items-center gap-10 justify-center">
          <Button
            className="text-white bg-black rounded-[12px] w-[200px] h-[50px]"
            onClick={onCancel}
          >
            No
          </Button>
          <Button
            className="text-white bg-black rounded-[12px] w-[200px] h-[50px]"
            onClick={onConfirm}
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
