'use client';

import {useIsMounted} from '~/hooks/useIsMounted';

export const useOrigin = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  return origin;
};
