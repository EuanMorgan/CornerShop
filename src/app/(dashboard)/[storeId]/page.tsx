import {prisma} from '~/lib/db';

const DashboardPage = async ({
  params: {storeId},
}: {
  params: {storeId: string};
}) => {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
    },
  });

  return <div>{store?.name}</div>;
};

export default DashboardPage;
