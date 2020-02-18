<template>
    <transition name="slide" :appear="true">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" ></music-list>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {getSingerDetail} from "../../api/singer";
    import {createSong} from "../../common/js/song";
    import MusicList from "../music-list/MusicList";
    export default {
        name: "singer-detail",
        components: {MusicList},
        data(){
            return {
                songs:[]
            }
        },
        computed:{
            ...mapGetters([
                'singer'
            ]),
            title(){
              return this.singer.name
            },
            bgImage(){
                return this.singer.avatar
            }
        },
        created() {
            this._getDetail()
        },
        methods:{
            //获取singer详情
            _getDetail(){
                if(!this.singer.id){
                    this.$router.push('/singer')
                }
                getSingerDetail(this.singer.id).then(res=>{
                    this.songs = this._normalizeSongs(res.data.data)
                })
            },
            _normalizeSongs(list){
                let ret = []
                list.forEach((item)=>{

                    let {musicData} = item
                    if(musicData.songid && musicData.albummid){
                        ret.push(createSong(musicData))
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