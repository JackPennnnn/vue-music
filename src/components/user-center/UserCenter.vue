<template>
    <transition name="slide" appear>
        <div class="user-center">
            <div class="back">
                <i class="icon-back" @click="back"></i>
            </div>
            <div class="switches-wrapper">
                <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
            </div>
            <div class="play-btn" ref="playBtn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <scroll ref="favoriteList" class="list-scroll" :data="favoriteList" v-if="this.currentIndex===0">
                    <div class="list-inner">
                        <song-list :songs="favoriteList" @select="selectSong"></song-list>
                    </div>
                </scroll>
                <scroll ref="playHistory" class="list-scroll" :data="playHistory" v-else>
                    <div class="list-inner">
                        <song-list :songs="playHistory" @select="selectSong"></song-list>
                    </div>
                </scroll>
            </div>
        </div>
    </transition>
</template>

<script>
    import Switches from "../../base/switches/Switches";
    import {mapGetters,mapActions} from 'vuex'
    import SongList from "../../base/song-list/SongList";
    import Scroll from "../../base/scroll/Scroll";
    import {playerMixin} from "../../common/js/mixin";

    export default {
        name: "UserCenter",
        mixins:[playerMixin],
        components: {Switches,SongList,Scroll},
        data() {
            return {
                currentIndex: 0,
                switches: [{name: '我喜欢的'}, {name: '最近听的'}]
            }
        },
        computed: {
            ...mapGetters([
                'favoriteList','playHistory'
            ])
        },
        methods: {
            //switch派发出来的
            switchItem(index) {
                this.currentIndex = index
            },
            //song-list派发出来
            selectSong(song){
                console.log(song)
                this.insertSong(song)
            },
            //后退
            back(){
                this.$router.back()
            },
            //随机播放
            random(){
                let list =this.currentIndex ===0 ? this.favoriteList : this.playHistory
                this.randomPlay({
                    list:list
                })
            },
            handlePlayList(list){
                const bottom = list.length > 0 ? '60px' : ''
                this.$refs.listWrapper.style.bottom = bottom
                this.$refs.favoriteList && this.$refs.favoriteList.refresh()
                this.$refs.playHistory && this.$refs.playHistory.refresh()
            },
            ...mapActions([
                'insertSong','randomPlay'
            ])
        }

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .user-center
        position: fixed
        top: 0
        bottom: 0
        z-index: 100
        width: 100%
        background: $color-background

        &.slide-enter-active, &.slide-leave-active
            transition: all 0.3s

        &.slide-enter, &.slide-leave-to
            transform: translate3d(100%, 0, 0)

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

        .switches-wrapper
            margin: 10px 0 30px 0

        .play-btn
            box-sizing: border-box
            width: 135px
            padding: 7px 0
            margin: 0 auto
            text-align: center
            border: 1px solid  $color-text-l
            color: $color-text-l
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

        .list-wrapper
            position: absolute
            top: 110px
            bottom: 0
            width: 100%

            .list-scroll
                height: 100%
                overflow: hidden

                .list-inner
                    padding: 20px 30px

        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>