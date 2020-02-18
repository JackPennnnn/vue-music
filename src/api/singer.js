import jsonp from "../common/js/jsonp";
import {request} from "./baseURL";

export function getSingerList () {
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
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    })
    return jsonp(url, data, options)
}

export function getSingerDetail(id,pageSize=100) {
    return request({
        url:'/song/artist',
        params:{
            id:id,
            pageSize:pageSize
        }
    })
}