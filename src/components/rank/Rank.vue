<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="topList" ref="scroll">
            <ul>
                <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl"/>
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList" :key="index">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <van-loading color="#1989fa" v-show="!topList.length" :size="50"/>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getTopList} from "../../api/rank";
    import Scroll from "../../base/scroll/Scroll";
    import {playListMixin} from "../../common/js/mixin";
    import {mapMutations} from 'vuex'
    export default {
        name: "Rank",
        mixins:[playListMixin],
        components:{
          Scroll
        },
        created() {
            setTimeout(()=>{
                this._getTopList()
            },500)
        },
        data(){
          return {
              topList : []
          }
        },
        methods:{
            _getTopList(){
                getTopList().then(res=>{
                    this.topList = res.data.topList
                })
            },
            handlePlayList(playList){
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            selectItem(item){
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setTopList(item)
            },
            ...mapMutations({
                setTopList:'SET_TOP_LIST'
            })
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .rank
        position: fixed
        width: 100%
        top: 88px
        bottom: 0

        .toplist
            height: 100%
            overflow: hidden

            .item
                display: flex
                margin: 0 20px
                padding-top: 20px
                height: 100px

                &:last-child
                    padding-bottom: 20px

                .icon
                    flex: 0 0 100px
                    width: 100px
                    height: 100px

                .songlist
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    padding: 0 20px
                    height: 100px
                    overflow: hidden
                    background: $color-highlight-background
                    color: $color-text-d
                    font-size: $font-size-small

                    .song
                        no-wrap()
                        line-height: 26px
        .van-loading
            position: absolute
            top: 50%
            left:50%
            transform: translate(-50%,-50%)
</style>