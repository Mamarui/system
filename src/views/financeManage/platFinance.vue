<template>
    <el-container class="container">
        <el-main class="main">
			<p class="title">累计商家未提现 ： <span class="num">{{topInfo.capitalPool}}</span> 元</p>
            <div class="top">
                <router-link to="platIncome" class="tab">
                    <p class="number">{{topInfo.total}}</p>
                    <p class="text">平台累计销售额（元）</p>
                </router-link>
                <router-link to="platIncome" class="tab">
                    <p>{{topInfo.platform_fee}}</p>
                    <p>平台累计收益（元）</p>
                </router-link>
                <router-link to="businessIncome" class="tab">
                    <p>{{topInfo.comission}}</p>
                    <p>返佣累计提现（元）</p>
                </router-link>
            </div>
            <div class="bottom">
                <div id="chart" class="table_chart"></div>
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
            margin: 0;
            margin-left: 2%;
			font-size: 22px;
			.num{
				color: #3CC43C;
			}
		}
		.top{
			width: 100%;
			height: 300px;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            .tab{
                width: 25%;
                height: 250px;
                background-color: rgb(235, 235, 235);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                :nth-child(1){
                    font-size: 32px;
                }
                :nth-child(2){
                    font-size: 16px;
                }
            }
		}
		.bottom{
			width: 100%;
			height: 500px;
			position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
			.table_chart{
				width: 92%;
				padding: 1%;
				height: 500px;
				background-color: #E6E6E6;
			}
			.stateBox{
				position: absolute;
				top: 2%;
				left: 7%;
			}
			.dateBox{
				width: 500px;
				height: 50px;
				position: absolute;
				right: 8%;
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
import $ from 'jquery'
import requestData  from '@/utils/requestMethod';
export default {
    data() {
        return {
				topInfo:{},				//上部分信息
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
		this.getTopInfo();
        this.initCharts();
    },
    methods:{
		/** 获取上部分信息 */
		getTopInfo(){
			requestData('/api/capi/overview',{},'get').then((res)=>{
                if(res.status==200){
                    this.topInfo = res.data;
                }else{
                    this.$message.error(res.message);
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
					this.initCharts();
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
					this.initCharts();
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
					this.initCharts();
					break;
				default:
					break;
			}
		},
		/**下折线图 */
		initCharts(){
			var	echarts = require('echarts');
			var myChart3 = echarts.init(document.getElementById('chart'));
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
						if(document.getElementById('chart')){
							var div_ = document.getElementById('chart');
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