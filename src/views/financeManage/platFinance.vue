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
		this.getTopInfo();
		this.getYear();
        this.initCharts(this.defaultYear,'year');
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
		initCharts(date,type){
			var	echarts = require('echarts');
			var myChart = echarts.init(document.getElementById('chart'));
			if(type=='day'){
				var datas = ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
			}else{
				var datas = date;
			}
			myChart.setOption({
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
					this.initCharts(this.defaultYear,'year');
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
					this.initCharts(this.defaultMonth,'month');
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
					this.initCharts(this.defaultDay,'day');
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