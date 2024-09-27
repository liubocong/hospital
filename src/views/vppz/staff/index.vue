<template>
    <memuheader />
    <el-button type="primary" @click="open(null)">
        <el-icon>
            <Plus />
        </el-icon>
        新增
    </el-button>
    <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
        title="是否确认完成？" @confirm="deleteData">
        <template #reference>
            <el-button type="danger">
                <template #default>
                    <el-icon>
                        <Delete />
                    </el-icon>
                    删除
                </template>
            </el-button>
        </template>
    </el-popconfirm>

    <el-dialog v-model="dialogFormVisible" title="陪护师" width="500" :before-close="close">
        <el-form ref="formRef" :model="formData" label-position="left" label-width="100px" :rules="rules">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="formData.id">
                </el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入昵称">
                </el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!formData.avatar" type="primary" @click="openImg">
                    点击上传
                </el-button>
                <el-image v-else :src="formData.avatar" style="height: 100px;width: 100px;">
                </el-image>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="formData.sex" placeholder="请选择性别" style="width: 240px">
                    <el-option label="男" value="1">
                    </el-option>
                    <el-option label="女" value="2">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="formData.age" :min="18" :max="50" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="formData.mobile" placeholder="请输入手机号">
                </el-input>
            </el-form-item>
            <el-form-item label="是否生效" prop="active">
                <el-radio-group v-model="formData.active">
                    <el-radio :value="0">失效</el-radio>
                    <el-radio :value="1">生效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type='primary' @click="submit(formRef)">提交</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogimg" title="选择照片" width="500" :before-close="closeA">
        <div class="image-list">
            <div v-for="(item, index) in imgA" :key="item.name" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="#fff"><Select /></el-icon>
                </div>
                <el-image :src="item.url" style="width: 140px;height: 140px;"></el-image>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogimg = false">取消</el-button>
                <el-button type='primary' @click="confirmImage">确认</el-button>
            </div>
        </template>
    </el-dialog>

    <el-table :data="companionListData.list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" fixed="left" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column label="头像">
            <template #default="scoped">
                <el-image :src="scoped.row.avatar" style="width: 50px;height: 50px;">
                </el-image>
            </template>
        </el-table-column>
        <el-table-column label="性别">
            <template #default="scoped">
                {{ scoped.row.sex === '2' ? '女' : '男' }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column label="状态">
            <template #default="scoped">
                <el-tag v-if="scoped.row.active === 1" type="success">正常</el-tag>
                <el-tag v-else type="danger">失效</el-tag>
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
        <el-table-column label="操作" fixed="right">
            <template #default="scoped">
                <el-button type="primary" @click="open(scoped.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
            layout="prev, pager, next, jumper,total" :total="companionListData.total"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import memuheader from '../../../components/memuheader.vue';
import { ElMessage } from 'element-plus';
import { photoList, Companion, companionList, deleteCompanion } from '../../../api'
import { reactive, ref, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import {InfoFilled} from '@element-plus/icons-vue'
const currentPage = ref(1)
const pageSize = ref(10)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
    multipleSelection.value = val
    //console.log(val)
}

const handleCurrentChange = function () {
    companionList({ pageNum: currentPage.value, pageSize: 10 }).then((result) => {
        //console.log(result)
        result.data.data.list.forEach(ele => {
            ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
        })
        companionListData.list = result.data.data.list
        companionListData.total = result.data.data.total
    })
}
const deleteData = function () {
    deleteCompanion({ id: multipleSelection.value }).then((result) => {
        //console.log(result)
        if (result.data.code === 10000) {
            ElMessage.success(result.data.data)
            companionList({ pageNum: currentPage.value, pageSize: 10 }).then((result) => {
                //console.log(result)
                result.data.data.list.forEach(ele => {
                    ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
                })
                companionListData.list = result.data.data.list
                companionListData.total = result.data.data.total
            })
        }
    })
}
onMounted(() => {
    photoList().then((result) => {
        imgA.value = result.data.data
        //console.log(imgA.value)
    })
    companionList({ pageNum: 1, pageSize: 10 }).then((result) => {
        //console.log(result)
        result.data.data.list.forEach(ele => {
            ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
        })
        companionListData.list = result.data.data.list
        companionListData.total = result.data.data.total
    })
})
const companionListData = reactive({
    total: 0,
    list: []
})
const selectIndex = ref(0)
const imgA = ref([])
const formRef = ref()
const formData = reactive({
    id: '',
    avatar: '',
    mobile: '',
    active: 1,
    name: '',
    sex: '',
    age: 28
})
const dialogimg = ref(false)
const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
    avatar: [{ required: true, message: '请选择头像' }],
    sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
    mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }]
})
const dialogFormVisible = ref(false)
const close = function () {
    dialogFormVisible.value = false
    formRef.value.resetFields()
}
const closeA = function () {
    dialogimg.value = false
}
const open = function (ele = {}) {
    dialogFormVisible.value = true
    nextTick(() => {
        if (ele) {
            Object.assign(formData, ele)
        }
    })
}
const openImg = function () {
    dialogimg.value = true

}
const submit = async function (ele) {
    if (!ele) return
    await ele.validate((valid, fields) => {
        if (valid) {
            Companion(formData).then((result) => {
                //console.log(result)
                if (result.data.code === 10000) {
                    ElMessage.success(result.data.data)
                }
                companionList({ pageNum: currentPage.value, pageSize: 10 }).then((result) => {
                    //console.log(result)
                    result.data.data.list.forEach(ele => {
                        ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
                    })
                    companionListData.list = result.data.data.list
                    companionListData.total = result.data.data.total
                })
                close()
            })
        } else {
            ElMessage.error("请输入正确信息")
        }
    })
}
const confirmImage = function () {
    dialogimg.value = false
    formData.avatar = imgA.value[selectIndex.value].url
}
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}

.demo-pagination-block {
    position: absolute;
    bottom: 0;
}
</style>