"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "../components/Modal";

interface ModalContextProps {
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>();

  const openModal = (content: ReactNode, title?: string) => {
    setModalContent(content);
    setModalTitle(title);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    setModalTitle(undefined);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};
