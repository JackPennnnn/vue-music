<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
    import BScroll from '@better-scroll/core'
    export default {
        name: "Scroll",
        props:{
            //数字代表滚动事件
            /*
            * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
            * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
            * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。*/
            probeType:{
                type:Number,
                default:1
            },
            //etterScroll 默认会阻止浏览器的原生 click 事件。
            // 当设置为 true，BetterScroll 会派发一个 click 事件，
            // 我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
            click:{
                type:Boolean,
                default: true
            },
            data:{
                type:Array,
                default:null
            },
            //让Scroll 监听滚动事件
            listenScroll : {
                tyoe:Boolean,
                default:false
            },
            //是否上啦刷新
            pullUp:{
                type:Boolean,
                default:false
            },
            beforeScroll:{
                type:Boolean,
                default:false
            }
        },
        mounted() {
            setTimeout(() => {
                this._initScroll()
            },20)
        },
        methods: {
            _initScroll() {
                if (!this.$refs.wrapper) {
                    return
                }
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    pullUpLoad: this.pullUp
                })
                if (this.listenScroll) {
                    let _this = this
                    this.scroll.on('scroll', (position) => {
                        _this.$emit('scroll', position)
                    })
                }

                //判断是否上啦刷新
                if (this.pullUp) {
                    this.scroll.on('scrollEnd', () => {
                        if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                            this.$emit('scrollToEnd')
                        }
                    })
                }
                //判断一开始接触
                if(this.beforeScroll){
                    this.scroll.on('beforeScrollStart',()=>{
                        this.$emit('beforeScroll')
                    })
                }
            },
            //方法代理
            enable() {
                this.scroll && this.scroll.enable()
            },
            disable() {
                this.scroll && this.scroll.disable()
            },
            refresh() {
                this.scroll && this.scroll.refresh()
            },
            scrollTo() {
                this.scroll && this.scroll.scrollTo(arguments)
            },
            scrollElement(el) {
                //scrollToElement(el, time, offsetX, offsetY, easing)
                /*
                * 参数：
                    {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
                    {Number} time 滚动动画执行的时长（单位 ms）
                    {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
                    {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
                    {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
                    * */
                this.scroll && this.scroll.scrollToElement(el)
            }


        },
        watch:{
            data(){
                setTimeout(() => {
                    this.refresh()
                },20)
            }
        }
    }
</script>

<style scoped>

</style>