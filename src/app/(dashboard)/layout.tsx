import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';
import {prisma} from '~/lib/db';
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
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
    <>
      <div>This will be a navbar</div>
      {children}
    </>
  );
}
