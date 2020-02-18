<template>
    <div>
        <van-circle
                v-model="currentPercent"
                :rate="80"
                :speed="100"
                :size="30"
                color="#ffcd32"
                layer-color="blue"
        >
            <slot></slot>
        </van-circle>

    </div>

</template>

<script>
    export default {
        name: "ProgressCircle",
        data(){
            return {
                currentPercent:0
            }
        },
        props:{
            currentRate:{
                type:Number,
                default:0
            }
        },
        watch:{
            currentRate(newRate){
                this.currentPercent = newRate
            }
        }

    }
</script>

<style scoped>

</style>