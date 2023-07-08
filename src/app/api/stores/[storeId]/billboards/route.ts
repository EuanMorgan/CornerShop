import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "~/lib/db";
import { billboardFormSchema } from "~/schemas/billboard.schema";

export async function POST(
  req: Request,
  {
    params
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const body = await req.json();

    const { imageUrl, label } = billboardFormSchema.parse(body);

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prisma.billboard.create({
      data: {
        imageUrl,
        label,
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
