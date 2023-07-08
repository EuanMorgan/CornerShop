import { format } from "date-fns";

import { prisma } from "~/lib/db";
import { ColorColumn } from "./components/Columns";
import SizesClient from "./components/Client";

const ColorsPage = async ({
  params
}: {
  params: {
    storeId: string;
  };
}) => {
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedColors: ColorColumn[] = colors.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(new Date(size.createdAt), "MM/dd/yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
