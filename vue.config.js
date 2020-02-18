const path = require('path');//引入path模块
const axios = require('axios')
function resolve(dir) {
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/vue_music/' : '/',
    chainWebpack:(config)=>{
        config.resolve.alias
        //第一个参数：别名 第二个参数：路径
            .set('common',resolve('src/common'))
    },
    devServer: {
        before(app) {
        }
    }
}


