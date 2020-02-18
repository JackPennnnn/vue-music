<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>

        <!--        热门搜索-->
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll class="shortcut" :data="shortcut" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="deleteAll">
                            <i class="icon-clear"></i>
                        </span>
                        </h1>
                        <history-list :searches="searchHistory" @select="addQuery"
                                      @deleteOne="deleteOne"></history-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest :query="query" @listScrollStart="ScrollStart" @select="saveSearch" ref="suggest"></suggest>
        </div>
    </div>
</template>

<script>
    import SearchBox from "../../base/search-box/SearchBox";
    import {getHotKey} from "../../api/search";
    import Suggest from "../suggest/Suggest";
    import {mapActions} from 'vuex'
    import {mapGetters} from 'vuex'
    import HistoryList from "../history-list/HistoryList";
    import Scroll from "../../base/scroll/Scroll";
    import {playListMixin} from "../../common/js/mixin";

    export default {
        name: "Search",
        mixins:[playListMixin],
        components: {SearchBox, Suggest, HistoryList, Scroll},
        computed: {
            ...mapGetters([
                'searchHistory'
            ]),
            //这个用来重新计算better-scroll 因为要传热门搜索 还有 历史搜索
            shortcut(){
                return this.hotKey.concat(this.searchHistory)
            }
        },
        created() {
            this._getHotKey()
        },
        data() {
            return {
                hotKey: [],
                query: ''
            }
        },
        methods: {

            _getHotKey() {
                getHotKey().then(res => {
                    this.hotKey = res.data.hotkey.slice(0, 10);
                })
            },
            //添加到搜索框里
            addQuery(item) {
                this.$refs.searchBox.setQuery(item)
            },
            //searchbox 监听到query改变 派发出来的
            onQueryChange(query) {
                this.query = query
            },
            ScrollStart() {
                this.$refs.searchBox.blur()
            },
            //保存搜索
            saveSearch() {
                this.saveSearchHistory(this.query)
            },
            deleteOne(item) {
                this.deleteSearchHistory(item)
            },
            //删除所有搜索历史
            deleteAll() {
                this.$dialog.alert({
                    title: '请确认',
                    message: '是否删除全部历史',
                    showCancelButton: true,
                    closeOnPopstate: true
                }).then(() => {
                    this.clearSearchHistory()
                }).catch(() => {
                    return
                });

            },
            //这个来自mixin  因为小型播放器 会挡住 所以要重新计算scroll 的高度
            handlePlayList(playList){
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
                this.$refs.suggest.refresh()
            },
            ...mapActions([
                'saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'
            ])

        },
        watch:{
            query(newQuery){
                if(!newQuery){
                    setTimeout(()=>{
                        this.$refs.shortcut.refresh()
                    },20)
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .search
        .search-box-wrapper
            margin: 20px

        .shortcut-wrapper
            position: fixed
            top: 178px
            bottom: 0
            width: 100%

            .shortcut
                height: 100%
                overflow: hidden

                .hot-key
                    margin: 0 20px 20px 20px

                    .title
                        margin-bottom: 20px
                        font-size: $font-size-medium
                        color: $color-text-l

                    .item
                        display: inline-block
                        padding: 5px 10px
                        margin: 0 20px 10px 0
                        border-radius: 6px
                        background: $color-highlight-background
                        font-size: $font-size-medium
                        color: $color-text-d

                .search-history
                    position: relative
                    margin: 0 20px

                    .title
                        display: flex
                        align-items: center
                        height: 40px
                        font-size: $font-size-medium
                        color: $color-text-l

                        .text
                            flex: 1

                        .clear
                            extend-click()

                            .icon-clear
                                font-size: $font-size-medium
                                color: $color-text-d

        .search-result
            position: fixed
            width: 100%
            top: 178px
            bottom: 0
</style>