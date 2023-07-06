'use client';

import {useEffect, useState} from 'react';

import {useIsMounted} from '~/hooks/useIsMounted';
import {StoreModal} from '~/components/modals/StoreModal';

export const ModalProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
