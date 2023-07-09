import { prisma } from "~/lib/db";
import ProductForm from "./components/ProductForm";

const ProductsPage = async ({
  params
}: {
  params: { productId: string; storeId: string };
}) => {
  const productPromise = prisma.product.findUnique({
    where: {
      id: params.productId
    },
    include: {
      images: true
    }
  });

  const categoriesPromise = prisma.category.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const sizesPromise = prisma.size.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const colorsPromise = prisma.color.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const [product, categories, sizes, colors] = await prisma.$transaction([
    productPromise,
    categoriesPromise,
    sizesPromise,
    colorsPromise
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          sizes={sizes}
          colors={colors}
          initialData={product}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
