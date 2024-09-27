<template>
    <div class="hearder-container">
        <div class="header-left">
            <el-icon @click='isCollapse' class="icon" size="20">
                <Expand />
            </el-icon>
        </div>
        <div class="header-right">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        {{ userInfo.name }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            <el-avatar :src="userInfo.avatar" />
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
const logOut=function(){
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    location.href='/login'
}
const store = useStore()
const isCollapse = function () {
    store.commit('menu/collapseMenu')
    console.log(store.state.menu.isCollapse)
}
</script>

<style lang="less" scoped>
.header-left {
    display: flex;
    align-items: center;
}

.header-right {
    display: flex;
    align-items: center;
}

.icon {
    width: 45px;
    height: 100%;
}

.icon:hover {
    background-color: #f5f5f5;
    cursor: pointer;
}

.hearder-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
}
</style>