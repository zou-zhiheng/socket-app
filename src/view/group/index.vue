<template>
    <div class="layoutBox">
        <div class="main"><router-view></router-view></div>
        <van-config-provider theme="dark">
        <van-tabbar v-model="active" route>
          <van-tabbar-item icon="coupon-o" to="/debug">调试</van-tabbar-item>
          <van-tabbar-item icon="cluster-o" to="/visualization">可视化</van-tabbar-item>
          <van-tabbar-item icon="desktop-o" to="/device">设备</van-tabbar-item>
          <van-tabbar-item icon="contact" to="/api">API</van-tabbar-item>
          <van-tabbar-item icon="contact" to="/user">用户</van-tabbar-item>
        </van-tabbar>
        </van-config-provider>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let active = ref(0)
</script>

<style scoped>
.layoutBox{
    height: 100%;
    width: 100%;
}
.main{
    min-height: 100%;
    height: auto;
    width: 100%;
    background-color: #1c1c1e;
}
</style>