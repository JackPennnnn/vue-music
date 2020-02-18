<template>
    <transition name="list-fade" appear>
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click.stop="changeMode"></i>
                        <span class="text">{{toast[mode]}}</span>
                        <span class="clear" @click="clearAll"><i class="icon-clear"></i></span>
                    </h1>
                </div>
                <scroll class="list-content" :data="sequenceList" ref="listContent">
<!--                    tag代表渲染成什么  一定要加key-->
                    <transition-group name="list" tag="ul">
                    <li ref="listItem" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)" :key="item.id">
                        <i class="current" :class="getCurrentItem(item)"></i>
                        <span class="text">{{item.name}} - {{item.singer}}</span>
                        <span class="like" @click.stop="toggleFavorite(item)">
                             <i :class="getFavoriteIcon(item)" ></i>
                        </span>
                        <span class="delete" @click.stop="deleteOne(item)">
                             <i class="icon-delete"></i>
                         </span>
                    </li>
                    </transition-group>
                </scroll>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    import Scroll from "../../base/scroll/Scroll";
    import {playMode} from "../../common/js/config";
    import {xipai} from "../../common/js/util";
    import {playerMixin} from "../../common/js/mixin";

    export default {
        name: "PlayList",
        mixins:[playerMixin],
        components:{
            Scroll
        },
        data(){
            return {
                showFlag:false,
                toast:['列表播放','单曲循环','随机播放']
            }
        },
        computed:{
            ...mapGetters([
                'sequenceList','currentSong','playList','mode'
            ]),
            //模式切换图标样式
            iconMode() {
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            }
        },
        methods:{
            show(){
                this.showFlag = true
                //显示后，渲染完要重新计算
                this.$nextTick(()=>{
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                },20)
            },
            hide(){
                this.showFlag = false
            },
            //找到当前播放位置
            getCurrentItem(item){
                if(this.currentSong.id === item.id){
                    return 'icon-play'
                }
                return ''
            },
            //选中歌曲
            selectItem(item,index){
                //如果随机 要找到索引
                if(this.mode === playMode.random){
                    index = this.playList.findIndex((song)=>{
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            scrollToCurrent(current){
                const index = this.sequenceList.findIndex((song)=>{
                    return current.id === song.id
                })
                if(!this.playList.length){
                    return
                }
                this.$refs.listContent.scrollElement(this.$refs.listItem[index])
            },
            //删除一首
            deleteOne(item){
                this.deleteSong(item)
                if(!this.playList.length){
                    this.hide()
                }
            },
            //删除全部
            clearAll(){
                this.$dialog.alert({
                    title: '请确认',
                    message: '是否删除全部歌曲',
                    showCancelButton: true,
                    closeOnPopstate: true
                }).then(()=>{
                    this.deleteSongList()
                }).catch(()=>{
                    return
                })
            },
            //切换模式
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
            },
            ...mapMutations({
                setCurrentIndex: 'SET_CURRENTINDEX',
                setPlayingState : 'SET_PLAYING_STATE',
                setPlayMode: 'SET_PLAY_MODE',
                setPlayList:'SET_PLAYLIST'
            }),
            ...mapActions([
                'deleteSong','deleteSongList'
            ])
        },
        watch:{
            currentSong(newSong,oldSong){
                if(!newSong.id || !oldSong.id){
                    this.hide()
                    return;
                }

                if(!this.showFlag || newSong.id == oldSong.id){
                    return
                }

                this.scrollToCurrent(newSong)
            }
        }

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .playlist
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 200
        background-color: $color-background-d

        &.list-fade-enter-active, &.list-fade-leave-active
            transition: opacity 0.3s

            .list-wrapper
                transition: all 0.3s

        &.list-fade-enter, &.list-fade-leave-to
            opacity: 0

            .list-wrapper
                transform: translate3d(0, 100%, 0)

        &.list-fade-enter
        .list-wrapper
            position: absolute
            left: 0
            bottom: 0
            width: 100%
            background-color: $color-highlight-background

            .list-header
                position: relative
                padding: 20px 30px 10px 20px

                .title
                    display: flex
                    align-items: center

                    .icon
                        margin-right: 10px
                        font-size: 30px
                        color: $color-theme-d

                    .text
                        flex: 1
                        font-size: $font-size-medium
                        color: $color-text-l

                    .clear
                        extend-click()

                        .icon-clear
                            font-size: $font-size-medium
                            color: $color-text-d

            .list-content
                max-height: 300px
                overflow: hidden
                margin-bottom 30px
                .item
                    display: flex
                    align-items: center
                    height: 40px
                    padding: 0 30px 0 20px
                    overflow: hidden

                    &.list-enter-active, &.list-leave-active
                        transition: all 0.1s

                    &.list-enter, &.list-leave-to
                        height: 0

                    .current
                        flex: 0 0 20px
                        width: 20px
                        font-size: $font-size-small
                        color: $color-theme-d

                    .text
                        flex: 1
                        no-wrap()
                        font-size: $font-size-medium
                        color: $color-text-d

                    .like
                        extend-click()
                        margin-right: 15px
                        font-size: $font-size-small
                        color: $color-theme

                        .icon-favorite
                            color: $color-sub-theme

                    .delete
                        extend-click()
                        font-size: $font-size-small
                        color: $color-theme

            .list-close
                text-align: center
                line-height: 50px
                background: $color-background
                font-size: $font-size-medium-x
                color: $color-text-l
</style>