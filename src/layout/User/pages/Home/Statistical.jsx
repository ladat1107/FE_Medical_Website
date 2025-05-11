

import React from 'react'
const Statistical = () => {
   return (
      <>
         <h3 className="uppercase text-center text-secondaryText-tw font-bold text-3xl" >Thống kê</h3>
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 !bg-white rounded-2xl p-4 my-10">
            {Array.from({ length: 6 }).map((_, index) => (
               <div className="flex flex-col items-center justify-center p-8" key={index} >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" >
                     <img src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2F2b42e50c-ad0f-4dcb-a45f-8e3c16f1e093-luotdatkham.png&w=1920&q=75" alt="" />
                  </div>
                  <div className='flex flex-col items-center justify-center text-center' >
                     <span className='text-2xl font-bold text-secondaryText-tw'>3.0M+</span>
                     <span className='text-sm text-gray-500'>Lượt khám</span>
                  </div>
               </div>
            ))}
         </div>
      </>
   )
}

export default Statistical