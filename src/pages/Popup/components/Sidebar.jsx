import React, { useEffect, useRef } from 'react';

function Sidebar({ isOpen, onClose, openButtonRef }) {
  const sidebarRef = useRef(null); // 新增的 ref
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        openButtonRef.current &&
        !openButtonRef.current.contains(event.target) &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-[460px] w-64 bg-white border-r ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transform transition-transform duration-300 ease-in-out overflow-y-auto sidebar z-50`}
    >
      {/* 内容 */}
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={onClose}
      >
        Close
      </button>
      {/* 你的侧拉抽屉内容 */}
    </div>
  );
}

export default Sidebar;
