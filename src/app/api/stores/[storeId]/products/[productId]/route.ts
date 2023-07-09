import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "~/lib/db";
import { billboardFormSchema } from "~/schemas/billboard.schema";
import { productFormSchema } from "~/schemas/product.schema";

export async function GET(
  req: Request,
  {
    params
  }: {
    params: {
      productId: string;
    };
  }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: {
      productId: string;
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchived,
      isFeatured
    } = productFormSchema.parse(body);

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prisma.product.update({
      where: {
        id: params.productId
      },
      data: {
        categoryId,
        colorId,
        sizeId,
        name,
        price,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {}
        }
      }
    });

    const product = await prisma.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: images
          }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ issues: error.issues }, { status: 400 });
    }
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params
  }: {
    params: {
      productId: string;
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prisma.product.delete({
      where: {
        id: params.productId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
