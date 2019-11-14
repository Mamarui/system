<template>
    <el-container class="container">
        <div class="steps">
            <el-steps :active="active" finish-status="success" :space="850" align-center>
                <el-step title="密码找回"></el-step>
                <el-step title="重置密码"></el-step>
            </el-steps>
        </div>
        <div class="login-table" v-show="active == 0">
            <el-header class="header">修改交易密码</el-header>
            <el-main class="main">
                <el-form ref="form" :model="form_find" label-width="120px">
                    <el-form-item label="手机号码">
                        <el-input v-model="form_find.mobile" placeholder="请输入已绑定的手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" class="piccodebox">
                        <el-input v-model="form_find.piccode" placeholder="请输入图形验证码"></el-input>
                        <div class="codeBox" @click="getPiccode">
                            <img :src="codeUrl" v-if="codeUrl">
                            <svg-icon icon-class="default" v-else style="width:2em;height:1.5rem;margin-left:4.5em;"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="短信验证码" class="smscodebox">
                        <el-input v-model="form_find.smscode" placeholder="请输入短信验证码"></el-input>
                        <span class="smscode smscodeinner" @click="getSmscode">获取验证码</span>
                        <input class="smscodein smscodeinner" type="text">
                    </el-form-item>
                </el-form>
            </el-main>
        </div>
        <div class="login-table" v-show="active == 1">
            <el-header class="header">重置交易密码</el-header>
            <span class="notice">你正在重置交易密码，密码为8~16位数字+字母组合</span>
            <el-main class="main">
                <el-form ref="form" :model="form_reset" label-width="120px">
                    <el-form-item label="密码">
                        <el-input v-model="form_reset.password" placeholder="请设置登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" class="piccodebox">
                        <el-input v-model="form_reset.passwordtwice" placeholder="确认登录密码"></el-input>
                    </el-form-item>
                </el-form>
            </el-main>
        </div>
        <el-button type="primary" @click="onSubmit" class="sureBtn">确定</el-button>
    </el-container>
</template>


<style lang="scss" scoped>
    @import "~@/styles/common.scss";
</style>

<style lang="scss" scoped>
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    .steps{
        width: 100%;
        margin: 10% auto 0 auto;
    }
    .login-table{
        .main{
            /**图形验证码 */
            .piccodebox{
                position: relative;
                .codeBox{
                    width: 26%;
                    height: 35px;
                    position: absolute;
                    right: 2px;
                    top: 2px;
                    img{
                        width: 100%;
                        height: 100%
                    }
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
                    cursor: pointer;
                }
                .smscodein{
                    display: none;
                }
            }
        }
        .notice{
            font-size: 14px;
            color: #c1c1c1;
            margin-left: 30%;
        }
    }
}
</style>


<script>
import $ from 'jquery'
export default {
    data() {
        return {
            codeUrl:'http://47.105.134.186:8080/scm/api/captcha/getcode?phone=18280126773',		//获取图片验证码地址（上正式要修改）
            defaultUrl:'@/assets/imgs/default.png',
            form_find: {
                mobile: '',
                piccode:'',
                smscode:''
            },
            form_reset: {
                password: '',
                passwordtwice:''
            },
            active:0
        }
    },
    methods:{
        getPiccode(){
            this.codeUrl = 'http://47.105.134.186:8080/scm/api/captcha/getcode?phone='+this.loginForm.phone+'&d='+new Date().getTime();
            // this.codeUrl = 'http://localhost:8081/api/captcha/getcode?d='+new Date().getTime()+'&phone='+this.loginForm.phone;
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
            if (this.active++ >= 1) {
                this.active = 0;
                this.$router.push(`/login`);
                sessionStorage.clear();
            };
            switch (this.active) {
                case 0:
                    console.log(this.form_find)
                    break;
                case 1:
                    console.log(this.form_reset)
                    break;
                default:
                    break;
            }
        }
    }
}
</script>