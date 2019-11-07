<template>
  <div class="login-container">
	  <div class="loginBox">
		<div class="login-banner"></div>
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

			<div class="title-container">
				<h3 class="title">登 录</h3>
			</div>

			<el-form-item prop="phone">
				<span class="svg-container">
					<svg-icon icon-class="mobile" />
				</span>
				<el-input ref="phone" v-model="loginForm.phone" placeholder="请输入手机号" name="phone" type="text" tabindex="1" maxlength="11"/>
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
					<img :src="codeUrl">
				</div>
			</el-form-item>

			<el-button :loading="loading" type="primary" style="width:75%;margin-bottom:30px;" @click.native.prevent="handleLogin"> 登 录 </el-button>

		</el-form>
	  </div>
  </div>
</template>

<script>
import requestData  from '@/utils/requestMethod';

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
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateMobile }],
		password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
	  redirect: undefined,
	  codeUrl:'http://47.105.134.186:8080/scm/api/captcha/getcode',			//获取图片验证码地址（上正式要修改）
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
		this.codeUrl = 'http://47.105.134.186:8080/scm/api/captcha/getcode?d='+new Date().getTime();
	},
    handleLogin() {
		this.$refs.loginForm.validate(valid => {
			if (valid) {
			this.loading = true
			requestData('/api/login/admin',{
                ...this.loginForm
            },'get').then((res)=>{
				if(res.status==200){
					this.$message.success('登录成功！')
					this.setSessitonStorage(res.data)
					this.$router.push({ path: '/' })
					this.loading = false;
				}else{
					this.$message.error(res.message)
					this.loading = false;
				}
            },(err)=>{
                console.log(err)
            }).catch(() => {
				this.loading = false;
			})
				// this.$store.dispatch('user/login', this.loginForm).then(() => {
				// 	this.$router.push({ path: this.redirect || '/' })
				// 	this.loading = false
				// }).catch(() => {
				// 	this.loading = false
				// })
			} else {
				console.log('error submit!!')
				return false
			}
		})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		input {
		background: transparent;
		border: 0px;
		-webkit-appearance: none;
		border-radius: 0px;
		padding: 12px 5px 12px 15px;
		color: $bg;
		height: 47px;
		caret-color: $cursor;

		&:-webkit-autofill {
			box-shadow: 0 0 0px 1000px $bg inset !important;
			-webkit-text-fill-color: $cursor !important;
		}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.05);
		border-radius: 5px;
		width: 75%;
	}
}
</style>

<style lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;

.login-container {
	min-height: 100%;
	width: 100%;
	background-color: $bg;
	overflow: hidden;
	
	.loginBox{
		width: 60%;
		margin: 10% auto;
		display: flex;
		flex-direction: row;
		align-items: center;

		.login-banner{
			width: 680px;
			height: 500px;
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
			width: 520px;
			height: 500px;
			max-width: 100%;
			// padding: 160px 35px 0;
			margin: 0 auto;
			overflow: hidden;
			background-color: #e3e5e4;
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
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
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}

		.title-container {
			position: relative;

			.title {
				font-size: 28px;
				color: $bg;
				margin: 80px auto 40px auto;
				text-align: center;
				font-weight: bold;
			}
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}

		.codeInput{
			width: 60%;
		}

		.codeBox{
			width: 26%;
			height: 35px;
			background-color: yellow;
			float: right;
			margin-top: 8px;
			img{
				width: 100%;
				height: 100%
			}
		}
	}
}
</style>
