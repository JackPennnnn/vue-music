<template>
    <transition name="slide" :appear="true">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from "../music-list/MusicList";
    import {mapGetters} from 'vuex'
    import {getDiscSong} from "../../api/recommend";
    import {createDisc} from "../../common/js/song";

    export default {
        name: "Disc",
        data() {
            return {
                songs: []
            }
        },
        computed: {
            title() {
                return this.disc.dissname
            },
            bgImage() {
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        created() {
            this._getDiscSong()
        },
        methods: {
            _getDiscSong() {
                if(!this.disc.dissid){
                    this.$router.push('/recommend')
                }
                getDiscSong(this.disc.dissid).then(res => {
                    this.songs = this._normalizeSongs(res.data.data[0].songlist)
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
        },

        components: {
            MusicList
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.5s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>