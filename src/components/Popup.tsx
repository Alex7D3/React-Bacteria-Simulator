import React from "react";
type PopupProps = {
	children?: React.ReactNode,
	onClose: () => void,
  type?: string
};

export default function Popup({ children, onClose, type = "info" }: PopupProps) {

  const classNames = () => {
    switch(type) {
      case "error":
        return "popup-content error";
      case "info":
        return "popup-content info";
      default: 
        return "popup-content";
    }
  };

  return (
    <div className="popup-overlay">
      <div className={classNames()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        {children}
        <button onClick={onClose} aria-describedby="close">OK</button>
        <p hidden id="close">Close this message</p>
      </div>
    </div>
  );
}