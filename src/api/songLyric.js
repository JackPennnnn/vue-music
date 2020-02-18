import {request} from "./baseURL";
export function getSongLyric(mid) {
    return request({
        url:'/lrc',
        params:{
            id:mid
        }
    })
}