<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input ref="query"  class="box" placeholder="搜索歌曲、歌手" v-model="query" />
        <i class="icon-dismiss" v-show="query" @click="clear"></i>
    </div>
</template>

<script>
    import {debounce} from "../../common/js/util";

    export default {
        name: "SearchBox",
        data(){
            return {
                query:''
            }
        },
        methods:{
            //清空搜索
            clear(){
                this.query = ''
            },
            //设置搜索字
            setQuery(query){
                this.query = query
            },
            blur(){
                this.$refs.query.blur()
            }
        },
        created() {
            //防抖
            this.$watch('query',debounce((newQuery)=>{
                this.$emit('query',newQuery)
            },200))
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .search-box
        display: flex
        align-items: center
        box-sizing: border-box
        width: 100%
        padding: 0 6px
        height: 40px
        background: $color-highlight-background
        border-radius: 6px
        .icon-search
            font-size: 24px
            color: $color-background
        .box
            flex: 1
            margin: 0 5px
            line-height: 18px
            background: $color-highlight-background
            color: $color-text
            font-size: $font-size-medium
            outline: 0
            &::placeholder
                color: $color-text-d
        .icon-dismiss
            font-size: 16px
            color: $color-background
</style>