'use client';

import {useEffect} from 'react';

import {useStoreModal} from '~/hooks/useStoreModal';

// This is a setup page which triggers the modal.
export default function SetupPage() {
  const onOpen = useStoreModal(state => state.onOpen);
  const isOpen = useStoreModal(state => state.isOpen);
  useEffect(() => {
    // Ensure modal is open, the user must create a store
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return null;
}
