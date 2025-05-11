

import React, { useEffect, useState } from 'react'
import HeadBlogList from './HeadBlogList';
import Container from '@/components/Container';
import BodyBlogList from './BodyBlogList';
import { useLocation, useParams } from 'react-router-dom';
import userService from '@/services/userService';
import { TAGS } from '@/constant/value';
import useQuery from '@/hooks/useQuery';


const BlogList = () => {
   let { id } = useParams();
   let location = useLocation();
   let [listHead, setListHead] = useState([]);
   const {
      data: handbookData,
   } = useQuery(() => userService.getHandbook({ tags: TAGS[2].label + "," + TAGS[4].label + "," + TAGS[5].label, limit: 100 }));
   useEffect(() => {
      if (handbookData?.DT.length > 0) {
         let _list1 = [];
         let _list2 = [];
         let _list3 = [];
         handbookData.DT.map((item) => {
            if (item.tags.includes(TAGS[2].label)) {
               _list1.push(item);
            } if (item.tags.includes(TAGS[4].label)) {
               _list2.push(item);
            } if (item.tags.includes(TAGS[5].label)) {
               _list3.push(item);
            }
         })
         if (id == TAGS[2].value) {
            setListHead(_list1)
         } else if (id == TAGS[4].value) {
            setListHead(_list2)
         } else {
            setListHead(_list3)
         }
      }
   }, [handbookData, location])
   return (

      <Container >
         {listHead?.length > 0 && <HeadBlogList
            list={listHead}
            id={id - 1} />}
         {listHead?.length > 0 &&
            <BodyBlogList
               listHandbook={listHead}
            />}

      </Container>


   )
}

export default BlogList