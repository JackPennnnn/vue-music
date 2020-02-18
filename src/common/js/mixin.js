import {mapActions, mapGetters} from 'vuex'

export const playListMixin = {
    computed:{
      ...mapGetters(['playList'])
    },
    mounted(){
        this.handlePlayList(this.playList)
    },
    activated(){
        this.handlePlayList(this.playList)
    },
    watch:{
        playList(newV){
            this.handlePlayList(newV)
        }
    },
    methods:{
        handlePlayList(playList){
        }
    }
}

export const playerMixin = {
    computed: {
      ...mapGetters([
          'favoriteList','currentSong'
      ])
    },
    methods: {
        getFavoriteIcon(currentSong){
            if(this.isFavorite(currentSong)){
                return 'icon-favorite'
            }else{
                return 'icon-not-favorite'
            }
        },
        toggleFavorite(currentSong){
            if(this.isFavorite(currentSong)){
                this.deleteFavoriteList(currentSong)
            }else{
                this.saveFavoriteList(currentSong)
            }
        },
        isFavorite(currentSong){
           const index =  this.favoriteList.findIndex((item)=>{
               return item.id === currentSong.id
           })
            return index > -1
        },
        ...mapActions([
            'saveFavoriteList','deleteFavoriteList'
        ])
    }
}