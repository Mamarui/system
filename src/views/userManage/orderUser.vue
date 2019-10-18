<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="交易时间">
                    <el-select v-model="searchForm.paytime">
                        <el-option label="首次交易时间" value="0"></el-option>
                        <el-option label="最近交易时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker v-model="searchForm.day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="searchForm.day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入订单用户/手机号"></el-input>
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
                <el-table-column prop="mobile" label="用户手机号" align="center"></el-table-column>
                <el-table-column prop="havepaid" label="已支付交易" align="center"></el-table-column>
                <el-table-column prop="nopay" label="未支付交易" align="center"></el-table-column>
                <el-table-column prop="totalpay" label="累计交易金额(元)" align="center"></el-table-column>
                <el-table-column prop="firsttime" label="首次交易时间" align="center"></el-table-column>
                <el-table-column prop="recenttime" label="最近交易时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.$index)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <el-dialog title="用户详情" :visible.sync="curVisible" width="45%" @close="curVisible = false" center :close-on-click-modal='false'>
            <div class="main">
                <div class="basicInfoBox">
                    <h3>用户基础信息</h3>
                    <div class="basicInfo">
                        <p><span>订单用户 ：</span>张三</p>
                        <p><span>用户手机 ：</span>13526261414</p>
                        <p><span>已支付/未支付交易 ：</span>12/1</p>
                        <p><span>累计交易金额 ：</span>5.00元</p>
                        <p><span>首次交易时间 ：</span>2019/10/09 15：00：20</p>
                        <p><span>最近交易时间 ：</span>2019/10/17 05：00：00</p>
                    </div>
                </div>
                <div class="tradeListBox">
                    <h3>用户交易流水</h3>
                    <div class="tradeList">
                        <section class="tradeBox">
                            <p><span>订单号 ：</span>151515151515151515115151515</p>
                            <p><span>订单商品数 ：</span>16</p>
                            <p><span>订单金额 ：</span>5.00元</p>
                            <p><span>订单状态 ：</span>已支付</p>
                            <p><span>支付时间 ：</span>2019/10/09 15：00：20</p>
                            <p><span>交易状态 ：</span>交易成功</p>
                        </section>
                        <section class="tradeBox">
                            <p><span>订单号 ：</span>151515151515151515115151515</p>
                            <p><span>订单商品数 ：</span>16</p>
                            <p><span>订单金额 ：</span>5.00元</p>
                            <p><span>订单状态 ：</span>已支付</p>
                            <p><span>支付时间 ：</span>2019/10/09 15：00：20</p>
                            <p><span>交易状态 ：</span>交易成功</p>
                        </section>
                        <section class="tradeBox">
                            <p><span>订单号 ：</span>151515151515151515115151515</p>
                            <p><span>订单商品数 ：</span>16</p>
                            <p><span>订单金额 ：</span>5.00元</p>
                            <p><span>订单状态 ：</span>已支付</p>
                            <p><span>支付时间 ：</span>2019/10/09 15：00：20</p>
                            <p><span>交易状态 ：</span>交易成功</p>
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
                    mobile:'13526263535',
                    havepaid:'151515151',
                    nopay:'23232323',
                    totalpay:'500，00.000',
                    firsttime:'2015/11/10 15：00：15',
                    recenttime:'2018/10/2 12：00：00'
                },
                {
                    orderuser:'天上人间',
                    mobile:'13526263535',
                    havepaid:'151515151',
                    nopay:'23232323',
                    totalpay:'500，00.000',
                    firsttime:'2015/11/10 15：00：15',
                    recenttime:'2018/10/2 12：00：00'
                },
                {
                    orderuser:'天上人间',
                    mobile:'13526263535',
                    havepaid:'151515151',
                    nopay:'23232323',
                    totalpay:'500，00.000',
                    firsttime:'2015/11/10 15：00：15',
                    recenttime:'2018/10/2 12：00：00'
                },
                {
                    orderuser:'天上人间',
                    mobile:'13526263535',
                    havepaid:'151515151',
                    nopay:'23232323',
                    totalpay:'500，00.000',
                    firsttime:'2015/11/10 15：00：15',
                    recenttime:'2018/10/2 12：00：00'
                },
                {
                    orderuser:'天上人间',
                    mobile:'13526263535',
                    havepaid:'151515151',
                    nopay:'23232323',
                    totalpay:'500，00.000',
                    firsttime:'2015/11/10 15：00：15',
                    recenttime:'2018/10/2 12：00：00'
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