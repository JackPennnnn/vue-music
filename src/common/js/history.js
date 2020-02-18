import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
const FAVORITE_KEY = '__favorite__'
const FAVORITE_KEY_MAX_LENGTH = 200
const HISTORY_KEY='__HISTORY__'
const HISTORY_MAX_LENGTH = 200
function insertArray(arr,val,compare,maxLen){
    const index = arr.findIndex(compare)
    if(index === 0){
        return
    }
    if(index > 0){
        arr.splice(index,1)
    }
    arr.unshift(val)
    //如果数组满了 就删掉最后一个
    if(maxLen && arr.length>maxLen){
        arr.pop()
    }
}

export function saveSearch(query) {
    /*
get(key, def) {
    if (this.disabled) {
      return def
    }
**/
    let searches = storage.get(SEARCH_KEY,[])
    insertArray(searches,query,(item)=>{
        return item === query
    },SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY,searches)
    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY,[])
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY,[])
    deleteFromArr(searches,(item)=>{
        return item === query})
    storage.set(SEARCH_KEY,searches)
    return searches
}

//删除操作
function deleteFromArr(arr,compare) {
    const index = arr.findIndex(compare)
    if(index > -1){
        arr.splice(index,1)
    }
}

//删除全部
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY,[])
    insertArray(songs,song,(item)=>{return song.id === item.id},FAVORITE_KEY_MAX_LENGTH)
    storage.set(FAVORITE_KEY,songs)
    return songs
}

export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY,[])
    deleteFromArr(songs,(item)=>{ return song.id === item.id})
    storage.set(FAVORITE_KEY,songs)
    return songs
}
//加载所有的我喜欢的歌曲
export function loadFavorite() {
    return storage.get(FAVORITE_KEY,[])
}

export function savePlay(song) {
    let songs = storage.get(HISTORY_KEY,[])
    insertArray(songs,song,(item)=>{
        return item.id===song.id
    },HISTORY_MAX_LENGTH)
    storage.set(HISTORY_KEY,songs)
    return songs
}

export function loadPlay() {
    return storage.get(HISTORY_KEY,[])
}