import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import {prisma} from '~/lib/db';

export async function POST(request: Request) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401,
      });
    }

    const {name} = await request.json();

    if (!name) {
      return new NextResponse('Name is required', {
        status: 400,
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('Internal error', {
      status: 500,
    });
  }
}
