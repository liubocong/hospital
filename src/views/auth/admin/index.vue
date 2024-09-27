<template>
    <memuheader/>
    <el-table :data="tableData.list" border style="width: 100%">
        <el-table-column prop="id" label="id" width="180" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scoped">
                {{ permissionName(scoped.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180" />
        <el-table-column prop="active" label="状态" min-width="120">
            <template #default="scoped">
                <el-tag :type="scoped.row.active ? 'success' : 'warning'">{{ scoped.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template #default="scoped">
                <div class="flex-box">
                    <el-icon>
                        <Clock />
                    </el-icon>
                    <span style="margin-left:10px ;">
                        {{ scoped.row.create_time }}
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scoped">
                <el-button type="primary" @click="open(scoped.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="paginationData.pageSize"
            layout="prev, pager, next, jumper,total"
            :total="tableData.total" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogFormVisible" title="编辑用户" width="600" :before-close="close">
        <el-form ref="formRef" :model="formData" label-position="left" label-width="100px">
            <el-form-item prop="mobile" label="电话号码">
                <el-input v-model="formData.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select v-model="formData.permissions_id" style="width: 115px" placeholder="请选择菜单权限">
                    <el-option v-for="item in option" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type='primary' @click="submit(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import memuheader from '../../../components/memuheader.vue';
import { authAdmin, menuSelectlist, updateUser } from '../../../api'
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
const currentPage = ref(1)
const formRef = ref()
const paginationData = reactive({ pageNum: 1, pageSize: 10 })
onMounted(() => {
    authAdmin(paginationData).then((result) => {
        //console.log(result.data.data)
        result.data.data.list.forEach(ele => {
            ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
        });
        tableData.list = result.data.data.list
        tableData.total = result.data.data.total

    })
    menuSelectlist().then((result) => {
        console.log(result)
        option.value = result.data.data

    })
})
const option = ref([])
const tableData = reactive({
    total: 0,
    list: []
})
const formData = reactive({
    mobile: '',
    name: '',
    permissions_id: ''
})
const dialogFormVisible = ref(false)
const permissionName = function (id) {
    const data = option.value.find(el => el.id === id)
    return data ? data.name : '超级管理员'
}
const open = function (el) {
    dialogFormVisible.value = true
    formData.mobile = el.mobile
    formData.name = el.name
    formData.permissions_id = el.permissions_id
}
const close = function () {
    dialogFormVisible.value = false
    formRef.value.resetFields()
}
const submit = function () {
    updateUser({ name: formData.name, permissions_id: formData.permissions_id }).then((result) => {
        console.log(result)
        close()
        authAdmin({ pageNum: currentPage.value, pageSize: 10 }).then((result) => {
            //console.log(result.data.data)
            result.data.data.list.forEach(ele => {
                ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
            });
            tableData.list = result.data.data.list
            tableData.total = result.data.data.total
        })
    })

}
const handleCurrentChange = function (val) {
    menuList({ pageNum: val, pageSize: 10 }).then((data) => {
        //console.log(data.data.data)
        tableData.total = data.data.data.total
        tableData.list = data.data.data.list
    })
}
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
}
.demo-pagination-block{
    position: absolute;
    bottom: 0;
}
</style>