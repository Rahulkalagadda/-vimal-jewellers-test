import React, { useState } from 'react';

interface FilterSidebarProps {
  filters: React.ReactNode;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters }) => {
  const [open, setOpen] = useState(false);

  return (
    <aside className="filter-sidebar bg-[#fafafa] border-r border-gray-200 min-h-full">
      {/* Mobile Toggle Button */}
      <button
        className="filter-toggle md:hidden w-full py-3 px-4 bg-white border-b border-gray-200 text-left font-semibold text-[#009999] shadow-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? 'Hide Filters' : 'Show Filters'}
      </button>
      {/* Sidebar Content */}
      <div
        className={`sidebar-content px-4 py-6 md:px-6 md:py-8 ${open ? 'block' : 'hidden'} md:block`}
      >
        <div className="space-y-8">
          {filters}
        </div>
      </div>
      <style jsx>{`
        .filter-sidebar {
          width: 100%;
          max-width: 320px;
        }
        @media (min-width: 1024px) {
          .filter-sidebar {
            width: 280px;
            min-width: 260px;
            max-width: 320px;
          }
        }
      `}</style>
    </aside>
  );
};

export default FilterSidebar;
