import { Users, Calendar as CalendarIcon, FileText, Activity, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Provider Dashboard</h1>
          <p className="text-slate-500 mt-1 text-lg">Welcome back, {user.name}. Here is your daily overview.</p>
        </div>
        <div className="hidden sm:block">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary-500/30 transition-all">
            + New Appointment
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-primary-600 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">+12% this week</span>
          </div>
          <div className="text-indigo-100 font-medium mb-1">Total Patients</div>
          <div className="text-4xl font-extrabold">1,284</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-slate-500 font-medium mb-1">Appointments Today</div>
          <div className="text-4xl font-extrabold text-slate-900">8 <span className="text-lg text-slate-400 font-normal">remaining</span></div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">2 Urgent</span>
          </div>
          <div className="text-slate-500 font-medium mb-1">Pending Lab Reports</div>
          <div className="text-4xl font-extrabold text-slate-900">14</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
            <Link href="#" className="text-primary-600 font-medium hover:text-primary-700 flex items-center text-sm">
              View Calendar <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '09:00 AM', patient: 'Sarah Jenkins', type: 'General Checkup', status: 'Completed', color: 'bg-green-100 text-green-700' },
              { time: '10:30 AM', patient: 'Michael Chen', type: 'Lab Results Review', status: 'In Progress', color: 'bg-blue-100 text-blue-700' },
              { time: '01:15 PM', patient: 'Emma Watson', type: 'Vaccination', status: 'Upcoming', color: 'bg-slate-100 text-slate-700' },
              { time: '03:00 PM', patient: 'David Miller', type: 'Follow-up', status: 'Upcoming', color: 'bg-slate-100 text-slate-700' },
            ].map((appt, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="w-24 text-slate-500 font-medium pt-1 flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-slate-400" />
                  {appt.time}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{appt.patient}</div>
                  <div className="text-slate-500 text-sm">{appt.type}</div>
                </div>
                <div className="hidden sm:flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${appt.color}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Patient Requests */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 relative overflow-hidden">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Patient Requests</h2>
          
          <div className="space-y-4">
            {[
              { name: 'Robert Fox', req: 'Prescription Refill', urgent: true },
              { name: 'Alice Smith', req: 'Message', urgent: false },
              { name: 'John Doe', req: 'Reschedule Appt', urgent: false },
            ].map((req, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative">
                {req.urgent && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full -mt-1 -mr-1 animate-pulse"></div>}
                <div className="font-bold text-slate-900 mb-1">{req.name}</div>
                <div className="text-sm text-slate-500">{req.req}</div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300 hover:bg-slate-100 transition-all">
            View All Requests
          </button>
        </div>
      </div>
    </div>
  );
}
