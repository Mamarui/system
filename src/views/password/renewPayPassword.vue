<template>
    <el-container class="container">
        <div class="login-table">
            <el-header class="header">重置交易密码</el-header>
            <span class="notice">你正在重置交易密码，密码为8~16位数字+字母组合</span>
            <el-main class="main">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="密码">
                        <el-input v-model="form.password" placeholder="请设置登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" class="piccodebox">
                        <el-input v-model="form.passwordtwice" placeholder="确认登录密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" class="sureBtn">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </div>
    </el-container>
</template>


<style lang="scss" scoped>
    @import "~@/styles/common.scss";
</style>

<style lang="scss" scoped>
    .notice{
        font-size: 14px;
        color: #c1c1c1;
        margin-left: 30%;
    }
</style>


<script>
export default {
    data() {
        return {
            form: {
                password: '',
                passwordtwice:'',
            }
        }
    },
    methods:{
        onSubmit(){
            console.log(this.form)
        }
    }
}
</script>