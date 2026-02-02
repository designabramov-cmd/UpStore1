// app/admin/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminPanel } from '@/components/admin/admin-panel';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminPanel />;
}
