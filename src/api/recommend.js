import {request} from "./baseURL";

export function getRecommend() {
    return request({
        url:'/banner'
    })
}

export function getDicscList(categoryId=10000000,sortId=5,pageSize=30,page=1) {
    return request({
        url:'songList/hot',
        params:{
            categoryId:categoryId,
            sortId:sortId,
            pageSize:pageSize,
            page:page
        }
    })
}

export function getDiscSong(id) {
    return request({
        url:'/songList',
        params: {
            id:id
        }
    })
}