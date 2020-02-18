

class Song {
    /*
        album:歌曲专辑
        duration:歌曲长度
        url:歌曲路径
    * */
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

}

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `https://v1.itooi.cn/tencent/url?id=${musicData.songmid}&quality=flac`
    })
}

export function createDisc(musicData) {
    return new Song({
        id: musicData.id || musicData.songid,
        mid: musicData.mid || musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.title || musicData.songname,
        album: musicData.album.name || musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
        url: `https://v1.itooi.cn/tencent/url?id=${musicData.mid}&quality=flac`
    })
}

export function createSearchSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `https://v1.itooi.cn/tencent/url?id=${musicData.songmid}&quality=flac`
    })
}

//万一出现有两个歌手['a','b']
/*
*  {name: "薛之谦", mid: "002J4UUk29y8BY", id: 5062}
{name: "刘惜君", mid: "003x77MM2iIg6c", id: 4674}*/
function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach(item => {
        ret.push(item.name)
    })

    return ret.join('/')
}