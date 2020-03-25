<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="最近交易时间">
                    <el-date-picker v-model="day_one" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.userKeywords" placeholder="请输入订单用户/手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <!-- <el-button type="primary" @click="exportXLS">XLS导出</el-button> -->
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="name" label="订单用户" align="center"></el-table-column>
                <el-table-column prop="phone" label="用户手机号" align="center"></el-table-column>
                <el-table-column prop="total" label="累计交易金额(元)" align="center"></el-table-column>
                <el-table-column prop="gmt_settle" label="最近交易时间" align="center"></el-table-column>
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
        <el-dialog title="用户详情" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
            <div class="main">
                <div class="basicInfoBox">
                    <h3>用户基础信息</h3>
                    <div class="basicInfo">
                        <p><span>订单用户 ：</span>{{details.customerName}}</p>
                        <p><span>用户手机 ：</span>{{details.customerPhone}}</p>
                        <p><span>已支付/未支付交易 ：</span>{{details.payOrder}}/{{details.unPayOrder}}</p>
                        <p><span>累计交易金额 ：</span>{{details.payMoney}}元</p>
                        <p><span>首次交易时间 ：</span>{{details.firstPayDate}}</p>
                        <p><span>最近交易时间 ：</span>{{details.recentPayDate}}</p>
                    </div>
                </div>
                <div class="tradeListBox">
                    <h3>用户交易流水</h3>
                    <div class="tradeList">
                        <section class="tradeBox" v-for="(item,index) in details.dtoList" :key="index">
                            <p><span>订单号 ：</span>{{item.orderNumber}}</p>
                            <p><span>订单商品数 ：</span>{{item.goodsNum}}</p>
                            <p><span>订单金额 ：</span>{{item.orderMoney}}元</p>
                            <p><span>订单状态 ：</span>{{item.orderStatus}}</p>
                            <p><span>支付时间 ：</span>{{item.payDate}}</p>
                            <p><span>交易状态 ：</span>{{item.tradeStatus}}</p>
                        </section>
                    </div>
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
        /** 用户详情 弹窗样式 */
        .main{
            h3,p{
                margin: 0;
            }
            h3{
                line-height: 27px;
            }
            .basicInfoBox{
                .basicInfo{
                    padding-left: 20px;
                    height: 100px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: center;
                    p{
                        width: 45%;
                        font-size: 16px;
                        color: rgb(29, 28, 28);
                        span{
                            color: #6e6a6a;
                        }
                    }
                }
            }
            .tradeListBox{
                .tradeList{
                    max-height: 350px;
                    overflow: auto;
                    // padding-left: 20px;
                    .tradeBox{
                        height: 100px;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        align-items: center;
                        border-bottom: 1px dashed #837e7e;
                        margin-bottom: 10px;
                        p{
                            width: 45%;
                            font-size: 16px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            color: rgb(29, 28, 28);
                            padding-left: 20px;
                            span{
                                color: #6e6a6a;
                            }
                        }
                    }
                    :last-child{
                        border-bottom: none;
                    }
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
                gmt_settle:'',
                userKeywords:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            total:100,
            day_one:'',
            day_two:'',
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
        this.getList();
    },
    methods:{
        /** 获取列表 */
        getList(){
            requestData('/api/orders/user/pcList',{
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
            if(this.day_one && this.day_two){
                if(this.day_one > this.day_two){
                    this.$message.error('开始时间不能大于结束时间！');
                }else{
                    this.searchForm.gmt_settle = this.day_one + '-' + this.day_two;
                }
            }else if(this.day_one && !this.day_two){
                this.searchForm.gmt_settle = this.day_one;
            }else{
                this.searchForm.gmt_settle = this.day_two;
            }
            this.getList();
        },
        /** XSL导出 */
        exportXLS(){

        },
        /** 表单操作 查看 */
        view(id,index){
            requestData('/api/orders/user/userOrderDetail',{
                id:id,
                orderSize:3
            },'get').then((res)=>{
                if(res.status==200){
                    this.curVisible = true;
                    this.details = res.data;
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