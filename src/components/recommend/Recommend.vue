<template>
    <div class="recommend" ref="recommend">
            <scroll class="recommend-content" :data = "discList" ref="scroll">
                <div>
                <div class="slider-wrapper" >
                    <van-swipe :autoplay="3000" :stop-propagation="false">
                        <van-swipe-item v-for="item in recommends" :key="item.id" >
                            <a :href="item.linkUrl"><img :src="item.picUrl"></a>
                        </van-swipe-item>
                    </van-swipe>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in discList" class="item" :key="item.dissid" @click="selectItem(item)">
                            <div class="icon">
                                <img v-lazy="item.imgurl" @load="loadImage" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc">{{item.dissname}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
                    <van-loading color="#1989fa" v-show="!discList.length" :size="50"/>

            </scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getRecommend,getDicscList} from "../../api/recommend";
    import Scroll from "../../base/scroll/Scroll";
    import {playListMixin} from "../../common/js/mixin";
    import {mapMutations} from 'vuex'
    export default {
        mixins:[playListMixin],
        components:{
            Scroll
        },
        data(){
            return {
                //轮播图数据
                recommends:[],
                //歌单信息
                discList:[]
            }
        },
        created() {
            this._getRecommend(),
            this._getDicscList()
        },
        methods:{
            //获取轮播图
            _getRecommend(){
                getRecommend().then(res=>{
                    res = res.data.data
                    const silder = []
                    for(let i of res){
                        const silderItem = {}
                        silderItem.id = i.id
                        silderItem.linkUrl = 'https://y.qq.com/n/yqq/album/' + i.jump_info.url + '.html'
                        silderItem.picUrl = i.pic_info.url
                        silder.push(silderItem)
                    }
                    this.recommends = silder
                })
            },
            //获取歌单列表
            _getDicscList(){
                getDicscList().then(res => {
                    this.discList = res.data.data.list
                })
            },
            loadImage(){
                if(!this.checkLoaded){
                    setTimeout(()=>{
                        this.$refs.scroll.refresh()
                    },200)
                    this.checkLoaded = true
                }
              },
            //这个来自mixin  因为小型播放器 会挡住 所以要重新计算scroll 的高度
            handlePlayList(playList){
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.recommend.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            selectItem(item){
                this.$router.push(`/recommend/${item.dissid}`)
                this.setDisc(item)
            },

            ...mapMutations({
                setDisc : 'SET_DISC'
            })
            }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .recommend
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .recommend-content
            height: 100%
            overflow: hidden
            .slider-wrapper
                position: relative
                width: 100%
                overflow: hidden
            .recommend-list
                .list-title
                    height: 65px
                    line-height: 65px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-theme
                .item
                    display: flex
                    box-sizing: border-box
                    align-items: center
                    padding: 0 20px 20px 20px
                    .icon
                        flex: 0 0 60px
                        width: 60px
                        padding-right: 20px
                    .text
                        display: flex
                        flex-direction: column
                        justify-content: center
                        flex: 1
                        line-height: 20px
                        overflow: hidden
                        font-size: $font-size-medium
                        .name
                            margin-bottom: 10px
                            color: $color-text
                        .desc
                            color: $color-text-d
            .van-loading
                position: absolute
                top: 50%
                left:50%
                transform: translate(-50%,-50%)
    .van-swipe-item
        img
            width : 100%
</style>