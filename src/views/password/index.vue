<template>
  <div class="login-container">
	  <div class="loginBox">
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

			<div class="title-container">
				<h3 class="title">登 录</h3>
			</div>

			<el-form-item prop="phone">
				<span class="svg-container">
					<svg-icon icon-class="mobile" />
				</span>
				<el-input ref="phone" v-model="loginForm.phone" placeholder="请输入手机号" name="phone" type="text" tabindex="1" maxlength="11" @blur="getPiccode"/>
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" maxlength="16"/>
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

			<el-form-item prop="code">
				<span class="svg-container">
					<svg-icon icon-class="piccode" />
				</span>
				<el-input ref="code" v-model="loginForm.code" placeholder="请输入图片验证码(区分大小写)" name="code" tabindex="2" class="codeInput" maxlength="4"/>
				<div class="codeBox" @click="getPiccode">
					<img :src="codeUrl" v-if="codeUrl">
					<svg-icon icon-class="default" v-else style="width:2em;height:1.5rem;margin-left:4.5em;"/>
				</div>
			</el-form-item>

			<el-button :loading="loading" type="primary" style="width:75%;margin-bottom:30px;" @click.native.prevent="handleLogin"> 登 录 </el-button>

		</el-form>
	  </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
		var reg=/^[1][3,4,5,7,8][0-9]{9}$/;
		if (!reg.test(value)) {
			callback(new Error('电话号码输入格式有误！'))
		} else {		//正确就往下走！！！！！！瞎省略个锤子
			callback()
		}
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码格式错误'))
      } else {		//正确就往下走！！！！！！
        callback()
      }
    }
    return {
      loginForm: {
        phone: '18280126773',
        password: '123456',
		code:''
      },
	//   loginForm: {
    //     phone: '',
    //     password: '',
	// 	code:''
    //   },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateMobile }],
		password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
	  redirect: undefined,
	  codeUrl:'http://scm.irobotzz.com',		//获取图片验证码地址（上正式要修改）
	  defaultUrl:'@/assets/imgs/default.png'
    }
  },
  mounted(){
	  this.getPiccode();
  },
  watch: {
    $route: {
		handler: function(route) {
			this.redirect = route.query && route.query.redirect
		},
		immediate: true
    }
  },
  methods: {
    showPwd() {
		if (this.passwordType === 'password') {
			this.passwordType = ''
		} else {
			this.passwordType = 'password'
		}
		this.$nextTick(() => {
			this.$refs.password.focus()
		})
	},
	getPiccode(){
		this.codeUrl = 'http://scm.irobotzz.com/api/captcha/getcode?phone='+this.loginForm.phone+'&d='+new Date().getTime();
		// this.codeUrl = 'http://localhost:8081/api/captcha/getcode?d='+new Date().getTime()+'&phone='+this.loginForm.phone;
	},
    handleLogin() {
		var that = this;
		this.$refs.loginForm.validate(valid => {
			if (valid) {
				this.loading = true
				$.ajax({		//登录时没有token 所以不用封装的request方法
					type: 'get',
					url: '/api/login/admin',
					data: {...this.loginForm},
					dataType: "json",
					success: function(res){
						if(res.status==200){
							that.$message.success('登录成功！')
							sessionStorage.setItem('token',res.result.token)
							sessionStorage.setItem('phone',res.result.phone)
							sessionStorage.setItem('name',res.result.name)
							sessionStorage.setItem('userid',res.result.userid)
							that.$router.push({ path: '/' })
							that.loading = false;
						}else{
							that.$message.error(res.message)
							that.loading = false;
						}
					},
					error:function(err){
						console.log(err)
					}
				});
			}
		})
    }
  }
}
</script>


<style lang="scss">
	.login-container {
		height: 100vh;
		width: 100vw;
		background-color: #283443;
		overflow: hidden;
		
		.loginBox{
			width: 60%;
			margin: 10% auto;
			display: flex;
			flex-direction: row;
			align-items: center;

			.login-banner{
				width: 620px;
				height: 550px;
				background-image: url('../../assets/imgs/banner.jpg');
				background-size: 100% 100%;
				position: relative;
				margin: 0 auto;
				opacity: 0.7;
				border-top-left-radius: 10px;
				border-bottom-left-radius: 10px;
			}

			.login-form {
				position: relative;
				width: 540px;
				height: 550px;
				max-width: 100%;
				margin: 0 auto;
				overflow: hidden;
				background-color: #e7e5e5;
				border-radius: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;
				.el-form-item {
					border-radius: 5px;
			    	color: #454545;
					width: 75%;
					.el-input{
						width: 90%;
					}
				}
			}

			.tips {
				font-size: 14px;
				color: #fff;
				margin-bottom: 10px;

				span {
					&:first-of-type {
						margin-right: 16px;
					}
				}
			}

			.svg-container {
				padding: 6px 5px 6px 10px;
				color: #889aa4;
				vertical-align: middle;
				width: 30px;
				display: inline-block;
			}

			.title-container {
				position: relative;

				.title {
					font-size: 28px;
					color: #2d3a4b;
					margin: 80px auto 40px auto;
					text-align: center;
					font-weight: bold;
				}
			}

			.show-pwd {
				position: absolute;
				right: 20px;
				top: 7px;
				font-size: 16px;
				color: #889aa4;
				cursor: pointer;
				user-select: none;
			}

			.codeInput{
				width: 60%!important;
			}

			.codeBox{
				width: 26%;
				height: 35px;
				position: absolute;
				top: 10px;
				right: 6px;
				img{
					width: 100%;
					height: 100%
				}
			}
		}
	}
</style>
