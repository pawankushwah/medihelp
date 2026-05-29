import { Activity, Heart, Calendar, FileText } from 'lucide-react';

export default function PatientDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Patient Overview</h1>
        <p className="text-slate-500 mt-1 text-lg">Here's your latest health summary, {user.name.split(' ')[0]}.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Heart Rate</div>
            <div className="text-2xl font-bold text-slate-900">72 <span className="text-sm font-normal text-slate-500">bpm</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Blood Pressure</div>
            <div className="text-2xl font-bold text-slate-900">120/80</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Upcoming</div>
            <div className="text-lg font-bold text-slate-900">1 Appt</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Reports</div>
            <div className="text-lg font-bold text-slate-900">3 New</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">Dr. Smith Appointment</div>
                <div className="text-slate-500">General checkup completed.</div>
                <div className="text-sm text-slate-400 mt-1">Yesterday at 10:00 AM</div>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">Lab Results Uploaded</div>
                <div className="text-slate-500">Your recent blood test results are available.</div>
                <div className="text-sm text-slate-400 mt-1">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary-900 to-teal-800 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <h2 className="text-xl font-bold mb-2">Health Tip of the Day</h2>
          <p className="text-primary-100 mb-6">Stay hydrated! Drinking at least 8 glasses of water a day improves skin health and boosts energy.</p>
        </div>
      </div>
    </div>
  );
}
