<template>
    <scroll class="listview" :data="data" ref="listView"
            :listenScroll="listenScroll" @scroll="scroll"
            :probe-type="probeType"
    >
<!--        歌手列表-->
        <ul>
            <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" :key="item.id"
                        class="list-group-item" @click="selectItem(item)">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
<!--        右边侧边栏导航列表-->
        <div class="list-shortcut" @touchmove.stop="onShortcutTouchMove">
            <ul>
                <li v-for="(item,index) in shortcutList" class="item"
                    :class="{'current' : currentIndex == index}" :key="index"
                    @touchstart.stop="onShortcutTouchStart($event,index)"  >
                    {{item}}
                </li>
            </ul>
        </div>

        <div class="list-fixed" v-show="fixedTitle">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <van-loading color="#1989fa" v-show="!data.length" :size="50"/>
    </scroll>

</template>

<script>
    import Scroll from "../scroll/Scroll";

    export default {
        created() {
            this.touch = {}
            this.listHeight = []
        },
        data(){
            return {
                listenScroll: true,
                probeType:3,
                //滚动位置
                scrollY:-1,
                //当前位置
                currentIndex:0
            }
        },
        name: "ListView",
        components:{
            Scroll
        },
        computed:{
            //获取字母
          shortcutList(){
              return this.data.map((group)=>{
                  return group.title.substr(0,1)
              })
          },
            fixedTitle(){
              if(this.scrollY > 0){
                  return ''
              }
              return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        props:{
            data:{
                type:Array,
                default:[]
            }
        },
        methods:{
            //有bug  当鼠标点击两次才能高亮  不知道是不是冒泡问题
            onShortcutTouchStart(e,index){
                this.currentIndex = index
                if(!index && index===0){
                    return
                }
                this.$refs.listView.scrollElement(this.$refs.listGroup[index])
                //记录第一次的index 跟 pageY
                let firstTouch = e.touches[0]
                this.touch.beginIndex = index
                this.touch.y1 = firstTouch.pageY

            },
            //有bug  当按住鼠标离开右边侧栏会报错
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0]
                //获取偏移时的pageY
                this.touch.y2 = firstTouch.pageY
                let beginIndex = this.touch.beginIndex
                //这样会得出相差多少个字母，再用第一个字母 +  相差的  就会滑到目标
                let delta = Math.floor((this.touch.y2- this.touch.y1)/18) //18是字母高度

                let endIndex = beginIndex + delta
                if(!this.$refs.listGroup[endIndex]){
                    return
                }

                this.$refs.listView.scrollElement(this.$refs.listGroup[endIndex])
                this.currentIndex = endIndex

            },
            scroll(position){
                this.scrollY = position.y
            },
            //计算每个分组的高度
            calculatHeigh(){
                this.listHeight = []
                const list  = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                for(let i=0;i<list.length;i++){
                    let item = list[i]
                    //clientHeight自身高度
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            selectItem(item){
                this.$emit('select',item)
            },
            refresh(){
                this.$refs.listView.refresh()
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this.calculatHeigh()
                },20)
            },
            scrollY(newY){
                //当一开始拉上的时候newY会大于0
                if(newY >=0){
                    this.currentIndex = 0;
                    return
                }
                const listHeight = this.listHeight
                for(let i = 0;i<listHeight.length;i++){
                    let height1 = listHeight[i]
                    let height2 = listHeight[i+1]
                    //当height2不是最后一个  或者  处于height1 和 height2区间时
                    if(!height2 || (-newY>height1 && -newY<height2)){
                        this.currentIndex = i
                        return
                    }
                }

            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme
        .list-fixed
            position: absolute
            top: 0
            left: 0
            width: 100%
            .fixed-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
        .van-loading
            position: absolute
            top: 50%
            left:50%
            transform: translate(-50%,-50%)
</style>