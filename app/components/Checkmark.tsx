import React from "react";

const Checkmark = () => {
  return (
    <div>
      <svg
        className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M16.707 5.293a1 1 0 01.083 1.32l-.083.094L8.414 15l-4.707-4.707a1 1
0 011.32-1.497l.094.083L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
        />
      </svg>
    </div>
  );
};

export default Checkmark;
