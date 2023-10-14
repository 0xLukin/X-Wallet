import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import { SlidersSVG } from '../assets/svg/exportSvg';

export default function SidebarButton() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openButtonRef = useRef(null);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-6 h-6">
      <button onClick={openSidebar} ref={openButtonRef}>
        <div>
          <SlidersSVG />
        </div>
      </button>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        openButtonRef={openButtonRef}
      />
    </div>
  );
}
