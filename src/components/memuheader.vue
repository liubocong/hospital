<template>
    <div class="panel-heading">
        <div class="panel-lead">
            <div class="title">{{ route.meta.name }}</div>
            <p class="description">{{ route.meta.describe }}</p>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route=useRoute()
</script>

<style lang="less" scoped>
.panel-heading {
    padding: 15px;
    background: #e8edf0;
    border-color: #e8edf0;
    position: relative;
    .panel-lead {
      font-size: 14px;
      .title {
        font-weight: bold;
        font-style: normal;
      }
      .description {
        margin-top: 5px;
      }
    }
  }
</style>