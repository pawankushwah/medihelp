import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { User, Mail, ShieldCheck, Stethoscope } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getSession();
  const userList = await db.select().from(users).where(eq(users.id, session!.userId as string));
  const user = userList[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Your Profile</h1>
        <p className="text-slate-500 mt-1 text-lg">Manage your personal information and settings.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-teal-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 rounded-2xl bg-white p-2 absolute -top-12 shadow-lg">
            <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <div className="pt-16">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              {user.role === 'doctor' && (
                <span className="inline-flex items-center justify-center bg-teal-50 text-teal-600 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
                  Verified Doctor
                </span>
              )}
            </div>
            <p className="text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium text-sm">Account Type</span>
              </div>
              <div className="text-lg font-bold text-slate-900 capitalize">{user.role} Account</div>
            </div>

            {user.role === 'doctor' && user.specialization && (
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <div className="flex items-center gap-3 text-teal-600 mb-2">
                  <Stethoscope className="w-5 h-5" />
                  <span className="font-medium text-sm">Specialization</span>
                </div>
                <div className="text-lg font-bold text-teal-900">{user.specialization}</div>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
