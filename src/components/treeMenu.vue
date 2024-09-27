<template>
     <template v-for="(item,index) in props.menuData">
        <el-menu-item 
        @click="handClick(item,`${props.index}-${item.meta.id}`)"
        v-if="!item.children" 
        :index="`${props.index}-${item.meta.id}`"
        :key="`${props.index}-${item.meta.id}`">
          <el-icon size="20">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else 
        :index="`${props.index}-${item.meta.id}`"
         >
        <template #title> 
          <el-icon size="20"> <component :is="item.meta.icon"></component></el-icon>
          <span>{{ item.meta.name }}</span>
        </template>
        <tree-menu :menuData="item.children" :index="`${props.index}-${item.meta.id}`" />
        </el-sub-menu>
     </template>
</template>

<script setup>
import { useRouter,useRoute } from 'vue-router';
const router=useRouter()
const route=useRoute()
const props=defineProps(['menuData','index'])
const handClick=(item,active)=>{
  router.push(item.meta.path)
  console.log(route)
}

</script>

<style lang="scss" scoped>

</style>