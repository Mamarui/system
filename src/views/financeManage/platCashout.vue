<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-select v-model="searchForm.paystate" placeholder="到账状态">
                        <el-option label="所有" value=""></el-option>
                        <el-option label="到账" value="0"></el-option>
                        <el-option label="转账中" value="1"></el-option>
                        <el-option label="转账失败" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提现时间">
                    <el-date-picker v-model="searchForm.day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="searchForm.day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item style="margin-right:5%;">
                    <el-input v-model="searchForm.name" placeholder="请输入商家名称/流水号/手机号" style="width:125%"></el-input>
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
                        <el-button @click.native.prevent="view(scope.$index)" type="text" size="small">查看明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <p class="total">累计提现<span>200，000.00</span>元，累计商家未提现<span>20，000.00</span>元</p>
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <el-dialog title="提现明细" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
            <div class="main">
                <div class="userInfo infoBox">
                    <p><span>提现流水 ：</span>1561561561561</p>
                    <p><span>提现方式 ：</span>银行卡转账</p>
                    <p><span>提现账号 ：</span>13526261414</p>
                    <p><span>提现金额 ：</span>5.00元</p>
                    <p><span>提现时间 ：</span>2019/10/09 15：00：20</p>
                    <p><span>到账状态 ：</span>转帐中</p>
                </div>
                <div class="orderInfo infoBox">
                    <p><span>商家名称 ：</span>天上人间</p>
                    <p><span>中介 ：</span>张三</p>
                    <p><span>手机号 ：</span>15101256644</p>
                    <p><span>商家累计提现 ：</span>5.00元</p>
                    <p><span>商家资金账号 ：</span>22525252525255</p>
                    <p><span>商家资金余额 ：</span>5.00元</p>
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
export default {
    data() {
        return {
            searchForm:{
                paystate:'',
                day_one:'',
                day_two:'',
                name:'',
                curpage:1,
                pagesizes:[10,20,50,100],
                pagesize:10,
                total:100
            },
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            tableData:[
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    orderbusiness:'天上人间',
                    orderaccount:'456454645',
                    orderway:'银行卡转账',
                    backprice:'200',
                    paystate:'到账',
                    paidtime:'2015/11/10 15：00：15'
                },
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    orderbusiness:'天上人间',
                    orderaccount:'456454645',
                    orderway:'银行卡转账',
                    backprice:'200',
                    paystate:'到账',
                    paidtime:'2015/11/10 15：00：15'
                },
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    orderbusiness:'天上人间',
                    orderaccount:'456454645',
                    orderway:'银行卡转账',
                    backprice:'200',
                    paystate:'到账',
                    paidtime:'2015/11/10 15：00：15'
                },
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    orderbusiness:'天上人间',
                    orderaccount:'456454645',
                    orderway:'银行卡转账',
                    backprice:'200',
                    paystate:'到账',
                    paidtime:'2015/11/10 15：00：15'
                },
            ],
            curVisible:false,        //用户详情 弹窗
        }
    },
    methods:{
        /** 搜索 */
        search(){
            console.log(this.searchForm)
        },
        /** XSL导出 */
        exportXLS(){

        },
        /** 表单操作 查看 */
        view(index){
            // console.log(index)
            this.curVisible = true;
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