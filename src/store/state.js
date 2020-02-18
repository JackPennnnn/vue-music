import {playMode} from "../common/js/config";
import {loadSearch} from "../common/js/history";
import {loadFavorite} from "../common/js/history";
import {loadPlay} from "../common/js/history";

const state = {
    singer:{},
    //是否播放
    playing:false,
    //是否全屏
    fullScreen:false,
    //歌曲列表
    playList:[],
    //顺序歌曲列表,tips:当随机播放时  playList 跟 sequenceList不一样
    sequenceList:[],
    //播放模式
    mode:playMode.sequence,
    //当前播放歌曲位置
    currentIndex : -1,
    //歌单
    disc:{},
    //排行榜
    topList:{},
    //搜索历史
    searchHistory:loadSearch(),
    //收藏列表
    favoriteList:loadFavorite(),
    //播放历史
    playHistory:loadPlay()
}

export default state