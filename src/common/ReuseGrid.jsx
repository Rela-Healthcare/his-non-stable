import React from 'react';

const ReuseGrid = ({customName, customerDetails}) => {
  return (
    <div className="w-full flex flex-wrap p-2">
      <div className="w-full sm:w-1/3">
        <h5 className="text-[#838383] font-bold text-base font-inter">
          {customName}
        </h5>
      </div>
      <div className="w-full sm:w-1/3">
        <span className="text-black font-bold text-base">:</span>
      </div>
      <div className="w-full sm:w-1/3">
        <h5 className="text-black font-bold text-base font-inter">
          {customerDetails}
        </h5>
      </div>
    </div>
  );
};

export default ReuseGrid;
