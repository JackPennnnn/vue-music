<template>
    <div class="singer" ref="singer">
        <list-view :data="singers" @select="selectSinger" ref="listSinger"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getSingerList} from "../../api/singer";
    import Singer from "../../common/js/singer";
    import ListView from "../../base/listView/ListView";
    import {mapMutations} from 'vuex'
    import {playListMixin} from "../../common/js/mixin";

    export default {
        mixins:[playListMixin],
        name: "Singer",
        components: {ListView},
        data(){
          return{
            singers:[]
          }
        },
        created() {
            this._getSingerList()
        },
        methods:{
            //获取歌手数据
            _getSingerList(){
                getSingerList().then(res=>{
                    this.singers = res.data.list
                    this.singers = this._normalizeSinger(this.singers)
                })
            },
            //歌手分类
            _normalizeSinger(list){
                let map = {
                    //热门歌手
                    hot:{
                        title:'热门',
                        items : []
                    }
                }
                list.forEach((item,index) => {
                    //规定前10个为热门歌手
                    if(index < 10){
                        map.hot.items.push(new Singer({
                            id : item.Fsinger_mid,
                            name : item.Fsinger_name
                        }))
                    }
                    //姓氏拼音
                    const key = item.Findex
                    if(!map[key]){
                        map[key] = {
                            title:key,
                            items:[]
                        }
                    }else {
                        map[key].items.push((new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        })))
                    }
                })

                //为了得到有序列表，我们需要处理map
                //热门歌手
                let hot = []
                //歌手字母分类
                let ret = []
                for(let key in map){
                    let val = map[key]
                    if(val.title.match(/[a-zA-Z]/)){
                        ret.push(val)
                    }else if(val.title === '热门'){
                        hot.push(val)
                    }
                    //排序 根据title 字母  charCodeAt(index)  将第index+1位个字母转换成unicode
                    ret.sort((a,b)=>{
                        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                    })
                }
                return hot.concat(ret)
            },
            //跳转
            selectSinger(item){
                this.$router.push({
                    path:`/singer/${item.id}`
                })
                this.setSinger(item)
            },
            //这个来自mixin  因为小型播放器 会挡住 所以要重新计算
            handlePlayList(playList){
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.listSinger.refresh()

            },
            ...mapMutations({
                setSinger : 'SET_SINGER'
            })

        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
</style>