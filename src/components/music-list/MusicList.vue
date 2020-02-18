<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImg">
            <div class="play-wrapper">
                <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="Layer"></div>
        <scroll :data="songs"  @scroll="scroll" class="list" ref="list" :probe-type="3" :listen-scroll="true">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem"></song-list>
            </div>
            <van-loading color="#1989fa" v-show="!songs.length" :size="50"/>
        </scroll>
    </div>
</template>

<script>
    import SongList from "../../base/song-list/SongList";
    import Scroll from "../../base/scroll/Scroll";
    import {playListMixin} from "../../common/js/mixin";
    import {mapActions} from 'vuex'
    export default {
        mixins:[playListMixin],
        name: "MusicList",
        components: {Scroll,SongList},
        data(){
          return {
              scrollY:0
          }
        },
        props:{
            bgImage:{
                type:String,
                default:''
            },
            songs:{
                type:Array,
                default: []
            },
            title:{
                type:String,
                default:''
            }
        },
        computed:{
            bgStyle(){
                return `background-image:url(${this.bgImage})`
            }
        },
        mounted() {
            this.imageHeight = this.$refs.bgImg.clientHeight
            //Layer的滑动距离 不能大于背景图片高度
            this.maxTransLateY = -this.imageHeight
            //scroll离顶部距离等于背景图的高
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods:{
            scroll(position){
                this.scrollY = position.y
            },
            //点击返回键
            back(){
                this.$router.back()
            },
            selectItem(item,index){
                this.selectPlay({
                    list:this.songs,
                    index:index
                })
            },
            //点击随机播放按钮
            random(){
                this.randomPlay({list:this.songs})
            },
            //这个来自mixin  因为小型播放器 会挡住 所以要重新计算scroll 的高度
            handlePlayList(playList){
              const bottom = playList.length > 0 ? '60px' : ''
              this.$refs.list.$el.style.bottom = bottom
                this.$refs.list.refresh()
            },
            ...mapActions([
                'selectPlay','randomPlay'
            ])
        },
        watch:{
            scrollY(newY){
                let translateY =  Math.max( this.maxTransLateY + 40,newY)//返回这组数据的最大值 this.maxTransLateY是负数
                let zIndex = 0
                let scale = 1
                if(newY > 0){
                    scale += Math.abs(newY / this.maxTransLateY)
                    zIndex = 10
                }
                this.$refs.Layer.style.transform =`translate3d(0,${translateY}px,0)`
                this.$refs.Layer.style.webkitTransform =`translate3d(0,${translateY}px,0)`

                if(newY < this.maxTransLateY){
                    zIndex = 10
                    this.$refs.bgImg.style.paddingTop = 0
                    this.$refs.bgImg.style.height = '40px'
                    this.$refs.playBtn.style.display = 'none'
                }else{
                    this.$refs.bgImg.style.paddingTop = '70%'
                    this.$refs.bgImg.style.height = 0
                    this.$refs.playBtn.style.display = 'block'
                }
                this.$refs.bgImg.style.transform =`scale(${scale})`
                this.$refs.bgImg.style.webkitTransform =`scale(${scale})`
                this.$refs.bgImg.style.zIndex = zIndex
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .music-list
        position: fixed
        z-index: 100
        top: 0
        left: 0
        bottom: 0
        right: 0
        background: $color-background
    .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
            display: block
            padding: 10px
            font-size: $font-size-large-x
            color: $color-theme
    .title
        position: absolute
        top: 0
        left: 10%
        z-index: 40
        width: 80%
        no-wrap()
        text-align: center
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
    .bg-image
        position: relative
        width: 100%
        height: 0
        padding-top: 70%
        transform-origin: top
        background-size: cover
        .play-wrapper
            position: absolute
            bottom: 20px
            z-index: 50
            width: 100%
            .play
                box-sizing: border-box
                width: 135px
                padding: 7px 0
                margin: 0 auto
                text-align: center
                border: 1px solid $color-theme
                color: $color-theme
                border-radius: 100px
                font-size: 0
                .icon-play
                    display: inline-block
                    vertical-align: middle
                    margin-right: 6px
                    font-size: $font-size-medium-x
                .text
                    display: inline-block
                    vertical-align: middle
                    font-size: $font-size-small
        .filter
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            background: rgba(7, 17, 27, 0.4)
    .bg-layer
        position: relative
        height: 100%
        background: $color-background
    .list
        position: absolute
        top: 0
        bottom: 0
        width: 100%
        background: $color-background
        .song-list-wrapper
            padding: 20px 30px
    .van-loading
        position: absolute
        top: 50%
        left:50%
        transform: translate(-50%,-50%)
</style>
