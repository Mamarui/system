<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-select v-model="searchForm.paytime">
                        <el-option label="支付时间" value="0"></el-option>
                        <el-option label="结算时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker v-model="searchForm.day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="searchForm.day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入订单号/商家名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="exportXLS">XLS导出</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="orderuser" label="订单用户" align="center"></el-table-column>
                <el-table-column prop="orderprice" label="订单金额(元)" align="center"></el-table-column>
                <el-table-column prop="paytime" label="支付时间" align="center"></el-table-column>
                <el-table-column prop="platincome" label="平台收入(元)" align="center"></el-table-column>
                <el-table-column prop="business" label="订单商家" align="center"></el-table-column>
                <el-table-column prop="paidtime" label="结算时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.$index)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <p class="total">订单累计<span>200，000.00</span>元，平台累计收入<span>20，000.00</span>元</p>
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <el-dialog title="收入详情" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
            <div class="main">
                <div class="userInfo infoBox">
                    <p><span>订单用户 ：</span>张三</p>
                    <p><span>用户手机 ：</span>13526261414</p>
                    <p><span>订单号 ：</span>13526261414</p>
                    <p><span>订单状态 ：</span>13526261414</p>
                    <p><span>交易状态 ：</span>12/1</p>
                    <p><span>订单金额 ：</span>5.00元</p>
                    <p><span>订单商品数 ：</span>2019/10/09 15：00：20</p>
                    <p><span>支付时间 ：</span>2019/10/17 05：00：00</p>
                </div>
                <div class="orderInfo infoBox">
                    <p><span>订单商家 ：</span>张三</p>
                    <p><span>货柜名 ：</span>13526261414</p>
                    <p><span>货柜容量 ：</span>12/1</p>
                    <p><span>货柜型号 ：</span>5.00元</p>
                    <p><span>货柜编号 ：</span>2019/10/09 15：00：20</p>
                </div>
                <div class="productInfoBox">
                    <div class="productInfo">
                        <p><span>售出商品1 ：</span>张三</p>
                        <p><span>货柜位置 ：</span>13526261414</p>
                        <p><span>单价 ：</span>5.00元</p>
                        <p><span>数量 ：</span>2019/10/09 15：00：20</p>
                    </div>
                    <div class="productInfo">
                        <p><span>售出商品1 ：</span>张三</p>
                        <p><span>货柜位置 ：</span>13526261414</p>
                        <p><span>单价 ：</span>5.00元</p>
                        <p><span>数量 ：</span>2019/10/09 15：00：20</p>
                    </div>
                    <div class="productInfo">
                        <p><span>售出商品1 ：</span>张三</p>
                        <p><span>货柜位置 ：</span>13526261414</p>
                        <p><span>单价 ：</span>5.00元</p>
                        <p><span>数量 ：</span>2019/10/09 15：00：20</p>
                    </div>
                    <div class="productInfo">
                        <p><span>售出商品1 ：</span>张三</p>
                        <p><span>货柜位置 ：</span>13526261414</p>
                        <p><span>单价 ：</span>5.00元</p>
                        <p><span>数量 ：</span>2019/10/09 15：00：20</p>
                    </div>
                </div>
                <div class="backInfo infoBox">
                    <p><span>平台收入 ：</span>2000元</p>
                    <p><span>返佣管理者 ：</span>张三</p>
                    <p><span>返佣比例 ：</span>3%</p>
                    <p><span>返佣金额 ：</span>600</p>
                    <p><span>返佣账号 ：</span>1211111111</p>
                    <p><span>到账状态 ：</span>到账</p>
                    <p><span>（商家）返佣比例 ：</span>90%</p>
                    <p><span>商家收入 ：</span>1800</p>
                    <p><span>商家账号 ：</span>2222222222</p>
                    <p><span>结算时间 ：</span>2019/10/17 05：00：00</p>
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
                border-bottom: 1px dashed #837e7e;
                margin-bottom: 10px;
            }
            .userInfo{
                height: 130px;
            }
            .orderInfo{
                height: 100px;
            }
            .backInfo{
                height: 150px;
                border-bottom: none;
            }
            .productInfoBox{
                border-bottom: 1px dashed #837e7e;
                margin-bottom: 10px;
                .productInfo{
                    height: 60px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                }
                :last-child{
                    margin-bottom: 0;
                }
            }
        }
    }
</style>

<script>
export default {
    data() {
        return {
            searchForm:{
                paytime:'',
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
                    paytime:'2018/10/2 12：00：00',
                    platincome:'23232323',
                    business:'天上人间',
                    paidtime:'2015/11/10 15：00：15'
                },
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    paytime:'2018/10/2 12：00：00',
                    platincome:'23232323',
                    business:'天上人间',
                    paidtime:'2015/11/10 15：00：15'
                },
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    paytime:'2018/10/2 12：00：00',
                    platincome:'23232323',
                    business:'天上人间',
                    paidtime:'2015/11/10 15：00：15'
                },
                {
                    orderuser:'天上人间',
                    orderprice:'500，00.000',
                    paytime:'2018/10/2 12：00：00',
                    platincome:'23232323',
                    business:'天上人间',
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