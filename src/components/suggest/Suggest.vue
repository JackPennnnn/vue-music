<template>
    <scroll class="suggest" :data="result" :pull-up="true"
            @scrollToEnd="searchMore" ref="suggest"
            :before-scroll="true" @beforeScroll="listScrollStart">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i class="icon-music"></i>
                </div>
                <div class="name">
                    <p class="text">{{item.name}}-{{item.singer}}</p>
                </div>
            </li>
        </ul>
        <van-loading color="#1989fa" v-show="isShowLoading" class="loading" />
    </scroll>
</template>

<script>
    import {searchSong} from "../../api/search";
    import {createSearchSong} from "../../common/js/song";
    import Scroll from "../../base/scroll/Scroll";
    import {mapActions} from 'vuex'
    export default {
        name: "Suggest",
        components:{
            Scroll
        },
        data() {
            return {
                page: 0,
                //搜索出来的数据
                result: [],
                hasMore : true,
                isShowLoading:false
            }
        },
        props: {
            query: {
                type: String,
                default: ''
            }

        },
        methods: {
            //向服务器获取
            _searchSong() {
                //当query改变时  要重新设置
                this.page = 1
                this.$refs.suggest.scrollTo(0,0)
                this.hasMore = true
                if(!this.query){
                    return
                }
                searchSong(this.query, this.page).then(res => {
                    this.result = this._normalizeSongs(res.data.data.list)
                    if(!this.result.length){
                        this.$toast({
                            message:'抱歉，暂无搜索结果',
                            icon:'cross'
                        })
                    }
                    this._checkMore(res.data.data)
                })
            },
            _normalizeSongs(list){
                let ret = []
                list.forEach((musicData)=>{
                    if(musicData.songid && musicData.albumid){
                        ret.push(createSearchSong(musicData))
                    }
                })
                return ret
            },
            _checkMore(data){
                if(!data.list.length || (data.curnum + data.curpage * 30) >= data.totalnum){
                    this.hasMore = false
                }
            },
            //上啦加载更多
            searchMore(){
                this.isShowLoading = true
                if(!this.hasMore){
                    this.isShowLoading = false
                    return
                }
                this.page++
                searchSong(this.query,this.page).then(res=>{
                    this.result.push(...this._normalizeSongs(res.data.data.list))
                    this._checkMore(res.data.data)
                    this.isShowLoading=false
                })
            },
        //    选中
            selectItem(item){
                this.insertSong(item)
                this.$emit('select')
            },
            //开始触摸scroll
            listScrollStart(){
                this.$emit('listScrollStart')
            },
            refresh(){
                this.$refs.suggest.refresh()
            },
            ...mapActions([
                'insertSong'
                ])
        },

        watch: {
            query() {
                this._searchSong()
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .suggest
        height: 100%
        overflow: hidden

        .suggest-list
            padding: 0 30px

            .suggest-item
                display: flex
                align-items: center
                padding-bottom: 20px

            .icon
                flex: 0 0 30px
                width: 30px

                .icon-music
                    font-size: 14px
                    color: $color-text-d

            .name
                flex: 1
                font-size: $font-size-medium
                color: $color-text-d
                overflow: hidden

                .text
                    no-wrap()

        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)

        .loading{
            position absolute
            bottom 0
            left 50%
            transform translateX(-50%)
        }
</style>