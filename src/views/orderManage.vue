<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="订单状态">
                    <el-select v-model="searchForm.order_status">
                        <el-option :label="item" value="index" v-for="(item,index) in order_status" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易状态">
                    <el-select v-model="searchForm.trade_status">
                        <el-option :label="item" value="index" v-for="(item,index) in trade_status" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付时间">
                    <el-date-picker v-model="searchForm.beganDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="searchForm.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.keyword" placeholder="请输入订单号/用户手机/订单商家"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="exportXLS">XLS导出</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="name" label="订单用户" align="center"></el-table-column>
                <el-table-column prop="phone" label="用户手机" align="center" width="120"></el-table-column>
                <el-table-column prop="orderId" label="订单号" align="center"></el-table-column>
                <el-table-column prop="order_status" label="订单状态" align="center" width="100"></el-table-column>
                <!-- <el-table-column prop="orderprice" label="订单金额" align="center"></el-table-column> -->
                <el-table-column prop="total" label="订单商品数" align="center" width="100"></el-table-column>
                <!-- <el-table-column prop="business" label="订单商家" align="center"></el-table-column> -->
                <el-table-column prop="surface_no" label="货柜编号" align="center"></el-table-column>
                <el-table-column prop="trade_status" label="交易状态" align="center" width="100"></el-table-column>
                <el-table-column prop="gmt_settle" label="支付时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="60">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.row.id,scope.$index)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <el-dialog title="订单详情" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
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
                <div class="orderTotal">
                    <p><span>订单合计 ：</span>张三</p>
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
import requestData  from '@/utils/requestMethod';
import regRxp from '@/utils/validate';
export default {
    data() {
        return {
            searchForm:{
                order_status:'',
                trade_status:'',
                beganDate:'',
                endDate:'',
                keyword:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            total:100,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            order_status:[],        //筛选项 -- 订单状态
            trade_status:[],        //筛选项 -- 交易状态
            tableData:[],
            curVisible:false,                //订单详情 弹窗
        }
    },
    mounted(){
        /** 筛选项获取 */
        this.getOrderstatus();
        this.getTradestatus();
        /** 筛选项获取 */
        this.getList();
    },
    methods:{
        /** 筛选项 -- 获取订单状态 */
        getOrderstatus(){
            requestData('/api/orders/order_status',{},'get').then((res)=>{
                if(res.status==200){
                    this.order_status = res.data;
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 筛选项 -- 获取交易状态 */
        getTradestatus(){
            requestData('/api/orders/trade_status',{},'get').then((res)=>{
                if(res.status==200){
                    this.trade_status = res.data;
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 获取订单列表 */
        getList(){
            requestData('/api/orders/pcList',{
                ...this.searchForm
            },'get').then((res)=>{
                if(res.status==200){
                    this.tableData = res.data;
                    this.total = res.count;
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 搜索 */
        search(){
            console.log(this.searchForm)
        },
        /** 导出xls */
        exportXLS(){

        },
        /** 表格操作 -- 查看 */
        view(id,index){
            console.log(id)
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