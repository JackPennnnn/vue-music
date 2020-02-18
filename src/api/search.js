import {request} from "./baseURL";
import jsonp from "../common/js/jsonp";
export function getHotKey () {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const commonParams = {
        g_tk: 1928093487,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp'
    }
    const options = {
        param: 'jsonpCallback',
        prefix: 'jp'
    }
    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    })

    return jsonp(url, data, options)
}

export function searchSong(keyword,pageNum=1,pageSize=30) {
    return request({
        url:'/search',
        params:{
            keyword:keyword,
            pageSize:pageSize,
            page:pageNum,
            type:'song'
        }
    })
}