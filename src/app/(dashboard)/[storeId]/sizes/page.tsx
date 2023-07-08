import { format } from "date-fns";

import { prisma } from "~/lib/db";
import { SizeColumn } from "./components/Columns";
import SizesClient from "./components/Client";

const SizesPage = async ({
  params
}: {
  params: {
    storeId: string;
  };
}) => {
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedSizes: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(new Date(size.createdAt), "MM/dd/yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
