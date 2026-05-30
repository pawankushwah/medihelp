import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNavBar from '../components/SideNavBar';
import TopAppBar from '../components/TopAppBar';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('vitals'); // 'vitals' or 'summary'
  const [filterType, setFilterType] = useState('all'); // 'all', 'vitals', 'summary'
  
  // Vitals form state
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [steps, setSteps] = useState('');
  const [sugarLevel, setSugarLevel] = useState('');

  // Summary form state
  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Submit states
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Profile update state
  const [isAvailableToDonate, setIsAvailableToDonate] = useState(false);

  const fetchUserDataAndLogs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      // Fetch current authenticated user
      const meResponse = await axios.get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (meResponse.data.user) {
        setUser(meResponse.data.user);
        setIsAvailableToDonate(meResponse.data.user.patientProfile?.isAvailableToDonate || false);
      }

      // Fetch health history
      const historyResponse = await axios.get('http://localhost:5000/health/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (historyResponse.data.status === 'success') {
        setLogs(historyResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDataAndLogs();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
    setModalError('');
    setModalSuccess('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Clear forms
    setHeartRate('');
    setBloodPressure('');
    setSteps('');
    setSugarLevel('');
    setTitle('');
    setDoctorName('');
    setDiagnosis('');
    setRecommendations('');
  };

  const handleToggleDonation = async () => {
    const nextStatus = !isAvailableToDonate;
    setIsAvailableToDonate(nextStatus);

    // If there is an API to update profiles we would hit it here, otherwise keep in local state
    // We will build a profile update backend endpoint in a later step to persist this change!
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/health/log', {
        logType: 'medical_summary',
        summaryData: {
          title: "Donation Status Update",
          doctorName: "Self Service",
          diagnosis: `Updated blood donor availability status to: ${nextStatus ? 'Available' : 'Unavailable'}`,
          recommendations: `Blood Type: ${user?.patientProfile?.bloodType || 'O+'}`
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh logs
      const historyResponse = await axios.get('http://localhost:5000/health/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (historyResponse.data.status === 'success') {
        setLogs(historyResponse.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');
    setModalSuccess('');

    const token = localStorage.getItem('token');
    
    let payload = {};
    if (modalTab === 'vitals') {
      payload = {
        logType: 'vitals',
        vitalsData: {
          heartRate: Number(heartRate) || undefined,
          bloodPressure: bloodPressure || undefined,
          steps: Number(steps) || undefined,
          sugarLevel: Number(sugarLevel) || undefined
        }
      };
    } else {
      payload = {
        logType: 'medical_summary',
        summaryData: {
          title,
          doctorName,
          diagnosis,
          recommendations
        }
      };
    }

    try {
      const response = await axios.post('http://localhost:5000/health/log', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        setModalSuccess('Record saved successfully!');
        setTimeout(() => {
          handleCloseModal();
          fetchUserDataAndLogs(); // Reload data
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setModalError(error.response?.data?.message || 'Failed to save health record.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Filter logs based on selection
  const filteredLogs = logs.filter(log => {
    if (filterType === 'all') return true;
    if (filterType === 'vitals') return log.logType === 'vitals';
    if (filterType === 'summary') return log.logType === 'medical_summary';
    return true;
  });

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center medical-pattern">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">refresh</span>
          <p className="font-label-md text-primary">Loading Medihelp Dashboard...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Alexander Vance';
  const patientEmail = user?.email || 'a.vance@email.com';
  const patientPhone = user?.phone || '+1 (555) 234-8891';
  const bloodTypeStr = user?.patientProfile?.bloodType || 'O+';
  const patientId = user?._id ? `CT-${user._id.slice(-4).toUpperCase()}-X` : 'CT-9920-X';

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Side Navigation */}
      <SideNavBar onAddRecordClick={handleOpenModal} />

      {/* Top Header & Content Canvas */}
      <div className="flex-1 flex flex-col ml-64">
        <TopAppBar />

        <main className="pt-20 px-gutter pb-xl flex-grow">
          <div className="max-w-container-max mx-auto py-md">
            
            {/* Welcome Banner */}
            <section className="mb-xl relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-xl clinic-shadow">
              <div className="relative z-10">
                <h2 className="font-headline-xl text-headline-xl mb-xs">Welcome back, {patientName}</h2>
                <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">
                  Your health dashboard is up to date. You have {logs.length} health log records stored securely in the Medihelp database.
                </p>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </section>

            <div className="bento-grid">
              
              {/* Quick Actions & Activity Feed */}
              <div className="col-span-12 lg:col-span-8 space-y-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {/* Add Health Record Action */}
                  <div 
                    onClick={handleOpenModal}
                    className="group bg-surface-container-lowest border border-outline-variant p-lg rounded-xl clinic-shadow hover:border-primary transition-all cursor-pointer hover:-translate-y-0.5 duration-300"
                  >
                    <div className="h-12 w-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">add_circle</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm mb-xs">Add Health Record</h3>
                    <p className="font-body-sm text-on-surface-variant">Upload new diagnostic reports, prescriptions, or log daily vitals statistics.</p>
                  </div>

                  {/* View History (Filters toggle) */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl clinic-shadow hover:border-primary transition-all duration-300">
                    <div className="h-12 w-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-md">
                      <span className="material-symbols-outlined">history</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm mb-xs">Filter History</h3>
                    <div className="flex gap-xs mt-sm bg-surface-container p-xs rounded-lg">
                      <button 
                        onClick={() => setFilterType('all')} 
                        className={`flex-1 py-xs rounded text-[11px] font-bold uppercase transition-all ${filterType === 'all' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setFilterType('vitals')} 
                        className={`flex-1 py-xs rounded text-[11px] font-bold uppercase transition-all ${filterType === 'vitals' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                      >
                        Vitals
                      </button>
                      <button 
                        onClick={() => setFilterType('summary')} 
                        className={`flex-1 py-xs rounded text-[11px] font-bold uppercase transition-all ${filterType === 'summary' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                      >
                        Summaries
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant clinic-shadow">
                  <div className="flex items-center justify-between mb-lg">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Medical & Health Timeline</h3>
                    <span className="text-on-surface-variant font-body-sm">Showing {filteredLogs.length} items</span>
                  </div>

                  <div className="space-y-md">
                    {filteredLogs.length === 0 ? (
                      <div className="text-center py-xl border-2 border-dashed border-outline-variant rounded-lg">
                        <span className="material-symbols-outlined text-outline text-[48px] mb-xs">clinical_notes</span>
                        <p className="font-body-md text-on-surface-variant">No health log entries found. Click 'Add Health Record' to create one!</p>
                      </div>
                    ) : (
                      filteredLogs.map((log) => {
                        const isVitals = log.logType === 'vitals';
                        return (
                          <div 
                            key={log._id} 
                            className={`flex items-start gap-md p-md bg-surface-container-low rounded-lg border-l-4 ${isVitals ? 'border-secondary' : 'border-tertiary'} hover:scale-[1.01] transition-all`}
                          >
                            <div className={`p-sm rounded-full ${isVitals ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
                              <span className="material-symbols-outlined">
                                {isVitals ? 'biotech' : 'pill'}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-label-md text-label-md text-on-surface font-semibold">
                                  {isVitals ? 'Vitals Statistics' : (log.summaryData?.title || 'Medical Clinical Summary')}
                                </h4>
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                  {formatDate(log.createdAt)}
                                </span>
                              </div>

                              {isVitals ? (
                                <div className="mt-sm grid grid-cols-2 md:grid-cols-4 gap-sm">
                                  {log.vitalsData?.heartRate && (
                                    <div className="bg-surface-container-lowest p-xs px-sm rounded border border-outline-variant/50">
                                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">Heart Rate</p>
                                      <p className="font-headline-sm text-headline-sm text-secondary">{log.vitalsData.heartRate} bpm</p>
                                    </div>
                                  )}
                                  {log.vitalsData?.bloodPressure && (
                                    <div className="bg-surface-container-lowest p-xs px-sm rounded border border-outline-variant/50">
                                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">BP Ratio</p>
                                      <p className="font-headline-sm text-headline-sm text-secondary">{log.vitalsData.bloodPressure}</p>
                                    </div>
                                  )}
                                  {log.vitalsData?.sugarLevel && (
                                    <div className="bg-surface-container-lowest p-xs px-sm rounded border border-outline-variant/50">
                                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">Glucose</p>
                                      <p className="font-headline-sm text-headline-sm text-secondary">{log.vitalsData.sugarLevel} mg/dL</p>
                                    </div>
                                  )}
                                  {log.vitalsData?.steps && (
                                    <div className="bg-surface-container-lowest p-xs px-sm rounded border border-outline-variant/50">
                                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">Active Steps</p>
                                      <p className="font-headline-sm text-headline-sm text-secondary">{log.vitalsData.steps}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-sm space-y-xs text-body-sm text-on-surface-variant">
                                  <p><strong className="text-on-surface">Practitioner:</strong> {log.summaryData?.doctorName || 'Not specified'}</p>
                                  <p><strong className="text-on-surface">Diagnosis:</strong> {log.summaryData?.diagnosis || 'N/A'}</p>
                                  {log.summaryData?.recommendations && (
                                    <p className="bg-surface-container-lowest p-xs px-sm rounded border border-outline-variant/50 mt-xs text-[12px] italic">
                                      {log.summaryData.recommendations}
                                    </p>
                                  )}
                                </div>
                              )}

                              <div className="mt-sm inline-flex items-center px-sm py-xs bg-tertiary-container text-on-tertiary-container rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {isVitals ? 'Stable' : 'Reviewed'}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Info Panels */}
              <div className="col-span-12 lg:col-span-4 space-y-lg">
                
                {/* Profile Card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden clinic-shadow">
                  <div className="h-24 bg-secondary relative">
                    <img 
                      alt="Clinic Office" 
                      className="w-full h-full object-cover opacity-40" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKafJZJ-1qwQSv9AXk6sZy_cEi5V9otuhRUDcvDeMGTp2qvOkYOzgvJJSKxiQxi8qFt7GjcSA0gXUgs2n4b2iiSAit4UQYU_kpEET3jbFn5TjHvk0RG5b4k56iJlyLjzMKt0x6xHYMddlu6g370TuM8KSPp4N7C-fRjtfrIfN6lF-kUQzYKF69mWtWr95ceu-Rv8z1rqSN8uQ4h1dNq1GuwcPTQI18weuK6VPMuvHvuQy6cxrQUe6QteIcT3vsqyQcQC1KiDF-n-0"
                    />
                  </div>
                  
                  <div className="px-lg pb-lg">
                    <div className="-mt-12 mb-md relative inline-block">
                      <div className="h-24 w-24 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-primary-fixed">
                        <img 
                          alt={patientName} 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXUXX-tsNe4FrlMVt_FD9lWMQl67zv4Yju0cq1LLyK_tUNHOKSndQl_lPLDdfDLpRQWclIdcqGZ6R7tCOc9DzFGwfwQipDBUQj-4ffICgYreSiT62ARCsV4sQxC7v92nj_jx_8tCejycb2GZVXU1uc1BM3rzQR_UUFPQTVYvDQqI23oQFK9q6F93_9WODZLTYVnrQ8urGMq_ThcTrKOXlxJ5MJXZByMlOFu-Pejlmw2QA8YpWkyUd5-ExzMyYWjwB4QLWycwAA2wg"
                        />
                      </div>
                      <span className={`absolute bottom-1 right-1 h-5 w-5 border-2 border-surface-container-lowest rounded-full ${isAvailableToDonate ? 'bg-tertiary' : 'bg-outline'}`}></span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm mb-xs">{patientName}</h3>
                    <p className="font-body-sm text-on-surface-variant mb-lg">Patient ID: {patientId}</p>
                    
                    <div className="space-y-md border-t border-outline-variant pt-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Email</span>
                        <span className="font-body-sm text-on-surface truncate max-w-[200px]">{patientEmail}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Phone</span>
                        <span className="font-body-sm text-on-surface">{patientPhone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Blood Type</span>
                        <span className="px-sm py-xs bg-error-container text-on-error-container rounded-lg font-bold">{bloodTypeStr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Donation Status</span>
                        <button 
                          onClick={handleToggleDonation}
                          className={`font-body-sm font-bold flex items-center gap-xs px-sm py-1 rounded transition-colors ${
                            isAvailableToDonate 
                              ? 'text-tertiary bg-tertiary-fixed/30 hover:bg-tertiary-fixed/50' 
                              : 'text-outline bg-surface-container hover:bg-surface-container-high'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                          {isAvailableToDonate ? 'Active Donor' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wellness Score */}
                <div className="bg-surface-container-highest p-lg rounded-xl border border-outline-variant clinic-shadow">
                  <h4 className="font-label-md text-label-md mb-md flex items-center gap-xs text-on-surface">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Health Wellness Score
                  </h4>
                  <div className="relative h-2 w-full bg-outline-variant rounded-full overflow-hidden mb-xs">
                    <div className="absolute top-0 left-0 h-full bg-tertiary rounded-full w-[88%] transition-all duration-1000"></div>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-headline-lg text-headline-lg text-tertiary">88%</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Top 5% for age group</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Overlay Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-[500px] w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-lg bg-surface border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-xs">
                <span className="material-symbols-outlined text-[26px]">medical_information</span>
                Add Health Record
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-on-surface-variant hover:text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-outline-variant">
              <button
                type="button"
                onClick={() => setModalTab('vitals')}
                className={`flex-1 py-sm font-label-md text-label-md text-center transition-colors hover:bg-surface-container-high ${
                  modalTab === 'vitals' ? 'text-primary bg-surface-container border-b-2 border-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                Vitals Data
              </button>
              <button
                type="button"
                onClick={() => setModalTab('summary')}
                className={`flex-1 py-sm font-label-md text-label-md text-center transition-colors hover:bg-surface-container-high ${
                  modalTab === 'summary' ? 'text-primary bg-surface-container border-b-2 border-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                Medical Summary
              </button>
            </div>

            {/* Modal Alert Box */}
            {modalError && (
              <div className="mx-lg mt-md p-md bg-error-container text-on-error-container rounded-lg border border-error/20 font-body-sm">
                {modalError}
              </div>
            )}
            {modalSuccess && (
              <div className="mx-lg mt-md p-md bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg border border-tertiary/20 font-body-sm">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleSaveLog} className="p-lg space-y-md">
              {modalTab === 'vitals' ? (
                /* Vitals Fields */
                <div className="space-y-md">
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Heart Rate (bpm)</label>
                      <input 
                        type="number"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        placeholder="72"
                        className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Blood Pressure</label>
                      <input 
                        type="text"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                        placeholder="120/80"
                        className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Sugar Level (mg/dL)</label>
                      <input 
                        type="number"
                        value={sugarLevel}
                        onChange={(e) => setSugarLevel(e.target.value)}
                        placeholder="95"
                        className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Steps Walked</label>
                      <input 
                        type="number"
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                        placeholder="10000"
                        className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Summary Fields */
                <div className="space-y-md">
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Report Title</label>
                    <input 
                      required
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Annual Checkup, Vaccination Log"
                      className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Doctor Name</label>
                    <input 
                      required
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Dr. Jenkins"
                      className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Diagnosis Details</label>
                    <textarea 
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Brief details of findings"
                      className="w-full p-md h-24 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none font-body-sm"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Recommendations & Prescription</label>
                    <textarea 
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder="Meds prescribed, resting advice..."
                      className="w-full p-md h-20 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none font-body-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-md pt-md border-t border-outline-variant">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-12 border border-outline text-on-surface hover:bg-surface-container font-label-md rounded-lg active:scale-[0.98] transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-12 bg-primary text-on-primary font-label-md rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs disabled:opacity-75"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      Saving...
                    </>
                  ) : (
                    'SAVE RECORD'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
