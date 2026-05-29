import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

export default async function DashboardPage() {
  const session = await getSession();
  const userList = await db.select().from(users).where(eq(users.id, session!.userId as string));
  const user = userList[0];

  if (user.role === 'doctor') {
    return <DoctorDashboard user={user} />;
  }

  return <PatientDashboard user={user} />;
}
