'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Store} from '@prisma/client';
import axios from 'axios';
import {Trash} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {z} from 'zod';
import {AlertModal} from '~/components/modals/AlertModal';
import {ApiAlert} from '~/components/ui/api-alert';

import {Button} from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {Heading} from '~/components/ui/heading';
import {Input} from '~/components/ui/input';
import {Separator} from '~/components/ui/separator';
import {useOrigin} from '~/hooks/useOrigin';
import {StoreSettings, storeSettingsSchema} from '~/schemas/store.schema';

const SettingsForm = ({initialData}: {initialData: Store}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const origin = useOrigin();

  const form = useForm<StoreSettings>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: StoreSettings) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, values);
      router.refresh();
      toast.success('Store updated');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Store deleted');
    } catch (error) {
      toast.error(
        'Make sure you removed all products from your store before deleting it'
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage your store settings' />

        <Button
          variant='destructive'
          size={'sm'}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Store name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type='submit'>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />

      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${params.storeId}`}
        variant='public'
      />
    </>
  );
};

export default SettingsForm;
