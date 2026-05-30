import React, { useState, useEffect } from 'react';
import api from '../api';
import SideNavBar from '../components/SideNavBar';
import TopAppBar from '../components/TopAppBar';

const InstitutionDashboard = () => {
  const [institutionInfo, setInstitutionInfo] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filtering state
  const [searchText, setSearchText] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('All');

  const fetchInstitutionAndDonors = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch current institution profile
      const meResponse = await api.get('/auth/me');
      let instLng = 0;
      let instLat = 0;
      if (meResponse.data.user) {
        setInstitutionInfo(meResponse.data.user);
        if (meResponse.data.user.location?.coordinates) {
            instLng = meResponse.data.user.location.coordinates[0];
            instLat = meResponse.data.user.location.coordinates[1];
        }
      }

      // Fetch active blood donors globally (using a massive radius of 50,000km for demo purposes to get all)
      const usersResponse = await api.get(`/blood-request/donors?lng=${instLng}&lat=${instLat}&distance=50000000`);
      if (usersResponse.data.status === 'success') {
        setDonors(usersResponse.data.data);
      }
    } catch (error) {
      console.error('Error loading institution data:', error);
      setErrorMsg('Failed to load portal registry directory. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutionAndDonors();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No donation records';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Filter donor list based on filters
  const filteredDonors = donors.filter(donor => {
    const nameMatch = donor.name?.toLowerCase().includes(searchText.toLowerCase()) || 
                      donor.city?.toLowerCase().includes(searchText.toLowerCase());
    
    const bloodTypeMatch = selectedBloodType === 'All' || 
                           donor.patientProfile?.bloodType === selectedBloodType;

    return nameMatch && bloodTypeMatch;
  });

  if (loading && !institutionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center medical-pattern">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">refresh</span>
          <p className="font-label-md text-primary">Loading Institution Registry...</p>
        </div>
      </div>
    );
  }

  const instName = institutionInfo?.name || 'City General Hospital';
  const instEmail = institutionInfo?.email || 'admin@citygeneral.org';
  const instPhone = institutionInfo?.phone || '+1 (555) 123-4567';
  const instCity = institutionInfo?.city || 'San Francisco';
  const instType = institutionInfo?.institutionProfile?.institutionType || 'Hospital';
  const regNumber = institutionInfo?.institutionProfile?.registrationNumber || 'HOSP-991-REG';

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* Side Navigation */}
      <SideNavBar />

      <div className="flex-1 flex flex-col w-full md:ml-64 transition-all duration-300">
        {/* Top Header */}
        <TopAppBar />

        <main className="pt-20 px-gutter pb-xl flex-grow">
          <div className="max-w-container-max mx-auto py-md">
            
            {/* Welcome Banner */}
            <section className="mb-xl relative overflow-hidden rounded-xl bg-tertiary text-on-tertiary p-xl clinic-shadow">
              <div className="relative z-10">
                <h2 className="font-headline-xl text-headline-xl mb-xs">{instName}</h2>
                <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">
                  Institution Portal: Blood Donors Registry & Emergency Outreach Services.
                </p>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </section>

            {errorMsg && (
              <div className="p-md bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-sm font-medium mb-lg">
                {errorMsg}
              </div>
            )}

            <div className="bento-grid">
              
              {/* Primary Panel: Blood Donor Registry */}
              <div className="col-span-12 lg:col-span-8 space-y-lg">
                <div id="patient-search" className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant clinic-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant pb-md mb-lg">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[26px]">volunteer_activism</span>
                        Emergency Blood Donor Registry
                      </h3>
                      <p className="font-body-sm text-on-surface-variant mt-xs">
                        Listing patients who opted in and are ready to donate blood.
                      </p>
                    </div>
                    <span className="px-sm py-xs bg-tertiary-container text-on-tertiary-container text-[11px] font-bold rounded uppercase tracking-wider">
                      {filteredDonors.length} Donors Available
                    </span>
                  </div>

                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
                    <div className="relative md:col-span-2">
                      <input 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search donors by name or city..."
                        className="w-full h-12 pl-xl pr-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    </div>

                    <div>
                      <select 
                        value={selectedBloodType}
                        onChange={(e) => setSelectedBloodType(e.target.value)}
                        className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-container-lowest text-on-surface font-body-sm"
                      >
                        <option value="All">All Blood Types</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  {/* Registry Directory */}
                  <div className="space-y-md">
                    {filteredDonors.length === 0 ? (
                      <div className="text-center py-xl border-2 border-dashed border-outline-variant rounded-lg">
                        <span className="material-symbols-outlined text-outline text-[48px] mb-xs">person_search</span>
                        <p className="font-body-md text-on-surface-variant">No active blood donors match your search filters.</p>
                      </div>
                    ) : (
                      filteredDonors.map((donor) => (
                        <div 
                          key={donor._id} 
                          className="flex flex-col md:flex-row md:items-center justify-between gap-md p-md bg-surface-container-low rounded-lg hover:scale-[1.01] transition-all border border-outline-variant/30"
                        >
                          <div className="flex items-center gap-md">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-error-container text-on-error-container flex items-center justify-center font-bold text-headline-sm">
                              {donor.patientProfile?.bloodType || 'O+'}
                            </div>
                            <div>
                              <h4 className="font-label-md text-label-md text-on-surface font-bold">{donor.name}</h4>
                              <p className="font-body-sm text-on-surface-variant">Location: {donor.city}</p>
                              <p className="text-[11px] text-on-surface-variant italic">
                                Last donation: {formatDate(donor.patientProfile?.lastDonationDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end gap-xs border-t md:border-t-0 border-outline-variant/30 pt-sm md:pt-0">
                            <a 
                              href={`tel:${donor.phone}`}
                              className="inline-flex items-center gap-xs text-primary hover:text-primary-container font-label-sm text-label-sm"
                            >
                              <span className="material-symbols-outlined text-sm">phone</span>
                              {donor.phone}
                            </a>
                            <span className="font-body-sm text-on-surface-variant text-[12px]">{donor.email}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Panel: Institution Summary */}
              <div className="col-span-12 lg:col-span-4 space-y-lg">
                <div id="profile" className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden clinic-shadow">
                  <div className="h-24 bg-tertiary relative">
                    <img 
                      alt="Institution details background" 
                      className="w-full h-full object-cover opacity-40" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKafJZJ-1qwQSv9AXk6sZy_cEi5V9otuhRUDcvDeMGTp2qvOkYOzgvJJSKxiQxi8qFt7GjcSA0gXUgs2n4b2iiSAit4UQYU_kpEET3jbFn5TjHvk0RG5b4k56iJlyLjzMKt0x6xHYMddlu6g370TuM8KSPp4N7C-fRjtfrIfN6lF-kUQzYKF69mWtWr95ceu-Rv8z1rqSN8uQ4h1dNq1GuwcPTQI18weuK6VPMuvHvuQy6cxrQUe6QteIcT3vsqyQcQC1KiDF-n-0"
                    />
                  </div>
                  
                  <div className="px-lg pb-lg">
                    <div className="-mt-12 mb-md relative inline-block">
                      <div className="h-24 w-24 rounded-lg border-4 border-surface-container-lowest overflow-hidden bg-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[48px]">domain</span>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm mb-xs">{instName}</h3>
                    <p className="font-body-sm text-primary font-semibold mb-lg">{instType} Account</p>

                    <div className="space-y-md border-t border-outline-variant pt-lg text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Registration No.</span>
                        <span className="font-body-sm text-on-surface font-semibold">{regNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Location</span>
                        <span className="font-body-sm text-on-surface">{instCity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Contact Email</span>
                        <span className="font-body-sm text-on-surface truncate max-w-[200px]">{instEmail}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Contact Phone</span>
                        <span className="font-body-sm text-on-surface">{instPhone}</span>
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

export default InstitutionDashboard;
