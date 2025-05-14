import React, { useEffect, useState } from 'react';
import useQuery from '@/hooks/useQuery';
import userService from '@/services/userService';
import { Skeleton } from 'antd';

const getItemsToShow = (list, showAll) => {
  if (showAll) return list;
  const width = window.innerWidth;
  if (width < 768) return list.slice(0, 8); // sm
  if (width < 1024) return list.slice(0, 10); // md
  return list.slice(0, 14); // lg+
};

const Specialty = () => {
  const { data: specialtyData, loading } = useQuery(() =>
    userService.getSpecialty()
  );
  const listSpecialty = specialtyData?.DT || [];
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(() =>
    getItemsToShow(listSpecialty, false)
  );

  useEffect(() => {
    const handleResize = () => {
      if (!showAll) {
        setItemsToShow(getItemsToShow(listSpecialty, false));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [listSpecialty, showAll]);

  useEffect(() => {
    setItemsToShow(getItemsToShow(listSpecialty, showAll));
  }, [showAll, listSpecialty]);

  return (
    <div className="container mx-auto px-4 pb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-secondaryText-tw mb-8 text-center">
        CHUYÊN KHOA
      </h2>

      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 14 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton.Avatar active size={80} shape="circle" />
              <Skeleton.Input
                style={{ width: 100, marginTop: 10 }}
                active
                size="small"
              />
            </div>
          ))
          : itemsToShow.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
              />
              <p className="mt-3 text-center text-gray-700 text-sm">{item.name}</p>
            </div>
          ))}
      </div>

      {!loading && listSpecialty.length > 14 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-primary-tw text-white rounded-lg hover:bg-gradient-primary transition-colors"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Hiển thị ít hơn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Specialty;
