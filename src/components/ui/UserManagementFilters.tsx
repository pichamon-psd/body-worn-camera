import { Search, Filter, X, ChevronDown } from 'lucide-react';

interface UserManagementFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterRole: string;
  setFilterRole: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  onReset: () => void;
  translations: Record<string, string>;
  darkMode: boolean;
}

export function UserManagementFilters({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  onReset,
  translations,
  darkMode
}: UserManagementFiltersProps) {
  return (
    <div className={`rounded-xl shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Search */}
        <div className="lg:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {translations.search}
          </label>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'
              } focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`}
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {translations.filterByRole}
          </label>
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'
              } focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}
            >
              <option value="all">{translations.allRoles}</option>
              <option value="high">{translations.roleHigh}</option>
              <option value="medium">{translations.roleMedium}</option>
              <option value="low">{translations.roleLow}</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {translations.filterByStatus}
          </label>
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'
              } focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}
            >
              <option value="all">{translations.allStatuses}</option>
              <option value="active">{translations.active}</option>
              <option value="inactive">{translations.inactive}</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className={`w-full px-6 py-2.5 rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
            {translations.reset}
          </button>
        </div>
        
      </div>
    </div>
  );
}