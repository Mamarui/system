<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-select v-model="timeType">
                        <el-option label="创建时间" value="0"></el-option>
                        <el-option label="更新时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker v-model="day_one" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.cmkeys" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="exportXLS">XLS导出</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="merchant_name" label="商家名称" align="center"></el-table-column>
                <el-table-column prop="bank_account" label="商家返佣账号" align="center"></el-table-column>
                <el-table-column prop="merchant_fee_ratio" label="商家返佣比例" align="center" width="150"></el-table-column>
                <el-table-column prop="broker_name" label="中介" align="center"></el-table-column>
                <el-table-column prop="broker_account" label="中介返佣账号" align="center"></el-table-column>
                <el-table-column prop="broker_fee_ratio" label="中介返佣比例" align="center" width="150"></el-table-column>
                <el-table-column prop="gmt_created" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="gmt_modified" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="settings(scope.row.id,scope.$index)" type="text" size="small">配置</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <!-- 表格 -- 配置 弹窗 -->
        <el-dialog title="配置返佣" :visible.sync="set_visible" width="35%" center :close-on-click-modal='false' @close="set_cancel">
            <div class="userInfo">
                <p><span>返佣商家 ：</span>{{set_form.merchant_name}}</p>
                <p><span>货柜数量 ：</span>{{set_form.total}}</p>
                <p><span>货柜总容量 ：</span>{{set_form.volume}}</p>
            </div>
            <el-form :model="set_form" class="set_form" label-width="120px">
                <el-form-item label="商家返佣比例">
                    <el-input v-model="set_form.merchant_fee_ratio" placeholder="请输入"></el-input>
                    <span>%</span>
                </el-form-item>
                <el-form-item label="返佣中介">
                    <el-select v-model="set_form.broker" placeholder="请选择" style="width:80%">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in user_list" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中介返佣比例">
                    <el-input v-model="set_form.broker_fee_ratio" placeholder="请输入"></el-input>
                    <span>%</span>
                </el-form-item>
                <el-form-item label="平台收益比例">
                    <el-input v-model="set_form.platform_fee_ratio" disabled></el-input>
                    <span>%</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_cancel">取 消</el-button>
                <el-button @click="set_sure">确 定</el-button>
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
        /** 配置弹窗样式 */
        p{
            margin: 0;
            padding: 0;
            width: 45%;
            line-height: 27px;
            padding-left: 20px;
            span{
                font-weight: bold;
            }
        }
        .userInfo{
            height: 80px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            border-bottom: 1px dashed #837e7e;
            margin-bottom: 10px;
            padding-left: 1%;
        }
        .set_form{
            .el-form-item{
                position: relative;
                .el-input{
                    width: 80%;
                }
                span{
                    position: absolute;
                    right: 22%;
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
            timeType:'',        //时间类型
            searchForm:{
                gmt_created:'',
                gmt_modified:'',
                cmkeys:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            total:0,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            day_one:'',
            day_two:'',
            tableData:[],
            set_visible:false,        //配置 弹窗
            set_form:{                  //配置 弹窗 表单
                merchant_fee_ratio:'',
                broker:'',
                broker_fee_ratio:'',
                platform_fee_ratio:'',
            }, 
            user_list:[],               //中介列表
        }
    },
    mounted(){
        this.getList();
    },
    watch:{
        timeType:function(){
            this.searchForm.gmt_created = '';
            this.searchForm.gmt_modified = '';
        }
    },
    methods:{
        /** 获取列表 */
        getList(){
            requestData('/api/cmsnconfig/list',{
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
                    if(this.timeType == 0){
                        this.searchForm.gmt_created = this.day_one + '~' + this.day_two;
                    }else{
                        this.searchForm.gmt_modified = this.day_one + '~' + this.day_two;
                    }
                }
            }else if(this.day_one&&!this.day_two){
                if(this.timeType == 0){
                    this.searchForm.gmt_created = this.day_one;
                }else{
                    this.searchForm.gmt_modified = this.day_one;
                }
            }else{
                if(this.timeType == 0){
                    this.searchForm.gmt_created = this.day_two;
                }else{
                    this.searchForm.gmt_modified = this.day_two;
                }
            }
            this.getList();
        },
        /** XSL导出 */
        exportXLS(){

        },
        /** 中介列表 */
        getUserlist(){
            requestData('/api/user/list',{},'get').then((res)=>{
                if(res.status==200){
                    this.user_list = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 表单操作 配置 */
        settings(id,index){
            requestData('/api/cmsnconfig/detail',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.getUserlist();
                    this.set_form = res.data;
                    this.set_visible = true;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 弹窗操作 -- 取消 */
        set_cancel(){
            this.set_form = {                  //配置 弹窗 表单
                merchant_fee_ratio:'',
                broker:'',
                broker_fee_ratio:'',
                platform_fee_ratio:''
            };
            this.set_visible = false;
        },
        /** 弹窗操作 -- 确定 */
        set_sure(){
            requestData('/api/cmsnconfig/update',{
                id:this.set_form.id,
                merchant:this.set_form.merchant,
                merchant_fee_ratio:this.set_form.merchant_fee_ratio,
                broker:this.set_form.broker,
                broker_fee_ratio:this.set_form.broker_fee_ratio,
                platform_fee_ratio:this.set_form.platform_fee_ratio,
            },'get').then((res)=>{
                if(res.status==200){
                    this.$message.success(res.message);
                    this.getList();
                    this.set_visible = false;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        } ,

        /**页码操作 */
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.searchForm.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.searchForm.page = val;
            this.getList();
        },
    }
}
</script>