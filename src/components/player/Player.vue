<template>
    <div class="player" v-show="playList.length > 0">
        <!--        展开后的播放器-->
        <transition name="normal" appear>
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <!--                currentSong里的属性名称 就在song.js里-->
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <!--            顶部-->
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <!--            中间-->
                <div class="middle">
                    <div class="middle-l" :class="ShowCD">
                        <div class="cd-wrapper">
                            <div class="cd">
                                <img class="image" :src="currentSong.image" :class="cdRotate" @click="changShowLyric">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
<!--                    歌词位置-->
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper"  @click="changShowLyric" :class="ShowLyric">
                            <div v-if="currentLyric">
                                <p ref="lyricLine" class="text"
                                   v-for="(line,index) in currentLyric.lines"
                                   :key="index" :class="{'current':currentLineNum === index}">{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>

                <!--            底部-->
                <div class="bottom">
                    <!--                操作区域-->
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @changeTime="changeTime"></progress-bar>
                        </div>
                        <span class="time timer-r">{{format(currentSong.duration)}}</span>
                    </div>

                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="iconMode" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left" :class="iconDisable">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="iconDisable">
                            <i :class="playIcon" @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-right" :class="iconDisable">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!--        收起后的播放器-->
        <transition name="mini" appear>
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <div class="imgWrapper" ref="miniWrapper">
                        <img ref="miniImage" width="40" height="40" :src="currentSong.image" :class="cdRotate">
                    </div>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <!--                阻止冒泡  如果没则会打开大播放器 因为 父元素有个open方法-->

                    <progress-circle :current-rate="percent">
                        <i :class="miniPlayIcon" @click.stop.prevent="togglePlaying" class="icon-mini"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist" @click.stop="showPlayList"></i>
                </div>
            </div>
        </transition>
        <!--        迷你播放器的播放列表-->
        <play-list ref="playList"></play-list>
        <!--audio自带canplay error timeupdate-->
        <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updatetime" @ended="end"></audio>
    </div>

</template>

<script>
    import {mapGetters, mapMutations,mapActions} from 'vuex'
    import ProgressBar from "../../base/progress-bar/ProgressBar";
    import ProgressCircle from "../../base/progress-bar-circle/ProgressCircle";
    import {playMode} from "../../common/js/config";
    import {xipai} from "../../common/js/util";
    import {getSongLyric} from "../../api/songLyric";
    import LyricParser from 'lyric-parser'
    import Scroll from "../../base/scroll/Scroll";
    import PlayList from "../play-list/PlayList";
    import {playerMixin} from "../../common/js/mixin";

    export default {
        name: "Player",
        components: {ProgressBar, ProgressCircle,Scroll,PlayList},
        mixins:[playerMixin],
        data() {
            return {
                songReady: false,
                //当前时间
                currentTime: 0,
                percent: 0,
                //当前歌词实例
                currentLyric:null,
                //控制播放
                showLyric:false,
            //    当前歌词所在的行
                currentLineNum : 0,
                //当前歌词
                playingLyric:'',
                toast:['列表播放','单曲循环','随机播放']
            }
        },
        computed: {
            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ]),
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play'
            },
            miniPlayIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            //    唱片旋转
            cdRotate() {
                return this.playing ? 'play' : ''
            },
            iconDisable() {
                return this.songReady ? '' : 'disable'
            },
            //模式切换图标样式
            iconMode() {
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            //控制切换cd和歌词
            ShowCD(){
                return this.showLyric ? 'hide' : 'show'
            },
            ShowLyric(){
                return this.showLyric ? 'show' : 'hide'
            }

        },
        methods: {
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENTINDEX',
                setPlayMode: 'SET_PLAY_MODE',
                setPlayList:'SET_PLAYLIST'
            }),
            ...mapActions([
                'savePlayHistory'
            ]),
            //    播放器收掉
            back() {
                this.setFullScreen(false)
            },
            //    点击miniplayer 打开 大的播放器
            open() {
                this.setFullScreen(true)
            },

            // 播放和暂停音乐
            togglePlaying() {
                if(!this.songReady){
                    return
                }
                this.setPlayingState(!this.playing)
                if(this.currentLyric){
                    this.currentLyric.togglePlay()
                }

            },
            //    上一首
            prev() {
                if (!this.songReady) {
                    return
                }
                if(this.playList.length === 1){
                    this.loop()
                }else{
                    let index = this.currentIndex - 1
                    if (index === -1) {
                        index = this.playList.length - 1
                    }
                    this.setCurrentIndex(index)
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }

                this.songReady = false
            },
            //下一首
            next() {
                if (!this.songReady) {
                    return
                }
                if(this.playList.length === 1){
                    this.loop()
                }else{
                    let index = this.currentIndex + 1
                    if (index === this.playList.length) {
                        index = 0
                    }
                    this.setCurrentIndex(index)
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }

                this.songReady = false
            },
            ready() {
                //    当歌曲可以渲染在dom上 可以播放时 允许点击下一首或上一首
                this.songReady = true
                //讲歌曲放到播放历史上
                this.savePlayHistory(this.currentSong)
            },
            error() {
                this.songReady = true
            },
            //循环
            loop(){
                this.$refs.audio.currentTime = 0
                this.$refs.audio.play()
                if(this.currentLyric){
                    this.currentLyric.seek(0)
                }
            },
            //歌曲播放完
            end(){
                if(this.mode === playMode.loop){
                    this.loop()
                }else{
                    this.next()
                }
            },
            //获得audio当前时间
            updatetime(e) {
                this.currentTime = e.target.currentTime
            },
            //格式化时间戳
            format(time) {
                time = Math.floor(time)
                const minute = Math.floor(time / 60)
                let second = Math.floor(time % 60) + ''
                second = second.padStart(2, '0')
                return `${minute}:${second}`
            },
            //改变时间 从progress组件派发出来的
            changeTime(percent) {
                const currentTime = parseInt(this.currentSong.duration) * percent
                this.$refs.audio.currentTime = currentTime
                if (!this.playing) {
                    this.togglePlaying()
                }
                if(this.currentLyric){
                    this.currentLyric.seek(currentTime*1000)
                }
            },
            //改变播放模式
            changeMode(){
                const mode = (this.mode + 1) % 3
                this.setPlayMode(mode)
                let list = null
                if(mode === playMode.random){
                    list = xipai(this.sequenceList)
                }else{
                    list = this.sequenceList
                }

            //    希望切换切换播放模式时，currentSong并不会改变 所以要找到它的位置
                let index = list.findIndex((item)=>{
                    return item.id===this.currentSong.id
                })
                this.setCurrentIndex(index)
                this.setPlayList(list)
                this.$toast(this.toast[mode]);
            },
            //格式化歌词
            getLyric(){
                //获取歌词
                getSongLyric(this.currentSong.mid).then(res=>{
                    //第二个参数为 回调函数
                    this.currentLyric = new LyricParser(res.data,this.handleLyric)
                    if(this.playing){
                        this.currentLyric.play()
                    }
                }).catch(()=>{
                    this.currentLyric = null
                    this.currentLineNum = 0
                    this.playingLyric = ''
                })
            },
            handleLyric({lineNum,txt}){
                // console.log(lineNum,txt)
                this.currentLineNum = lineNum
                //如果行数大于5
                if(lineNum>5){
                    //this.$refs.lyricLine是个p标签数组  当大于5行时 用scrollElement 滑到目标位置
                    let lineEl = this.$refs.lyricLine[lineNum-5]
                    this.$refs.lyricList.scrollElement(lineEl,1000)
                }else{
                    this.$refs.lyricList.scrollElement(0,0,1000)
                }
                    this.playingLyric = txt


            },
            //是否显示歌词
            changShowLyric(){
                this.showLyric = !this.showLyric
            },
            //显示播放列表
            showPlayList(){
                this.$refs.playList.show()
            }
        },
        watch: {
            currentSong(newSong,oldSong) {
                //如果playlist没歌了 newSong 就会变成空
                if(!newSong.id){
                    return;
                }
                if(newSong.id === oldSong.id){
                    return;
                }
                if(this.currentLyric){
                    this.currentLyric.stop()
                }
                clearTimeout(this.timer)
                //等dom渲染好再调用 不然会报错
                //切换到后台 js是不会执行的  所以不会触发end()
                //songReady就不会设为true 不会下一首
                this.timer = setTimeout(() => {
                    this.$refs.audio.play()
                    this.getLyric()
                },500)
            },
            //观察状态 让audio播放或暂停音乐
            playing(newPlaying) {
                this.$nextTick(() => {
                    const audio = this.$refs.audio
                    newPlaying ? audio.play() : audio.pause()
                })

            },
            currentTime(newTime) {
                this.percent = (newTime / this.currentSong.duration) * 100
            }

        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background

            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)

            .top
                position: relative
                margin-bottom: 25px

                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50

                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)

                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text

                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text

            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0

                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%

                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        box-sizing: border-box
                        height: 100%

                        .cd
                            width: 100%
                            height: 100%
                            border-radius: 50%

                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                box-sizing: border-box
                                border-radius: 50%
                                border: 10px solid rgba(255, 255, 255, 0.1)

                            .play
                                animation: rotate 20s linear infinite

                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center

                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text-l

                .middle-r
                    position absolute
                    top 0
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden

                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center

                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium

                            &.current
                                color: $color-text

                        .pure-music
                            padding-top: 50%
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium

            .bottom
                position: absolute
                bottom: 50px
                width: 100%

                .dot-wrapper
                    text-align: center
                    font-size: 0

                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l

                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll

                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 90%
                    margin: 0px auto
                    padding: 10px 0

                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        margin:0 10px

                        &.time-l
                            text-align: left

                        &.time-r
                            text-align: right


                    .progress-bar-wrapper
                        flex: 1

                .operators
                    display: flex
                    align-items: center

                    .icon
                        flex: 1
                        color: $color-theme

                        &.disable
                            color: $color-theme-d

                        i
                            font-size: 30px

                    .i-left
                        text-align: right

                    .i-center
                        padding: 0 20px
                        text-align: center

                        i
                            font-size: 40px

                    .i-right
                        text-align: left

                    .icon-favorite
                        color: $color-sub-theme

            &.normal-enter-active, &.normal-leave-active
                transition: all 0.7s
                /*类名 顶部 和  底部*/

                .top, .bottom
                    transition: all 0.4s ease

            &.normal-enter, &.normal-leave-to
                opacity: 0

                .top
                    transform: translate3d(0, -100px, 0)

                .bottom
                    transform: translate3d(0, 100px, 0)

        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background

            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s

            &.mini-enter, &.mini-leave-to
                opacity: 0
                transform: translate3d(0, 100px, 0)

            .icon
                flex: 0 0 40px
                width: 40px
                height: 40px
                padding: 0 10px 0 20px

                .imgWrapper
                    height: 100%
                    width: 100%

                    img
                        border-radius: 50%

                        &.play
                            animation: rotate 10s linear infinite


                        &.pause
                            animation-play-state: paused



            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden

                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text

                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d

            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px

                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d

                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0
        .hide
            opacity 0
            transition all 0.8s ease
        .show
            opacity: 1;
            transition all 0.8s ease
    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>