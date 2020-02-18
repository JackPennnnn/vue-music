<template>
    <van-slider v-model="percent1" active-color="#ffcd32" @change="change">
        <div slot="button" class="custom-button">

        </div>
    </van-slider>
</template>

<script type="text/ecmascript-6">
   export default {
       data(){
           return {
               percent1:0
           }
       },
       props:{
           percent:{
               type:Number,
               default:1
           }
       },
       //v-model最好不要对应直接传来的东西
       watch:{
           percent(newP){
                this.percent1 = newP
           }
       },
       methods:{
           change(value){
               value /= 100
               this.$emit('changeTime',value)
           }
       }

   }


</script>

<style scoped lang="stylus">
    @import "~common/stylus/variable.styl"
    .custom-button {
        width: 7px;
        height: 7px;
        border:3px solid white
        text-align: center;
        background-color: $color-theme;
        border-radius: 100px;
    }
</style>


