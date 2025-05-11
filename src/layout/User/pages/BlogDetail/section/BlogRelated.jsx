

import React from 'react'
import { HandbookSwiper } from "@/components/Swiper";


const BlogRelated = (props) => {
  let { listHandbook } = props;
  return (
    <div className='mt-16'>
      <div className="flex justify-between items-center gap-3" >
        <span className="w-full block h-[2px] bg-primary-tw"></span>
        <h3 className="text-2xl font-bold whitespace-nowrap">BÀI VIẾT LIÊN QUAN</h3>
        <span className="w-full block h-[2px] bg-primary-tw"></span>
      </div>
      <HandbookSwiper handbookList={listHandbook} />
    </div>
  )
}

export default BlogRelated;