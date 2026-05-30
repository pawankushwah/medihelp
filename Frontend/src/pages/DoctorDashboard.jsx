import React, { useState, useEffect } from 'react';
import api from '../api';
import SideNavBar from '../components/SideNavBar';
import TopAppBar from '../components/TopAppBar';

const DoctorDashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [patientLogs, setPatientLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchError, setSearchError] = useState('');

  // Review form state
  const [comments, setComments] = useState('');
  const [prescription, setPrescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchDoctorProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      if (response.data.user) {
        setDoctorInfo(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      setErrorMsg('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchKey.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setReviewSuccess('');
    setReviewError('');
    setSearchedPatient(null);
    setPatientLogs([]);

    try {
      const response = await api.get(`/doctor/search-patient?searchKey=${encodeURIComponent(searchKey)}`);

      if (response.data.status === 'success') {
        const { patient, logs } = response.data;
        // In the backend, patient returns { id, username, email, phone }
        // Let's also verify if the patient has extra profile details or if we can fetch all users later.
        setSearchedPatient(patient);
        setPatientLogs(logs);
      }
    } catch (error) {
      console.error('Error searching patient records:', error);
      setSearchError(error.response?.data?.message || 'Patient not found. Try searching by email or phone.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!searchedPatient) return;

    setSubmittingReview(true);
    setReviewSuccess('');
    setReviewError('');

    try {
      const response = await api.post('/doctor/review', {
        patientId: searchedPatient.id,
        comments,
        prescription,
        followUpDate
      });

      if (response.data.status === 'success') {
        setReviewSuccess('Medical review and prescription saved successfully!');
        
        // Clear fields
        setComments('');
        setPrescription('');
        setFollowUpDate('');

        // Refresh search results to show new medical summary log!
        setTimeout(() => {
          handleSearch();
        }, 1200);
      }
    } catch (error) {
      console.error('Error submitting doctor review:', error);
      setReviewError(error.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  if (loading && !doctorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center medical-pattern">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">refresh</span>
          <p className="font-label-md text-primary">Loading Doctor Portal...</p>
        </div>
      </div>
    );
  }

  const docName = doctorInfo?.name || 'Dr. Alexander Vance';
  const docEmail = doctorInfo?.email || 'doctor@email.com';
  const docPhone = doctorInfo?.phone || '+1 (555) 000-1111';
  const docSpec = doctorInfo?.doctorProfile?.specialization || 'General Practitioner';
  const docSlots = doctorInfo?.doctorProfile?.availabilitySlots || 'Mon-Fri Mornings & Afternoons';

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* Side Navigation */}
      <SideNavBar />

      <div className="flex-1 flex flex-col ml-64">
        {/* Top Header */}
        <TopAppBar />

        <main className="pt-20 px-gutter pb-xl flex-grow">
          <div className="max-w-container-max mx-auto py-md">
            
            {/* Welcome Banner */}
            <section className="mb-xl relative overflow-hidden rounded-xl bg-primary text-on-primary p-xl clinic-shadow">
              <div className="relative z-10">
                <h2 className="font-headline-xl text-headline-xl mb-xs">Welcome back, Dr. {docName}</h2>
                <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">
                  Medihelp secure network. Access patient files, verify diagnostic vital logs, and authorize clinical reports.
                </p>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </section>

            <div className="bento-grid">
              
              {/* Primary Panel: Search and Review Form */}
              <div className="col-span-12 lg:col-span-8 space-y-lg">
                
                {/* Patient Search Section */}
                <div id="patient-search" className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant clinic-shadow">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[26px]">person_search</span>
                    Lookup Patient Record
                  </h3>
                  
                  <form onSubmit={handleSearch} className="flex gap-md">
                    <div className="relative flex-1">
                      <input 
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        placeholder="Enter patient email or phone number..."
                        className="w-full h-12 pl-xl pr-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        type="text"
                        required
                      />
                      <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    </div>
                    <button
                      type="submit"
                      disabled={searchLoading}
                      className="h-12 px-lg bg-primary text-on-primary font-label-md rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs disabled:opacity-75"
                    >
                      {searchLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">refresh</span>
                          Searching
                        </>
                      ) : (
                        'SEARCH'
                      )}
                    </button>
                  </form>

                  {searchError && (
                    <div className="mt-md p-md bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-sm font-medium">
                      {searchError}
                    </div>
                  )}
                </div>

                {/* Searched Patient Result File */}
                {searchedPatient && (
                  <div id="health-records" className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant clinic-shadow animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-outline-variant pb-md mb-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[24px] text-secondary">assignment_ind</span>
                          Patient File: {searchedPatient.username || searchedPatient.name || 'Anonymous Patient'}
                        </h4>
                        <p className="font-body-sm text-on-surface-variant mt-xs">
                          Email: {searchedPatient.email} | Phone: {searchedPatient.phone}
                        </p>
                      </div>
                      <span className="px-sm py-xs bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded uppercase">
                        ID: {searchedPatient.id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Vitals History & Logs List */}
                    <div className="space-y-md">
                      <h5 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-sm">Record History</h5>
                      
                      {patientLogs.length === 0 ? (
                        <p className="text-body-sm text-on-surface-variant italic py-md text-center bg-surface-container-low rounded border border-dashed border-outline-variant">
                          This patient has not submitted any health logs or vitals history.
                        </p>
                      ) : (
                        patientLogs.map((log) => {
                          const isVitals = log.logType === 'vitals';
                          return (
                            <div 
                              key={log._id} 
                              className={`p-md bg-surface-container-low rounded-lg border-l-4 ${isVitals ? 'border-secondary' : 'border-tertiary'} text-body-sm`}
                            >
                              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-xs mb-xs">
                                <span className="font-semibold text-on-surface flex items-center gap-xs">
                                  <span className="material-symbols-outlined text-[18px]">
                                    {isVitals ? 'biotech' : 'pill'}
                                  </span>
                                  {isVitals ? 'Vitals Log' : (log.summaryData?.title || 'Prescribing Summary')}
                                </span>
                                <span className="text-[12px] text-on-surface-variant font-medium">
                                  {formatDate(log.createdAt)}
                                </span>
                              </div>

                              {isVitals ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-sm pt-xs">
                                  {log.vitalsData?.heartRate && <p><strong>Heart Rate:</strong> {log.vitalsData.heartRate} bpm</p>}
                                  {log.vitalsData?.bloodPressure && <p><strong>BP:</strong> {log.vitalsData.bloodPressure}</p>}
                                  {log.vitalsData?.sugarLevel && <p><strong>Sugar:</strong> {log.vitalsData.sugarLevel} mg/dL</p>}
                                  {log.vitalsData?.steps && <p><strong>Steps:</strong> {log.vitalsData.steps}</p>}
                                </div>
                              ) : (
                                <div className="space-y-xs pt-xs">
                                  <p><strong>Practitioner:</strong> {log.summaryData?.doctorName}</p>
                                  <p><strong>Diagnosis:</strong> {log.summaryData?.diagnosis}</p>
                                  {log.summaryData?.recommendations && (
                                    <p className="bg-surface-container-lowest p-xs px-sm rounded border border-outline-variant/40 italic">
                                      {log.summaryData.recommendations}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Write Review Form */}
                    <div className="border-t border-outline-variant mt-lg pt-lg">
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-md flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[24px]">rate_review</span>
                        Add Practitioner Medical Review
                      </h4>

                      {reviewSuccess && (
                        <div className="p-md bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary/20 rounded-lg text-body-sm font-medium mb-md">
                          {reviewSuccess}
                        </div>
                      )}
                      {reviewError && (
                        <div className="p-md bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-sm font-medium mb-md">
                          {reviewError}
                        </div>
                      )}

                      <form onSubmit={handleSubmitReview} className="space-y-md">
                        <div>
                          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Medical Evaluation & Observations</label>
                          <textarea 
                            required
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Type diagnostic comments, symptoms verified, or advice..."
                            className="w-full p-md h-24 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none font-body-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                          <div>
                            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Prescription & Meds Authorization (Optional)</label>
                            <input 
                              type="text"
                              value={prescription}
                              onChange={(e) => setPrescription(e.target.value)}
                              placeholder="e.g. Paracetamol 500mg daily for 5 days"
                              className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Recommended Follow-up Date (Optional)</label>
                            <input 
                              type="date"
                              value={followUpDate}
                              onChange={(e) => setFollowUpDate(e.target.value)}
                              className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface font-body-sm"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="h-12 w-full bg-primary text-on-primary font-label-md rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs disabled:opacity-75"
                        >
                          {submittingReview ? (
                            <>
                              <span className="material-symbols-outlined animate-spin">refresh</span>
                              Submitting Medical File...
                            </>
                          ) : (
                            'SUBMIT DOCTOR REVIEW'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Panel: Doctor Profile Summary */}
              <div className="col-span-12 lg:col-span-4 space-y-lg">
                <div id="profile" className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden clinic-shadow">
                  <div className="h-24 bg-secondary relative">
                    <img 
                      alt="Medical clinic" 
                      className="w-full h-full object-cover opacity-40" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKafJZJ-1qwQSv9AXk6sZy_cEi5V9otuhRUDcvDeMGTp2qvOkYOzgvJJSKxiQxi8qFt7GjcSA0gXUgs2n4b2iiSAit4UQYU_kpEET3jbFn5TjHvk0RG5b4k56iJlyLjzMKt0x6xHYMddlu6g370TuM8KSPp4N7C-fRjtfrIfN6lF-kUQzYKF69mWtWr95ceu-Rv8z1rqSN8uQ4h1dNq1GuwcPTQI18weuK6VPMuvHvuQy6cxrQUe6QteIcT3vsqyQcQC1KiDF-n-0"
                    />
                  </div>
                  
                  <div className="px-lg pb-lg text-center md:text-left">
                    <div className="-mt-12 mb-md relative inline-block">
                      <div className="h-24 w-24 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-primary-fixed">
                        <img 
                          alt={docName} 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuASj_Sy_jI-Qx3JMnDmGbus_Iudj7PJSCM894vIlAJLPcJ_uSkTVpH2v4fks_EF2SYWE1dq7496bTNg6lVz3RDQFJ-rpfhipH3JmGsirgf45bqZCWt1QmKmoxhtdnUBeghmohQExDknsZ0aCkdZG4Rl_mO_gHsgwiSCVgk4NfZVV2vpd2sjeQWb5Z0F5kyqVh8jInV2Xo-8o2E5j46Z9RmuPxBnIm-7RBbDGJ1AtQyi_azkPR8KGc6i04mraRx1GvKawSjYdWd6BvU"
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 h-5 w-5 bg-tertiary border-2 border-surface-container-lowest rounded-full"></span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm mb-xs">Dr. {docName}</h3>
                    <p className="font-body-sm text-primary font-semibold mb-lg">{docSpec}</p>

                    <div className="space-y-md border-t border-outline-variant pt-lg text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Email</span>
                        <span className="font-body-sm text-on-surface truncate max-w-[200px]">{docEmail}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Phone</span>
                        <span className="font-body-sm text-on-surface">{docPhone}</span>
                      </div>
                      <div className="flex flex-col gap-xs pt-xs">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Weekly Availability Slots</span>
                        <span className="px-sm py-sm bg-surface-container rounded-lg font-body-sm text-on-surface font-medium leading-relaxed">
                          {docSlots}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
