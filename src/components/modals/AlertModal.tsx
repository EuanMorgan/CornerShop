'use client';

import {Modal} from '~/components/ui/modal';
import {Button} from '~/components/ui/button';
import {useIsMounted} from '~/hooks/useIsMounted';

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button disabled={loading} variant={'outline'} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant={'destructive'} onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
