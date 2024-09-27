<template>
      <el-menu
      :style="{width:!isCollapse ? '200px':'64px'}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        default-active="2"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
      <p class="logo-lg">{{ isCollapse?'DI':'DI陪诊系统' }}</p>
      <Asidetree :menuData="menuData" :index="1"/>
      </el-menu>
      
</template>

<script setup>
import { useStore } from 'vuex';
import Asidetree from './treeMenu.vue';
import {useRouter} from 'vue-router'
import { reactive,computed } from 'vue';
const store=useStore()
const isCollapse=computed(()=>store.state.menu.isCollapse)
const router=useRouter()
const menuData=reactive(router.options.routes[0].children)
</script>
<style scoped>
    .aside-container{
        height: 100%;
    }
    .logo-lg{
      font-size:20px;
      text-align: center;
      height: 50px;
      line-height: 50px;
      color: #fff;
    }
</style>