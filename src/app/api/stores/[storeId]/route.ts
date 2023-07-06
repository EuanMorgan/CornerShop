import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import {ZodError} from 'zod';
import {prisma} from '~/lib/db';
import {storeSettingsSchema} from '~/schemas/store.schema';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const body = await req.json();

    const {name} = storeSettingsSchema.parse(body);

    const store = await prisma.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({issues: error.issues}, {status: 400});
    }
    console.log('[STORE_PATCH]', error);
    return new NextResponse('Internal error', {status: 500});
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const store = await prisma.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal error', {status: 500});
  }
}
