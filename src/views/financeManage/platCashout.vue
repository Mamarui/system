<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="到账状态">
                    <el-select v-model="searchForm.withdraw_status">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item" :value="index" v-for="(item,index) in withdraw_status" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提现时间">
                    <el-date-picker v-model="day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item style="margin-right:5%;">
                    <el-input v-model="searchForm.keywords" placeholder="请输入商家名称/流水号/手机号" style="width:125%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="exportXLS">XLS导出</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="orderuser" label="提现流水" align="center"></el-table-column>
                <el-table-column prop="orderprice" label="提现金额(元)" align="center"></el-table-column>
                <el-table-column prop="orderbusiness" label="商家名称" align="center"></el-table-column>
                <el-table-column prop="orderaccount" label="商家提现账号" align="center"></el-table-column>
                <el-table-column prop="orderway" label="提现方式" align="center"></el-table-column>
                <el-table-column prop="backprice" label="商家资金余额(元)" align="center"></el-table-column>
                <el-table-column prop="paystate" label="到账状态" align="center"></el-table-column>
                <el-table-column prop="paidtime" label="提现时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.row.id,scope.$index)" type="text" size="small">查看明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <el-dialog title="提现明细" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
            <div class="main">
                <div class="userInfo infoBox">
                    <p><span>提现流水 ：</span>{{details.withdraw_no}}</p>
                    <p><span>提现方式 ：</span>{{details.type}}</p>
                    <p><span>提现账号 ：</span>{{details.bank_account}}</p>
                    <p><span>提现金额 ：</span>{{details.amount}}元</p>
                    <p><span>提现时间 ：</span>{{details.gmt_created}}</p>
                    <p><span>到账状态 ：</span>{{details.withdraw_status}}</p>
                </div>
                <div class="orderInfo infoBox">
                    <p><span>商家名称 ：</span>{{details.merchant_name}}</p>
                    <p><span>中介 ：</span>{{details.contact}}</p>
                    <p><span>手机号 ：</span>{{details.phone}}</p>
                    <p><span>商家累计提现 ：</span>{{details.his_amount}}元</p>
                    <!-- <p><span>商家资金账号 ：</span>{{details.withdraw_no}}</p> -->
                    <p><span>商家资金余额 ：</span>{{details.balance}}元</p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="curVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<style lang="scss" scoped>
    .container{
        padding: 20px;
        .header{
            margin-left: 1%;
            .form{
                .el-form-item{
                    margin-bottom: 0;
                }
            }
        }
        .el-main{
            margin: 0;
            padding: 0;
        }
        .footer{
            .total{
                float: left;
                margin: 0;
                padding: 0;
                margin-top: 10px;
                font-size: 14px;
                color: #606266;
                span{
                    color: red;
                    margin: 0 5px;
                }
            }
            .pages{
                float: right;
                margin-top: 10px;
            }
        }
        /** 详情弹窗样式 */
        .main{
            max-height: 550px;
            overflow: auto;
            p{
                margin: 0;
                padding: 0;
                width: 45%;
                line-height: 27px;
                padding-left: 20px;
                font-size: 16px;
                color: rgb(29, 28, 28);
                span{
                    color: #6e6a6a;
                }
            }
            .infoBox{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                margin-bottom: 10px;
            }
            .userInfo{
                border-bottom: 1px dashed #837e7e;
                height: 130px;
            }
            .orderInfo{
                height: 100px;
            }
        }
    }
</style>

<script>
import requestData  from '@/utils/requestMethod';
export default {
    data() {
        return {
            withdraw_status:[],     //到账状态
            searchForm:{
                withdraw_status:'',
                gmt_created:'',
                keywords:'',
                page:1,
                limit:10,
            },
            day_one:'',
            day_two:'',
            pagesizes:[10,20,50,100],
            total:100,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            tableData:[],
            curVisible:false,        //用户详情 弹窗
            details:{},             //用户详情
        }
    },
    mounted(){
        this.getStatus();
        this.getList();
    },
    methods:{
        /**获取到账状态 */
        getStatus(){
            requestData('/api/orders/transfer_status',{},'get').then((res)=>{
                if(res.status==200){
                    this.withdraw_status = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 获取列表 */
        getList(){
            requestData('/api/capi/merchat/withdrawlog/list',{
                ...this.searchForm
            },'get').then((res)=>{
                if(res.status==200){
                    this.tableData = res.data;
                    this.total = res.count;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 搜索 */
        search(){
            if(this.day_one&&this.day_two){
                if(this.day_one > this.day_two){
                    this.$message.error('开始时间不能大于结束时间！');
                }else{
                    this.searchForm.gmt_created = this.day_one + '~' + this.day_two;
                }
            }else if(this.day_one && !this.day_two){
                this.searchForm.gmt_created = this.day_one;
            }else{
                this.searchForm.gmt_created = this.day_two;
            }
            this.getList();
        },
        /** XSL导出 */
        exportXLS(){

        },
        /** 表单操作 查看 */
        view(id,index){
            requestData('/api/withdrawlog/detail',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.details = res.data;
                    this.curVisible = true;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /**页码操作 */
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
    }
}
</script>