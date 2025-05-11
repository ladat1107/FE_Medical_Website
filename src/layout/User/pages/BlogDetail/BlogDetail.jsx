import Container from "@/components/Container";
import BlogRelated from "./section/BlogRelated";
import BlogDetailHeader from "./section/BlogDetailHeader";
import userService from "@/services/userService";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "@/hooks/useMutation";

const BlogDetail = () => {
    let { id } = useParams();
    let location = useLocation();
    let [listHandbook, setListHandbook] = useState([]);
    const {
        data: handbookData,
        loading: isLoadingHandbook,
        execute: getHandbookDetail,
    } = useMutation(() => userService.getHandbookDetail({ id }));
    const handbook = handbookData?.DT || {};
    useEffect(() => {
        if (id) {
            getHandbookDetail();
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location]);
    useEffect(() => {
        if (handbookData) {
            fetchHandbookList();
        }
    }, [handbookData]);

    let fetchHandbookList = async () => {
        let response = await userService.getHandbook({ tags: handbookData.DT.tags, limit: 20 });
        if (response.EC === 0) {
            setListHandbook(response.DT);
        }
    }
    return (
        <div className={'bg-white'} >
            <Container>
                <BlogDetailHeader blogDetail={handbook || {}} isLoading={isLoadingHandbook} />
                <BlogRelated listHandbook={listHandbook || []} />
            </Container>
        </div>
    )
}

export default BlogDetail;