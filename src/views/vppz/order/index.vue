<template>
    <memuheader/>
    <div class="form">
        <el-form :inline="true" :model="search">
            <el-form-item prop="out_trade_no">
                <el-input v-model="search.out_trade_no" placeholder="订单号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitSearch">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableInfo.list">
        <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left" />
        <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
        <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
        <el-table-column label="陪护师头像">
            <template #default="scoped">
                <el-image :src="scoped.row.companion.avatar" style="height: 40px;width: 40px;"></el-image>
            </template>
        </el-table-column>
        <el-table-column prop="companion.mobile" label="陪护师手机号" width="120"></el-table-column>
        <el-table-column prop="price" label="总价"></el-table-column>
        <el-table-column prop="paidPrice" label="已付"></el-table-column>
        <el-table-column label="下单时间" width="120">
            <template #default="scoped">
                {{ formatTimestamp(scoped.row.order_start_time) }}
            </template>
        </el-table-column>
        <el-table-column label="订单状态">
            <template #default="scoped">
                <el-tag :type="type[scoped.row.trade_state] || type['2']">{{ scoped.row.trade_state || '已完成' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="接单状态" prop="service_state">
        </el-table-column>
        <el-table-column label="联系人手机号" prop="tel" width="120">
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
            <template #default="scoped">
                <el-popconfirm v-if="scoped.row.trade_state === '待服务'" confirm-button-text="是" cancel-button-text="否"
                    :icon="InfoFilled" icon-color="#626AEF" title="是否确认完成？"
                    @confirm="confirmEvent(scoped.row.out_trade_no)">
                    <template #reference>
                        <el-button type="primary" link>服务完成</el-button>
                    </template>
                </el-popconfirm>
                <el-button v-else type="primary" text disabled>
                    暂无服务
                </el-button>
            </template>

        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize"
            layout="prev, pager, next, jumper,total" :total="tableInfo.total" @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { adminOrder, updateOrder } from '../../../api'
import memuheader from '../../../components/memuheader.vue';
const search = reactive({
    out_trade_no: ''
})
const pageInfo = reactive({
    pageNum: 1,
    pageSize: 10
})
const tableInfo = reactive({
    list: [],
    total: 0
})
const type = {
    '已取消': 'info',
    '待支付': 'warning',
    '已完成': 'success'
}
const submitSearch = function () {
    adminOrder({ ...pageInfo, ...search }).then((result) => {
        tableInfo.list = result.data.data.list
        tableInfo.total = result.data.data.total
    })
}
const handleCurrentChange = function () {
    adminOrder(pageInfo).then((result) => {
        //console.log(result)
        tableInfo.list = result.data.data.list
        tableInfo.total = result.data.data.total
    })
}

const confirmEvent = function (id) {
    updateOrder({ id }).then((result) => {
        //console.log(result)
        if (result.data.code === 10000) {
            adminOrder(pageInfo).then((result) => {
                tableInfo.list = result.data.data.list
                tableInfo.total = result.data.data.total
                console.log(tableInfo.list)
            })
        }
    })
}

const formatTimestamp = function (timestamp) {
    const date = new Date(timestamp)
    return date.toISOString().split('T')[0]; // 获取 ISO 格式的日期部分
}
onMounted(() => {
    adminOrder(pageInfo).then((result) => {
        tableInfo.list = result.data.data.list
        tableInfo.total = result.data.data.total
        console.log(tableInfo.list)
    })
})
</script>

<style lang="less" scoped>
.demo-pagination-block {
    position: absolute;
    bottom: 0;
}

.form {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>