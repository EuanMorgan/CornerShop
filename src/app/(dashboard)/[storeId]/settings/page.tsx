import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';

import {prisma} from '~/lib/db';
import SettingsForm from './components/SettingsForm';

const SettingsPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const {userId} = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    return redirect('/');
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
