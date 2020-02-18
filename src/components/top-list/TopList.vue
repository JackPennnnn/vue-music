<template>
    <transition name="slide" :appear="true">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from "../music-list/MusicList";
    import {mapGetters} from 'vuex'
    import {getToplistDetail} from "../../api/rank";
    import {createDisc} from "../../common/js/song";

    export default {
        name: "TopList",
        data(){
            return {
                songs:[],
                bgImage:''
            }
        },
        components:{
            MusicList
        },
        created() {
            if(!this.topList.id){
                this.$router.back()
            }
            setTimeout(()=>{
                this._getToplistDetail()
            },200)

        },
        computed:{
            ...mapGetters([
                'topList'
            ]),
            title(){
                return this.topList.topTitle
            }

        },
        methods:{
            _getToplistDetail(){
                getToplistDetail(this.topList.id,100).then(res=>{
                    if(!res.data.data){
                        return
                    }
                    this.songs = this._normalizeSongs(res.data.data);
                    this.bgImage =  this.songs[0].image
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                    if (musicData.id && musicData.album.mid) {
                        ret.push(createDisc(musicData))
                    }
                })
                return ret
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.5s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>