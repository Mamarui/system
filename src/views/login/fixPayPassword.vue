<template>
    <el-container class="container">
        <div class="login-table">
            <el-header class="header">修改交易密码</el-header>
            <el-main class="main">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="手机号码">
                        <el-input v-model="form.mobile" placeholder="请输入已绑定的手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" class="piccodebox">
                        <el-input v-model="form.piccode" placeholder="请输入图形验证码"></el-input>
                        <span class="piccode" @click="getPiccode"></span>
                    </el-form-item>
                    <el-form-item label="短信验证码" class="smscodebox">
                        <el-input v-model="form.smscode" placeholder="请输入短信验证码"></el-input>
                        <span class="smscode smscodeinner" @click="getSmscode">获取验证码</span>
                        <input class="smscodein smscodeinner" type="text">
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
.container{
    .login-table{
        .main{
            /**图形验证码 */
            .piccodebox{
                position: relative;
                .piccode{
                    width: 180px;
                    height: 40px;
                    line-height: 40px;
                    position: absolute;
                    right: 0;
                    border: 1px solid #DCDFE6;
                }
            }
            /**短信验证码 */
            .smscodebox{
                position: relative;
                .smscodeinner{
                    width: 180px;
                    height: 40px;
                    line-height: 40px;
                    position: absolute;
                    right: 0;
                    border: 1px solid #DCDFE6;
                    font-size: 14px;
                    color: #c1c1c1;
                    text-align: center;
                }
                .smscodein{
                    display: none;
                }
            }
        }
    }
}

</style>



<script>
import $ from 'jquery'
export default {
    data() {
        return {
            form: {
                mobile: '',
                piccode:'',
                smscode:''
            }
        }
    },
    methods:{
        getPiccode(){
            console.log('获取图形验证码')
        },
        getSmscode(){
            var time = 5;
            var timer = setInterval(function() {
                if (time == -1) {
                    clearInterval(timer);
                    $('.smscode').show();
                    $(".smscodein").hide();
                } else {
                    $('.smscode').hide();
                    $(".smscodein").show();
                    $('.smscodein').val(time + "秒");
                    time--;
                }
            }, 1000);
        },
        onSubmit(){
            console.log(this.form)
        }
    }
}
</script>