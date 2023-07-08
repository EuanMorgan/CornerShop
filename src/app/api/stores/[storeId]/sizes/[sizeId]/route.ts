import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "~/lib/db";
import { sizeFormSchema } from "~/schemas/size.schema";

export async function GET(
  req: Request,
  {
    params
  }: {
    params: {
      sizeId: string;
    };
  }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: {
      sizeId: string;
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

    const { name, value } = sizeFormSchema.parse(body);

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prisma.size.update({
      where: {
        id: params.sizeId
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ issues: error.issues }, { status: 400 });
    }
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params
  }: {
    params: {
      sizeId: string;
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

    const size = await prisma.size.delete({
      where: {
        id: params.sizeId
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
