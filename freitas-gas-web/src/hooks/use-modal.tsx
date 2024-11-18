import { useState, useCallback } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
}

const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpenChange = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return { isOpen, onOpen, onClose,onOpenChange };
};

export default useModal;