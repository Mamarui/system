<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-select v-model="timeType">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="支付时间" value="0"></el-option>
                        <el-option label="结算时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker v-model="day_one" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.kywords" placeholder="请输入订单号/商家名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <!-- <el-button type="primary" @click="exportXLS">XLS导出</el-button> -->
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="order_no" label="订单号" align="center" width="250"></el-table-column>
                <el-table-column prop="total" label="订单金额(元)" align="center"></el-table-column>
                <el-table-column prop="gmt_created" label="支付时间" align="center"></el-table-column>
                <el-table-column prop="merchant" label="订单商家" align="center"></el-table-column>
                <el-table-column prop="merchant_fee_ratio" label="返佣比例" align="center"></el-table-column>
                <el-table-column prop="bank_account" label="商家账号" align="center"></el-table-column>
                <el-table-column prop="merchant_fee" label="商家收入(元)" align="center"></el-table-column>
                <el-table-column prop="gmt_settle" label="结算时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.row.id,scope.$index)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <el-dialog title="收入详情" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
            <div class="main">
                <div class="userInfo infoBox">
                    <p><span>订单用户 ：</span>{{source.customer}}</p>
                    <p><span>用户手机 ：</span>{{source.phone}}</p>
                    <p><span>订单号 ：</span>{{source.order_no}}</p>
                    <p><span>订单状态 ：</span>{{source.order_status}}</p>
                    <p><span>交易状态 ：</span>{{source.trade_status}}</p>
                    <p><span>订单金额 ：</span>{{source.total}}</p>
                    <p><span>订单商品数 ：</span>{{source.shopNum}}</p>
                    <p><span>支付时间 ：</span>{{source.gmt_created}}</p>
                </div>
                <div class="orderInfo infoBox">
                    <p><span>订单商家 ：</span>{{source.merchant_name}}</p>
                    <p><span>货柜名 ：</span>{{source.container_name}}</p>
                    <p><span>货柜容量 ：</span>{{source.volume}}</p>
                    <p><span>货柜型号 ：</span>{{source.model_name}}</p>
                    <p><span>货柜编号 ：</span>{{source.surface_no}}</p>
                </div>
                <div class="productInfoBox" v-if="source.goods_list&&source.goods_list.length!=0">
                    <div class="productInfo" v-for="(item,index) in source.goods_list" :key="index">
                        <p><span>售出商品 ：</span>{{item.goods_name}}</p>
                        <p><span>货柜位置 ：</span>{{item.grid_location}}</p>
                        <p><span>单价 ：</span>{{item.price}}元</p>
                        <p><span>数量 ：</span>{{item.amount}}</p>
                    </div>
                </div>
                <div class="backInfo infoBox">
                    <p><span>平台收入 ：</span>{{source.platform_fee}}元</p>
                    <p><span>返佣管理者 ：</span>{{source.broker_name}}</p>
                    <p><span>返佣比例 ：</span>{{source.broker_fee_ratio}}%</p>
                    <p><span>返佣金额 ：</span>{{source.broker_fee}}元</p>
                    <p><span>返佣账号 ：</span>{{source.broker_account}}</p>
                    <p><span>到账状态 ：</span>{{source.trade_status}}</p>
                    <p><span>（商家）返佣比例 ：</span>{{source.merchant_fee_ratio}}%</p>
                    <p><span>商家收入 ：</span>{{source.merchant_fee}}</p>
                    <p><span>商家账号 ：</span>{{source.bank_account}}</p>
                    <p><span>结算时间 ：</span>{{source.gmt_settle}}</p>
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
import requestData  from '@/utils/requestMethod';
export default {
    data() {
        return {
            searchForm:{
                gmt_created:'',     //支付时间
                gmt_settle:'',      //结算时间
                kywords:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            total:100,
            timeType:'',    //时间切换类型
            day_one:'',
            day_two:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            tableData:[],
            curVisible:false,        //用户详情 弹窗
            source:{},              //用户详情 对象
        }
    },
    watch:{
        timeType:function(){    //切换时间类型时 将之前的赋值清空
            this.searchForm.gmt_created = '';
            this.searchForm.gmt_settle = '';
        }
    },
    mounted(){
        this.getList();
    },
    methods:{
        /** 获取列表 */
        getList(){
            requestData('/api/capi/merchat/income/list',{
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
            if(this.day_one && this.day_two){
                if(this.day_one > this.day_two){
                    this.$message.error('开始时间不能大于结束时间！');
                }else{
                    if(this.timeType == 0){     //支付时间
                        this.searchForm.gmt_created = this.day_one + '-' + this.day_two;
                    }else{                      //结算时间
                        this.searchForm.gmt_settle = this.day_one + '-' + this.day_two;
                    }
                }
            }else if(this.day_one && !this.day_two){
                if(this.timeType == 0){     //支付时间
                    this.searchForm.gmt_created = this.day_one;
                }else{                      //结算时间
                    this.searchForm.gmt_settle = this.day_one;
                }
            }else{
                if(this.timeType == 0){     //支付时间
                    this.searchForm.gmt_created = this.day_two;
                }else{                      //结算时间
                    this.searchForm.gmt_settle = this.day_two;
                }
            }
            this.getList();
        },
        /** XSL导出 */
        exportXLS(){

        },
        /** 表单操作 查看 */
        view(id,index){
            requestData('/api/capi/source',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.source = res.data;
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
            this.searchForm.limit = val;
            this.getList();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.searchForm.page = val;
            this.getList();
            console.log(`当前页: ${val}`);
        },
    }
}
</script>