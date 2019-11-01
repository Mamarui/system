<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item style="margin-right:1%;">
                    <el-input v-model="searchForm.name" placeholder="请输入中介名称/中介账号" style="width:105%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="add_edit('add')"><svg-icon icon-class="add" style="margin-right:5px;"/>添加</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="mediumuser" label="中介姓名" align="center"></el-table-column>
                <el-table-column prop="accountType" label="账号类型" align="center"></el-table-column>
                <el-table-column prop="mediumAccount" label="中介账号" align="center"></el-table-column>
                <el-table-column prop="backprice" label="累计返佣金额(元)" align="center"></el-table-column>
                <el-table-column prop="addtime" label="添加时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="add_edit('edit',scope.$index)" type="text" size="small">编辑</el-button>
                        <el-button @click.native.prevent="deletes(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <p class="total">累计返佣金额<span>200，000.00</span>元</p>
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <!-- 编辑/添加弹窗 -->
        <el-dialog title="添加/编辑" :visible.sync="editVisible" width="35%" center :close-on-click-modal='false'>
            <el-form ref="form" :model="add_edit_form" label-width="80px">
                <el-form-item label="中介姓名">
                    <el-input v-model="add_edit_form.name" placeholder="请输入中介姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="add_edit_form.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="add_edit_form.accountType" placeholder="请选择" style="width:100%">
                        <el-option label="银行卡" value="0"></el-option>
                        <el-option label="支付宝" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提现账号">
                    <el-input v-model="add_edit_form.account" placeholder="请输入账号"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="add_edit_cancel">取 消</el-button>
                <el-button @click="add_edit_sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 清除/删除 第一次提示弹窗 -->
        <el-dialog title="中介删除提示" :visible.sync="curVisible" width="30%" @close="curVisible = false" :close-on-click-modal='false'>
            <span style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>删除该中介后，该中介无法从平台获利</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="curVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureClick">删除该中介</el-button>
            </span>
        </el-dialog>
        <!-- 清除/删除 第二次提示弹窗 -->
        <el-dialog title="输入密码" :visible.sync="curShowOne" width="30%" @close="closeDialog" :close-on-click-modal='false'>
            <p v-show="curShowTwo" class="curShowTwo"><span>交易密码 ：</span> <el-input v-model="buyPassword" placeholder="请输入交易密码"></el-input></p>
            <span style="font-size:18px;" v-show="curShowThree"><i class="el-icon-success" style="margin-right:5px;"></i>操作成功！</span>
            <span style="font-size:18px;" v-show="curShowFour"><i class="el-icon-warning" style="margin-right:5px;"></i>交易密码错误，你今天还有3次机会！</span>
            <span style="font-size:18px;" v-show="curShowFive"><i class="el-icon-warning" style="margin-right:5px;"></i>交易密码已无效，请重新设置交易密码！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="curcancelClick">取 消</el-button>
                <el-button type="primary" @click="curSureClick">确 定</el-button>
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
        /**第二次弹窗 样式 */
        .curShowTwo{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            .el-input{
                width: 80%;
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
                    mediumuser:'天上人间',
                    accountType:'银行卡',
                    mediumAccount:'456454645',
                    backprice:'200',
                    addtime:'2015/11/10 15：00：15'
                },
                {
                    mediumuser:'天上人间',
                    accountType:'银行卡',
                    mediumAccount:'456454645',
                    backprice:'200',
                    addtime:'2015/11/10 15：00：15'
                },
                {
                    mediumuser:'天上人间',
                    accountType:'银行卡',
                    mediumAccount:'456454645',
                    backprice:'200',
                    addtime:'2015/11/10 15：00：15'
                },
                {
                    mediumuser:'天上人间',
                    accountType:'银行卡',
                    mediumAccount:'456454645',
                    backprice:'200',
                    addtime:'2015/11/10 15：00：15'
                },
            ],
            editVisible:false,          //编辑弹窗 
            curVisible:false,
            buyPassword:'',             //交易密码
            curShowOne:false,           //第二次弹窗
            curShowTwo:false,           //第二次弹窗 -- 交易密码显示
            curShowThree:false,         //第二次确认事件 -- 填写成功显示内容
            curShowFour:false,          //第二次确认事件 -- 填写错误显示内容
            curShowFive:false,          //第二次确认事件 -- 填写无效显示内容
            add_edit_form:{             //编辑/添加  表单
                name:'',
                mobile:'',
                accountType:'',
                account:''
            },
        }
    },
    methods:{
        /** 搜索 */
        search(){
            console.log(this.searchForm)
        },
        /** 添加 /表单操作 编辑*/
        add_edit(type,index){
            if(type=='edit'){
                console.log(index);
            }
            this.editVisible = true;
        },
        /** 编辑/添加  确定事件 */
        add_edit_sure(){
            console.log(this.add_edit_form)
            this.editVisible = false;
        },
        /** 编辑/添加 取消 */
        add_edit_cancel(){
            this.add_edit_form = {
                name:'',
                mobile:'',
                accountType:'',
                account:''
            };
            this.editVisible = false;
        },
        /** 表单操作 删除 */
        deletes(index){
            this.curVisible = true;
        },
        /**删除 第一次弹窗确认事件 */
        sureClick(){
            this.curShowOne = true;
            this.curShowTwo = true;
        },
        /**删除 取消事件 */
        curcancelClick(){
            this.closeDialog();
        },
        /**删除 点击事件 */
        curSureClick(){
            if(!this.buyPassword){      //第一次 确认事件
                this.$message.error('请输入交易密码！')
            }else{                      //第二次 确认事件
                console.log(this.buyPassword)
                this.curShowTwo = false;
                // this.curShowThree = true;
                // this.curShowFour = true;
                this.curShowFive = true;
            }
        },
        /** 关闭弹窗事件 */
        closeDialog(){
            this.curVisible = false;
            this.curShowOne = false;
            this.curShowTwo = false;
            this.curShowThree = false;
            this.curShowFour = false;
            this.curShowFive = false;
            this.buyPassword = '';
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