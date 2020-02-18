<template>
    <div class="song-list">
        <ul>
            <li v-for="(song,index) in songs" class="item" @click="selectItem(song,index)" :key="index">
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "SongList",
        props:{
            songs:{
                type:Array,
                default:[]
            }
        },
        methods:{
            getDesc(song){
                return `${song.singer} - ${song.album}`
            },
            selectItem(song,index){
                this.$emit('select',song,index)
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .song-list
        .item
            display: flex
            align-items: center
            box-sizing: border-box
            height: 64px
            font-size: $font-size-medium
        .content
            flex: 1
            line-height: 20px
            overflow: hidden

            .name
                no-wrap()
                color: white
            .desc
                no-wrap()
                margin-top: 4px
                color: gray
</style>