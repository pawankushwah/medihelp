import React from 'react';

const TopAppBar = ({ onSearchChange, searchPlaceholder = "Search records..." }) => {
  const role = localStorage.getItem('role') || 'patient';

  // Get avatar image based on role
  const getAvatarUrl = () => {
    if (role === 'doctor') {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuASj_Sy_jI-Qx3JMnDmGbus_Iudj7PJSCM894vIlAJLPcJ_uSkTVpH2v4fks_EF2SYWE1dq7496bTNg6lVz3RDQFJ-rpfhipH3JmGsirgf45bqZCWt1QmKmoxhtdnUBeghmohQExDknsZ0aCkdZG4Rl_mO_gHsgwiSCVgk4NfZVV2vpd2sjeQWb5Z0F5kyqVh8jInV2Xo-8o2E5j46Z9RmuPxBnIm-7RBbDGJ1AtQyi_azkPR8KGc6i04mraRx1GvKawSjYdWd6BvU";
    }
    if (role === 'institution') {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDYMp-ky5pjVpcfRFZ4IMKWkd17FxYA9fM8LhLyi828PiYuimTiWcCyM3IeTrtmkVc7dOXcu3ePHgvA18ITJGM8CoyjXlJXKPL4EGlZS2oozk-UUgm63RcofFmTjwK3senAxl7ei9bz8xPuWdYfR5XbVCDWpAFUBiAy3AiyWTX8Hr8_mDxrHHXZtnghmSKij50I0xOBH3tlObTeFJ4_JnTyQPTRlHnF35jBBmYrtCtYTS_K0ru4us0409jZtOWGVa80juz3Ppxmrmw";
    }
    // Patient
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuBXUXX-tsNe4FrlMVt_FD9lWMQl67zv4Yju0cq1LLyK_tUNHOKSndQl_lPLDdfDLpRQWclIdcqGZ6R7tCOc9DzFGwfwQipDBUQj-4ffICgYreSiT62ARCsV4sQxC7v92nj_jx_8tCejycb2GZVXU1uc1BM3rzQR_UUFPQTVYvDQqI23oQFK9q6F93_9WODZLTYVnrQ8urGMq_ThcTrKOXlxJ5MJXZByMlOFu-Pejlmw2QA8YpWkyUd5-ExzMyYWjwB4QLWycwAA2wg";
  };

  const getRoleBadge = () => {
    if (role === 'doctor') {
      return <span className="px-sm py-xs bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase tracking-wider">Doctor Role</span>;
    }
    if (role === 'institution') {
      return <span className="px-sm py-xs bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded uppercase tracking-wider">Institution Role</span>;
    }
    return <span className="px-sm py-xs bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded uppercase tracking-wider">Patient Role</span>;
  };

  return (
    <header className="flex justify-between items-center w-full h-16 pl-16 pr-gutter md:px-gutter md:max-w-[calc(100%-16rem)] fixed top-0 bg-surface border-b border-outline-variant z-40 bg-surface-container-lowest">
      <div className="flex items-center gap-md">
        <span className="font-headline-sm text-headline-sm font-bold text-primary hidden sm:inline">Medihelp</span>
        {getRoleBadge()}
      </div>

      <div className="flex items-center gap-lg">
        {onSearchChange && (
          <div className="relative hidden lg:block">
            <input
              onChange={onSearchChange}
              className="bg-surface-container-low border border-outline-variant rounded-full py-xs px-xl text-body-sm w-64 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200"
              placeholder={searchPlaceholder}
              type="text"
            />
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          </div>
        )}

        <div className="flex items-center gap-md text-on-surface-variant">
          <span className="font-label-md text-label-md hover:text-primary cursor-pointer transition-colors hidden sm:inline">Support</span>
          <button className="material-symbols-outlined hover:text-primary transition-colors hidden sm:inline">notifications</button>
          <button className="material-symbols-outlined hover:text-primary transition-colors hidden sm:inline">help</button>

          <div className="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src={getAvatarUrl()}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
