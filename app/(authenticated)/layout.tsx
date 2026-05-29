import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from '@/lib/session';
import { User as UserIcon, MapPin, LogOut, LayoutDashboard } from 'lucide-react';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.userId) {
    redirect('/auth');
  }

  // Optionally fetch user info to display name
  const userList = await db.select().from(users).where(eq(users.id, session.userId as string));
  const user = userList[0];

  const handleLogout = async () => {
    'use server';
    await deleteSession();
    redirect('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-10 shadow-sm relative">
        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg text-white font-bold">
              M
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MediHelp</span>
          </Link>
        </div>

        <div className="p-6">
          <div className="text-sm font-medium text-slate-500 mb-1">Welcome back,</div>
          <div className="font-bold text-slate-900 truncate">{user?.name || 'User'}</div>
          <div className="text-xs text-teal-600 bg-teal-50 inline-block px-2 py-0.5 rounded-full mt-1 uppercase tracking-wide font-bold">
            {user?.role || 'Patient'}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <UserIcon className="w-5 h-5" />
            Profile
          </Link>
          <Link href="/bloodmap" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <MapPin className="w-5 h-5" />
            Blood Map
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 mt-auto">
          <form action={handleLogout}>
            <button type="submit" className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 font-bold transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between md:hidden shadow-sm z-10 relative">
          <Link href="/" className="font-bold text-lg text-slate-900">MediHelp</Link>
          <form action={handleLogout}>
            <button type="submit" className="text-slate-600 hover:text-red-600 text-sm font-medium transition-colors">Sign Out</button>
          </form>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-0 pb-20 md:pb-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden flex justify-around items-center h-16 z-50 px-2 pb-safe">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 w-full py-2 text-slate-500 hover:text-primary-600 active:bg-slate-50 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/bloodmap" className="flex flex-col items-center gap-1 w-full py-2 text-slate-500 hover:text-primary-600 active:bg-slate-50 rounded-lg transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium">Map</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 w-full py-2 text-slate-500 hover:text-primary-600 active:bg-slate-50 rounded-lg transition-colors">
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
