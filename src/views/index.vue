<template>
    <el-container class="container">
		<el-main class="main">
			<p class="title">累计商家未提现 ： <span class="num">{{capitalPool}}</span> 元</p>
			<div class="top">
				<div id="tab-one" class="tab_one"></div>
				<p class="title_in title_one">设备概览</p>
				<div id="tab-two" class="tab_two"></div>
				<p class="title_in title_two">商家概览</p>
			</div>
			<div class="bottom">
				<div id="table-chart" class="table_chart"></div>
				<div class="stateBox">
					<el-button round :type='types_year' @click="changeStates('year')">年</el-button>
					<el-button round :type='types_month' @click="changeStates('month')">月</el-button>
					<el-button round :type='types_day' @click="changeStates('day')">日</el-button>
				</div>
				<div class="dateBox">
					<div class="year" v-show="year">
						<el-date-picker class="yearpicker" v-model="year_one" type="year" value-format="yyyy" placeholder="选择年" @change="getYears(0)" :picker-options="pickerOptions">></el-date-picker>
						<span> - </span>
						<el-date-picker class="yearpicker" v-model="year_two" type="year" value-format="yyyy" placeholder="选择年" @change="getYears(1)" :picker-options="pickerOptions">></el-date-picker>
					</div>
					<div class="month" v-show="month">
						<el-date-picker v-model="month_one" type="month" placeholder="选择月" value-format="yyyy-MM" @change="getMonths(0)" :picker-options="pickerOptions">></el-date-picker>
						<span> - </span>
						<el-date-picker v-model="month_two" type="month" placeholder="选择月" value-format="yyyy-MM" @change="getMonths(1)" :picker-options="pickerOptions">></el-date-picker>
					</div>
					<div class="day" v-show="day">
						<el-date-picker type="date" v-model="day_one" value-format="yyyy-MM-dd" placeholder="选择日期" @change="getDayOne" :picker-options="pickerOptions">></el-date-picker>
					</div>
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<style lang="scss" scoped>
.container{
	.main{
		.title{
			font-size: 18px;
			.num{
				color: #3CC43C;
			}
		}
		.top{
			width: 100%;
			height: 400px;
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;
			.tab_one,.tab_two{
				width: 40%;
				height: 400px;
				float: left;
				background-color: #E6E6E6;
			}
			.tab_one{
				margin-right: 10%;
			}
			.title_in{
				position: absolute;
				font-size: 18px;
				top: 0;
			}
			.title_one{
				left: 20%;
			}
			.title_two{
				left: 75%;
			}
		}
		.bottom{
			width: 100%;
			height: 500px;
			position: relative;
			margin-top: 2%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.table_chart{
				width: 95%;
				padding: 1%;
				height: 500px;
				background-color: #E6E6E6;
			}
			.stateBox{
				position: absolute;
				top: 2%;
				left: 5%;
			}
			.dateBox{
				width: 500px;
				height: 50px;
				position: absolute;
				right: 10%;
				top: 2%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-around;
			}
		}
	}
}
</style>

<script>
import requestData  from '@/utils/requestMethod';
import $ from 'jquery'
export default {
	data() {
		return {
				capitalPool:0,			//累计商家未提现金额
				changeState:'年',		//根据不同筛选条件展示折线图不同的title
				year:true,				//折线图日期筛选条件根据不同筛选条件的展示隐藏 -- 年（默认展示）
				month:false,			//折线图日期筛选条件根据不同筛选条件的展示隐藏 -- 月（默认不展示）
				day:false,				//折线图日期筛选条件根据不同筛选条件的展示隐藏 -- 日（默认不展示）
				types_year:'primary',
				types_month:'',
				types_day:'',
				year_one:'',			//筛选条件 年 第一个
				year_two:'',			//筛选条件 年 第二个
				month_one:'',			//筛选条件 月 第一个
				month_two:'',			//筛选条件 月 第二个
				day_one:'',				//筛选条件 日
				pickerOptions:{
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				type_:0,		//接口所需类型
				date_:''		//接口所需时间
			}
	},
	mounted(){
		this.getCapitalPool();
		this.initCharts1();
		this.initCharts2();
		this.initCharts3();
	},
	methods:{
		/**获取累计商家未提现 */
		getCapitalPool(){
			requestData('/api/capi/overview',{},'get').then((res)=>{
                if(res.status==200){
                    this.capitalPool = res.data.capitalPool;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
		},
		/**设备概览 -- 左上 */
		initCharts1(){
			var that = this;
			requestData('/api/index/equip',{},'get').then((res)=>{
                if(res.status==200){
                    var	echarts = require('echarts');
					var myChart1 = echarts.init(document.getElementById('tab-one'));
					myChart1.setOption({
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} ({d}%)"
						},
						legend: {
							orient: 'horizontal',
							left: '40%',
							bottom:'5%',
							data: res.data.legend
						},
						series: [
							{
								name:'累计上线设备数',
								type:'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									normal: {
										show: true,
										position: 'center',
										formatter:'{a}',
										textStyle:{
											fontSize:16
										}
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								data:res.data.data
							}
						]
					});
				}
			},(err)=>{
				console.log(err)
			})			
		},
		/**商家概览 -- 右上 */
		initCharts2(){
			var that = this;
			requestData('/api/index/merchant',{},'get').then((res)=>{
                if(res.status==200){
                    var	echarts = require('echarts');
					var myChart2 = echarts.init(document.getElementById('tab-two'));
					myChart2.setOption({
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} ({d}%)"
						},
						legend: {
							orient: 'horizontal',
							left: '35%',
							bottom:'5%',
							data:res.data.legend
						},
						series: [
							{
								name:'累计商家数',
								type:'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									normal: {
										show: true,
										position: 'center',
										formatter:'{a}',
										textStyle:{
											fontSize:16
										}
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								data:res.data.data
							}
						]
					});
				}
			},(err)=>{
				console.log(err)
			})	
			
		},
		/**筛选条件 年 */
		getYears(type){
			if(this.year_two && this.year_one){
				if(this.year_one > this.year_two){
					this.$message.error('开始时间不能大于结束时间');
					if(type==0){
						this.date_ = this.year_two;
					}else{
						this.date_ = this.year_one;
					}
				}else{
					this.date_ = this.year_one + '-' + this.year_two;
				}
			}else if(type==0?this.year_two:this.year_one){
				type==0 ?
				this.date_ = this.year_two : 
				this.date_ = this.year_one;
			}else{
				type==0 ?
				this.date_ = this.year_one : 
				this.date_ = this.year_two;
			}
		},
		/**筛选条件 月 */
		getMonths(type){
			if(this.month_two && this.month_one){
				if(this.month_one > this.month_two){
					this.$message.error('开始时间不能大于结束时间');
					if(type==0){
						this.date_ = this.month_two;
					}else{
						this.date_ = this.month_one;
					}
				}else{
					this.date_ = this.month_one + '-' + this.month_two;
				}
			}else if(type==0?this.month_two:this.month_one){
				type==0 ?
				this.date_ = this.month_two : 
				this.date_ = this.month_one;
			}else{
				type==0 ?
				this.date_ = this.month_one : 
				this.date_ = this.month_two;
			}
		},
		/**筛选条件 日 */
		getDayOne(){
			this.date_ = this.day_one;
		},
		/**切换年月日的button 控制折线图展示 */
		changeStates(type){
			switch (type) {
				case 'year':
					this.year = true;
					this.month = false;
					this.day = false;
					this.changeState = '年';
					this.types_year = 'primary';
					this.types_month = '';
					this.types_day = '';
					this.type_ = 0;
					this.initCharts3();
					break;
				case 'month':
					this.year = false;
					this.month = true;
					this.day = false;
					this.changeState = '月';
					this.types_year = '';
					this.types_month = 'primary';
					this.types_day = '';
					this.type_ = 1;
					this.initCharts3();
					break;
				case 'day':
					this.year = false;
					this.month = false;
					this.day = true;
					this.changeState = '日';
					this.types_year = '';
					this.types_month = '';
					this.types_day = 'primary';
					this.type_ = 2;
					this.initCharts3();
					break;
				default:
					break;
			}
		},
		/**下折线图 */
		initCharts3(){
			var	echarts = require('echarts');
			var myChart3 = echarts.init(document.getElementById('table-chart'));
			var option = null;
			var that = this;
			requestData('/api/index/sales',{
				type:this.type_,
				range:this.date_
			},'get').then((res)=>{
                if(res.status==200){
					option = {
						title: {
							text: '平台' + that.changeState + '销售数据',
							left: '45%',
							textStyle:{
								fontSize: 24,
								fontWeight: 'bold'
							}
						},
						legend: {
							data:res.data.legend,
							left:'20%'
						},
						tooltip: {
							trigger: 'axis'
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: res.data.xAxis
						},
						yAxis: {
							type: 'value'
						},
						series: res.data.series
					}
					that.$nextTick(function() {
						if(document.getElementById('table-chart')){
							var div_ = document.getElementById('table-chart');
							div_.removeAttribute("_echarts_instance_");
							var chart = echarts.init(div_, null, {
								renderer: 'canvas',
								width: 'auto',
							});
							chart.setOption(option,true);
						}
						window.addEventListener("resize", function() {
							chart.resize();
						});
					})
                }else{
                    that.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
			
		},
	}
}
</script>

