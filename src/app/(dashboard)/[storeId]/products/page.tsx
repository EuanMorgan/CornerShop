import { format } from "date-fns";

import { prisma } from "~/lib/db";
import { formatter } from "~/lib/utils";
import ProductClient from "./components/Client";
import { ProductColumn } from "./components/Columns";

const ProductsPage = async ({
  params
}: {
  params: {
    storeId: string;
  };
}) => {
  const products = await prisma.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedProducts: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;