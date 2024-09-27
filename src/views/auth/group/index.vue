<template>
    <memuheader/>
    <el-button plain @click="open(null)" type="primary">
        <el-icon>
            <Plus />
        </el-icon>
        新增
    </el-button>

    <el-dialog v-model="dialogFormVisible" title="添加权限" width="600" :before-close="close">
        <el-form ref="formRef" :model="formData" label-position="left" label-width="100px" :rules="rules">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="formData.id"></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入权限名称" />
            </el-form-item>
            <el-form-item label="权限" prop="permission">
                <el-tree ref="treeRef" style="max-width: 600;" :data="data" show-checkbox node-key="id"
                    :default-expanded-keys='[3]' :default-checked-keys='defaultckecked' />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type='primary' @click="submit(formRef)">提交</el-button>
            </div>
        </template>
    </el-dialog>

    <el-table :data="tableData.list" border style="width: 100%">
        <el-table-column prop="id" label="id" width="200" />
        <el-table-column prop="name" label="权限名字" width="200" />
        <el-table-column prop="permissionName" label="权限" />
        <el-table-column fixed="right" label="操作" width="150">
            <template #default="scoped">
                <el-button type="primary" @click="open(scoped.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" 
             layout="prev, pager, next, jumper,total" :total="tableData.total"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import memuheader from '../../../components/memuheader.vue';
import { ref, reactive, onMounted, nextTick } from 'vue';
import { userGetmenu, menuList, userSetmenu } from '../../../api'
const handleCurrentChange = function (val) {
    menuList({ pageNum: val, pageSize: 10 }).then((data) => {
        //console.log(data.data.data)
        tableData.total = data.data.data.total
        tableData.list = data.data.data.list
    })
}
const currentPage = ref(1)
const pageSize = ref(10)
const tableData = reactive({
    list: [],
    total: 0
})
const formRef = ref()
const treeRef = ref()
const defaultckecked = [4, 5]
const dialogFormVisible = ref(false)
const formData = reactive({
    id: '',
    name: '',
    permissions: ''
})
const rules = reactive(
    {
        name: [{ required: true, message: '请输入权限名字', trigger: 'blur' }]
    }
)
const data = ref()
onMounted(() => {
    userGetmenu().then((result) => {
        //console.log(result)
        data.value = result.data.data
    })
    menuList({ pageNum: 1, pageSize: 10 }).then((data) => {
        //console.log(data.data.data)
        tableData.total = data.data.data.total
        tableData.list = data.data.data.list
    })
})
const submit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            userSetmenu({ name: formData.name, permissions, id: formData.id }).then((data) => {
                //console.log(data)
                menuList({ pageNum: currentPage.value, pageSize: 10 }).then((data) => {
                    //console.log(data.data.data.list)
                    tableData.total = data.data.data.total
                    tableData.list = data.data.data.list
                })
                close()
            })
        } else {
        }
    })
}
const open = (rowdata = {}) => {
    dialogFormVisible.value = true
    nextTick(() => {
        if (rowdata) {
            Object.assign(formData, { id: rowdata.id, name: rowdata.name })
            treeRef.value.setCheckedKeys(rowdata.permission)
        }
    })
}
const close = function () {
    dialogFormVisible.value = false
    formRef.value.resetFields()
    treeRef.value.setCheckedKeys(defaultckecked)
}
</script>

<style lang="less" scoped>
.demo-pagination-block{
    position: absolute;
    bottom: 0;
}
</style>