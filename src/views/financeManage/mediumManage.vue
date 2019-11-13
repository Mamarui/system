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
                <el-table-column prop="name" label="中介姓名" align="center"></el-table-column>
                <el-table-column prop="account_type" label="账号类型" align="center"></el-table-column>
                <el-table-column prop="bank_account" label="中介账号" align="center"></el-table-column>
                <el-table-column prop="all_commission" label="累计返佣金额(元)" align="center"></el-table-column>
                <el-table-column prop="gmt_created" label="添加时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="add_edit('edit',scope.row.id,scope.$index)" type="text" size="small">编辑</el-button>
                        <el-button @click.native.prevent="deletes(scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <!-- 编辑/添加弹窗 -->
        <el-dialog title="添加/编辑" :visible.sync="editVisible" width="35%" center :close-on-click-modal='false'>
            <el-form ref="form" :model="add_edit_form" label-width="80px">
                <el-form-item label="中介姓名">
                    <el-input v-model="add_edit_form.name" placeholder="请输入中介姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="add_edit_form.phone" placeholder="请输入手机号" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="提现账号">
                    <el-input v-model="add_edit_form.bank_account" placeholder="请输入账号"></el-input>
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
import requestData  from '@/utils/requestMethod';
export default {
    data() {
        return {
            searchForm:{
                name:'',
                role:5,
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
            tableData:[],
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
                phone:'',
                role:5,
                bank_account:''
            },
            isEdit:false,               //标识是编辑还是新增
            id:'',                      //删除时所需id
        }
    },
    mounted(){
        this.getList();
    },
    methods:{
        /** 获取列表 */
        getList(){
            requestData('/api/user/list',{
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
            this.getList();
        },
        /** 添加 /表单操作 编辑(信息回写)*/
        add_edit(type,id,index){
            if(type=='edit'){
                this.isEdit = true;
                requestData('/api/user/detail',{
                    id:id
                },'get').then((res)=>{
                    var obj = {};
                    if(res.status==200){
                        this.editVisible = true;
                        obj = JSON.stringify(res.data);
                        this.add_edit_form = JSON.parse(obj);
                    }else{
                        this.$message.error(res.message);
                    }
                },(err)=>{
                    console.log(err)
                })
            }else{
                this.editVisible = true;
                this.isEdit = false;
            }
        },
        /** 编辑/添加  确定事件 */
        add_edit_sure(){
            var reg=/^1[3456789]\d{9}$/;
            if(!reg.test(this.add_edit_form.phone)){
                this.$message.error('电话号码输入格式有误！');
                return
            }
            if(this.isEdit){         //编辑
                requestData('/api/user/update',{
                    ...this.add_edit_form
                },'get').then((res)=>{
                    if(res.status==200){
                        this.$message.success(res.message);
                        this.getList();
                        this.editVisible = false;
                    }else{
                        this.$message.error(res.message);
                    }
                },(err)=>{
                    console.log(err)
                })
            }else{                  //新增
                requestData('/api/user/add',{
                    ...this.add_edit_form
                },'get').then((res)=>{
                    if(res.status==200){
                        this.$message.success(res.message);
                        this.getList();
                        this.editVisible = false;
                    }else{
                        this.$message.error(res.message);
                    }
                },(err)=>{
                    console.log(err)
                })
            }
        },
        /** 编辑/添加 取消 */
        add_edit_cancel(){
            this.add_edit_form = {
                name:'',
                phone:'',
                account_type:'',
                bank_account:'',
                role:5
            };
            this.editVisible = false;
        },
        /** 表单操作 删除 */
        deletes(id,index){
            this.id = id;  
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
                requestData('/api/auth/trade_pwd',{
                    admin:sessionStorage.getItem('userid'),
                    trade_pwd:this.buyPassword
                },'get').then((res)=>{
                    if(res.status==200){
                        this.deletesSure();
                    }else if(res.status == 400){
                        this.$message.error(res.message)
                        this.curShowOne = false;
                        this.curShowTwo = false;
                    }
                },(err)=>{
                    console.log(err)
                })
            }
        },
        /** 删除成功 请求函数 */
        deletesSure(){
            requestData('/api/user/delete',{
                id:this.id
            },'get').then((res)=>{
                if(res.status==200){
                    this.$message.success(res.message);
                    this.curShowOne = false;
                    this.curShowTwo = false;
                    this.getList();
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
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