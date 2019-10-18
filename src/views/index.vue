<template>
    <el-container class="container">
		<el-main class="main">
			<p class="title">平台资金结余 ： <span class="num">200，000.00</span> 元</p>
			<div class="top">
				<div id="tab-one" class="tab_one"></div>
				<p class="title_in title_one">设备概览</p>
				<div class="icons icons-one">
					<svg-icon :icon-class="list_one" @click="changeTab(0,'one')"/>
					<svg-icon :icon-class="table_one" @click="changeTab(1,'one')"/>
				</div>
				<div id="tab-two" class="tab_two"></div>
				<p class="title_in title_two">今日商家概览</p>
				<div class="icons icons-two">
					<svg-icon :icon-class="list_two" @click="changeTab(0,'two')"/>
					<svg-icon :icon-class="table_two" @click="changeTab(1,'two')"/>
				</div>
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
						<el-date-picker v-model="month_one" type="month" placeholder="选择月" value-format="yyyy/MM" @change="getMonths(0)" :picker-options="pickerOptions">></el-date-picker>
						<span> - </span>
						<el-date-picker v-model="month_two" type="month" placeholder="选择月" value-format="yyyy/MM" @change="getMonths(1)" :picker-options="pickerOptions">></el-date-picker>
					</div>
					<div class="day" v-show="day">
						<el-date-picker type="date" v-model="day_one" value-format="yyyy/MM/dd" placeholder="选择日期" @change="getDayOne" :picker-options="pickerOptions">></el-date-picker>
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
			.icons{
				position: absolute;
				top: 10%;
				.svg-icon{
					width: 2em;
					height: 2em;
				}
			}
			.icons-one{
				left: 33%;
			}
			.icons-two{
				left: 83%;
			}
			.title_in{
				position: absolute;
				font-size: 18px;
				top: 0;
			}
			.title_one{
				left: 18%;
			}
			.title_two{
				left: 67%;
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
import $ from 'jquery'
export default {
	data() {
		return {
				list_one:'list-show',	//左上图表list默认展示
				table_one:'table-hide',	//左上图表table默认隐藏
				list_two:'list-show',	//右上图表list默认展示
				table_two:'table-hide',	//右上图表table默认隐藏
				showIfOne:true,			//控制图标list的展示隐藏
				showIfTwo:false,		//控制图标table的展示隐藏
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
				defaultYear:[],			//筛选条件默认时间 - 年
				defaultMonth:[],			//筛选条件默认时间 - 月
				defaultDay:[],			//筛选条件默认时间 - 日
				pickerOptions:{
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
			}
	},
	mounted(){
		this.getYear();
		this.initCharts1();
		this.initCharts2();
		this.initCharts5(this.defaultYear,'year');
	},
	methods:{
		/**左上图1 */
		initCharts1(){
			var	echarts = require('echarts');
			var myChart1 = echarts.init(document.getElementById('tab-one'));
			myChart1.setOption({
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: 'horizontal',
					left: '28%',
					bottom:'5%',
					data:['设备型号1','设备型号2','设备型号3']
				},
				series: [
					{
						name:'累计上线设备数',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data:[
							{
								value:335, 
								name:'设备型号1'
							},
							{
								value:310, 
								name:'设备型号2'
							},
							{
								value:234, 
								name:'设备型号3'
							}
						]
					}
				]
			});
		},
		/**右上图1 */
		initCharts2(){
			var	echarts = require('echarts');
			var myChart2 = echarts.init(document.getElementById('tab-two'));
			myChart2.setOption({
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: 'horizontal',
					left: '32%',
					bottom:'5%',
					data:['异常设备','缺货设备','正常']
				},
				series: [
					{
						name:'访问来源',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data:[
							{value:335, name:'异常设备'},
							{value:310, name:'缺货设备'},
							{value:234, name:'正常'}
						]
					}
				]
			});
		},
		/**左上图2 */
		initCharts3(){
			var	echarts = require('echarts');
			var myChart3 = echarts.init(document.getElementById('tab-one'));
			myChart3.setOption({
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: 'horizontal',
					left: '32%',
					bottom:'5%',
					data:['异常设备','缺货设备','正常']
				},
				series: [
					{
						name:'累计上线设备数',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data:[
							{value:335, name:'异常设备'},
							{value:310, name:'缺货设备'},
							{value:234, name:'正常'}
						]
					}
				]
			});
		},
		/**右上图2 */
		initCharts4(){
			var	echarts = require('echarts');
			var myChart4 = echarts.init(document.getElementById('tab-two'));
			myChart4.setOption({
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: 'horizontal',
					left: '35%',
					bottom:'5%',
					data:['未交易商家','有交易商家']
				},
				series: [
					{
						name:'累计上线设备数',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data:[
							{value:335, name:'未交易商家'},
							{value:310, name:'有交易商家'}
						]
					}
				]
			});
		},
		/**切换图标 控制top的图表展示 */
		changeTab(num,type){
			switch (num) {
				case 0:		//只有list为hide时才有操作
					if(type=='one'){	//左边 
						if(this.list_one=='list-hide'){
							this.list_one='list-show';
							this.table_one='table-hide';
							this.initCharts1();
						}
					}else{		//右边 
						if(this.list_two=='list-hide'){
							this.list_two='list-show';
							this.table_two='table-hide';
							this.initCharts2();
						}
					}
					break;
				case 1:	//只有table为hide时才有操作
					if(type=='one'){	//左边 
						if(this.table_one=='table-hide'){
							this.table_one='table-show';
							this.list_one='list-hide';
							this.initCharts3();
						}
					}else{		//右边 
						if(this.table_two=='table-hide'){
							this.table_two='table-show';
							this.list_two='list-hide';
							this.initCharts4();
						}
					}
					break;
				default:
					break;
			}
		},
		/**筛选条件 年 */
		getYears(type){
			this.defaultYear = [];
			if(this.year_two && this.year_one){
				if(this.year_one > this.year_two){
					this.$message.error('开始时间不能大于结束时间');
					if(type==0){
						this.year_one = '';
						this.defaultYear.push(this.year_two);
					}else{
						this.year_two = '';
						this.defaultYear.push(this.year_one);
					}
				}else{
					this.defaultYear.push(this.year_one,this.year_two);
				}
			}else if(type==0?this.year_two:this.year_one){
				type==0 ?
				this.defaultYear.push(this.year_two) : 
				this.defaultYear.push(this.year_one);
			}else{
				type==0 ? 
				this.defaultYear.push(this.year_one) : 
				this.defaultYear.push(this.year_two);
			}
		},
		/**筛选条件 月 */
		getMonths(type){
			this.defaultMonth = [];
			if(this.month_two && this.month_one){
				if(this.month_one > this.month_two){
					this.$message.error('开始时间不能大于结束时间');
					if(type==0){
						this.month_one = '';
						this.defaultMonth.push(this.month_two);
					}else{
						this.month_two = '';
						this.defaultMonth.push(this.month_one);
					}
				}else{
					this.defaultMonth.push(this.month_one,this.month_two);
				}
			}else if(type==0?this.month_two:this.month_one){
				type==0 ?
				this.defaultMonth.push(this.month_two) : 
				this.defaultMonth.push(this.month_one);
			}else{
				type==0 ? 
				this.defaultMonth.push(this.month_one) : 
				this.defaultMonth.push(this.month_two);
			}
		},
		/**筛选条件 日 */
		getDayOne(){
			this.defaultDay = [];
			this.defaultDay.push(this.day_one);
		},
		/**下折线图 */
		initCharts5(date,type){
			var	echarts = require('echarts');
			var myChart5 = echarts.init(document.getElementById('table-chart'));
			if(type=='day'){
				var datas = ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
			}else{
				var datas = date;
			}
			myChart5.setOption({
				title: {
					text: '平台' + this.changeState + '销售数据',
					left: '45%',
					textStyle:{
						fontSize: 24,
						fontWeight: 'bold'
					}
				},
				legend: {
					data:datas
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
					data: datas
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name:'邮件营销',
						type:'line',
						stack: '总量',
						data:[120, 132, 101, 134, 90, 230, 210]
					},
					{
						name:'联盟广告',
						type:'line',
						stack: '总量',
						data:[220, 182, 191, 234, 290, 330, 310]
					},
					{
						name:'视频广告',
						type:'line',
						stack: '总量',
						data:[150, 232, 201, 154, 190, 330, 410]
					},
					{
						name:'直接访问',
						type:'line',
						stack: '总量',
						data:[320, 332, 301, 334, 390, 330, 320]
					},
					{
						name:'搜索引擎',
						type:'line',
						stack: '总量',
						data:[820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			});
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
					this.getYear();
					this.initCharts5(this.defaultYear,'year');
					this.defaultMonth = [];
					this.defaultDay = [];
					break;
				case 'month':
					this.year = false;
					this.month = true;
					this.day = false;
					this.changeState = '月';
					this.types_year = '';
					this.types_month = 'primary';
					this.types_day = '';
					this.getMonth();
					this.initCharts5(this.defaultMonth,'month');
					this.defaultYear = [];
					this.defaultDay = [];
					break;
				case 'day':
					this.year = false;
					this.month = false;
					this.day = true;
					this.changeState = '日';
					this.types_year = '';
					this.types_month = '';
					this.types_day = 'primary';
					this.getDay();
					this.initCharts5(this.defaultDay,'day');
					this.defaultYear = [];
					this.defaultMonth = [];
					break;
				default:
					break;
			}
		},

		/**获取当前年份 */
		getYear(){		//年
			var today = new Date();
			
			var tYear = today.getFullYear();
			this.defaultYear.push(tYear);
		},
		getMonth(){		//月
			var today = new Date();
			
			var tYear = today.getFullYear();
			var tMonth = today.getMonth();
			this.defaultMonth.push(tYear + '/' + (tMonth + 1));
		},
		getDay(){	//天
            var today = new Date();
			
			var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            tMonth = this.doHandleMonth(tMonth + 1);
            var tDate = today.getDate();
			tDate = this.doHandleDate(tDate);
			this.defaultDay.push(tYear + '/' + tMonth + '/' + tDate);
		},
        doHandleMonth(month){
            var m = month;
            if(month.toString().length == 1){
                m = '0' + month;
            }
            return m;
        },
        doHandleDate(date){
            var d = date;
            if(date.toString().length == 1){
                d = '0' + date;
            }
            return d;
        },
	}
}
</script>

