import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';
import {prisma} from '~/lib/db';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {userId} = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  // Find the first store the user has

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  // If they have one, load that up
  if (store) {
    return redirect(`/${store.id}`);
  }

  //   If not just show the root
  return <>{children}</>;
}
