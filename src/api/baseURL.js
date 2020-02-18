import axios from 'axios'
export function request(config) {
    const instance = axios.create({
        baseURL:'https://v1.itooi.cn/tencent',
        timeout:10000
    })
    return instance(config)
}