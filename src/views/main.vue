<template> 
    <div class="common-layout">
    <el-container class="aaa">
        <Aside></Aside>
      <el-container>
        <el-header> 
            <Header></Header>
        </el-header>
        <el-main>
          <Router-View></Router-View>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/Aside.vue';
import Header from '../components/Header.vue'
</script>

<style lang="less" scoped>
.common-layout{
    height: 100%;
    .aaa{
        height: 100%;
    }
}
 
</style>