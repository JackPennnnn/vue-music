import jsonp from "../common/js/jsonp";
import {request} from "./baseURL";

export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
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

export function getToplistDetail(id,pageSize = 30) {
    return request({
        url:'/topList',
        params:{
            id:id,
            pageSize:pageSize
        }
    })
}