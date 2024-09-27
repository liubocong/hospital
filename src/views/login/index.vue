<template>
  <el-row class="login-container" justify="center" :align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img src="../../../public/login-head.png" alt="">
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="changeformtype">{{ formtype ? '登录页面' : '进入注册' }}</el-link>
      </div>
      <el-form ref="ruleFormRef" style="max-width: 600px" :model="loginForm" status-icon :rules="rules"
        label-width="auto" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" type="password" placeholder="密码" show-password :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item v-if='formtype' prop="validCode">
          <el-input v-model="loginForm.validCode" style="max-width: 300px," :prefix-icon="Lock" placeholder="验证码">
            <template #append>
              <span @click="countdownChange">
                {{ countDown.vaildText }}
              </span>
            </template>
          </el-input>
        </el-form-item>
        <div>
          <el-form-item v-if="!formtype">
            <el-button @click="submit(ruleFormRef)" type="primary" style="width: 100%;">登陆</el-button>
          </el-form-item>
          <el-form-item v-else="formtype">
            <el-button @click="register(ruleFormRef)" type="primary" style="width: 100%;">注册</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { getCode, userAuthentication,Login } from '../../api/index'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router=useRouter()
const loginForm = reactive({ userName: '', passWord: '', validCode: '' })
const validateuserName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号不能为空'))
  }
  else {
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if (!phoneReg.test(value)) {
      callback(new Error('手机号格式不对'))
    }
    else {
      callback()
    }
  }
}
const validatepassWord = (rule, value, callback) => {
  if (!value) {
    callback(new Error('密码不能为空'))
  }
  else {
    const passWordReg = /^[a-zA-Z0-9_-]{4,16}$/
    if (!passWordReg.test(value)) {
      callback(new Error('密码格式不对，应为4-16为字符'))
    }
    else {
      callback()
    }
  }
}
const rules = reactive({
  userName: [{ required: true, trigger: 'blur', validator: validateuserName }],
  passWord: [{ required: true, trigger: 'blur', validator: validatepassWord }],
  validCode: []
})
const ruleFormRef = ref()
const submit = async (ruleFormRef) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      Login({userName:loginForm.userName,passWord:loginForm.passWord}).then(
        (result)=>{
        //console.log(result)
        if(result.data.code===10000){
          ElMessage.success('登录成功')
          localStorage.setItem('pz_token',result.data.data.token)
          localStorage.setItem('pz_userInfo',JSON.stringify(result.data.data.userInfo))
          router.push('/')
        }
      }
    )
    } else {
      ElMessage.error("请输入正确信息")
    }
  })
}
const register = async (ruleFormRef) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      userAuthentication(loginForm).then((result)=>
      {
        //console.log(result)
        if(result.data.code===10000)
      {
        ElMessage.success('注册成功')
        formtype.value=false
      }
      })
    } else {
      ElMessage.error('请输入正确信息')
    }
  })
}
const countDown = reactive({
  time: 60,
  vaildText: '获取验证码'
})
const formtype = ref(false)
const changeformtype = function () {
  formtype.value = !formtype.value
}
let flag = false
const countdownChange = () => {
  if (flag) {
    return
  }
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (!phoneReg.test(loginForm.userName) || !loginForm.userName) {
    return ElMessage({
      message: '请检查手机号',
      type: 'warning',
    })
  }
  flag = true
  let intervalId = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60
      countDown.vaildText = '获取验证码'
      clearInterval(intervalId)
      flag = false
    }
    else {
      countDown.time--
      countDown.vaildText = countDown.time
    }
  }, 1000)
  getCode({ tel: loginForm.userName }).then((result) => {
    //console.log(result)
    if (result.data.code === 10000) {
      ElMessage.success('发送成功')
    }
  })
}

</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0
}

.login-container {
  height: auto;

  .card-header {
    background-color: #899fe1;

    img {
      width: 430px;
    }
  }

  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
