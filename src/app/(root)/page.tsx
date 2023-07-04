import {UserButton} from '@clerk/nextjs';
import {Button} from '~/components/ui/button';

export default function SetupPage() {
  return (
    <div className='p-4'>
      <p>This is a protected route</p>
      <UserButton afterSignOutUrl='/' />
    </div>
  );
}
