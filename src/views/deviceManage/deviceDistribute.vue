<template>
    <el-container class="container">
        <div class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="货柜型号">
                    <el-select v-model="searchForm.model_id">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.model" :value="item.model_id" v-for="(item,index) in type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货柜状态">
                    <el-select v-model="searchForm.dto_status">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item" :value="index" v-for="(item,index) in state" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商家绑定">
                    <el-select v-model="searchForm.bind_status">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in business" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分配时间">
                    <el-date-picker v-model="day_one" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.ckeys" placeholder="请输入货柜名/商家名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-main class="main">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="name" label="货柜名" align="center"></el-table-column>
                <el-table-column prop="model" label="货柜型号" align="center"></el-table-column>
                <el-table-column prop="surface_no" label="货柜编号" align="center"></el-table-column>
                <el-table-column prop="dtu_no" label="DTU编号" align="center"></el-table-column>
                <el-table-column prop="dto_status" label="货柜状态" align="center"></el-table-column>
                <el-table-column prop="volume" label="容量" align="center"></el-table-column>
                <el-table-column prop="on_sale" label="在售商品数" align="center"></el-table-column>
                <el-table-column prop="merchant_name" label="分配商家" align="center"></el-table-column>
                <el-table-column prop="bind_status" label="商家绑定状态" align="center"></el-table-column>
                <el-table-column prop="gmt_assign" label="分配时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.row.id,scope.$index)" type="text" size="small">查看</el-button>
                        <el-button @click.native.prevent="settings('line',scope.row.id,scope.$index)" type="text" size="small">分配</el-button>
                        <el-button @click.native.prevent="metion(scope.row.id,scope.$index)" type="text" size="small">清除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <!-- <div class="buttons">
                <el-button @click.native.prevent="settings('select')" plain size="small">分配</el-button>
                <el-button @click.native.prevent="metion" plain size="small">清除</el-button>
            </div> -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </el-footer>
        <!-- 表格 -- 查看 弹窗 -->
        <el-dialog class="view" title="设备查看" :visible.sync="view_visible" width="45%" @close="view_visible = false" :close-on-click-modal='false'>
            <div class="viewBox">
                <div class="detailsBox">
                    <h3>设备详情</h3>
                    <div class="details">
                        <div class="left">
                            <p>货柜名 ： <span>{{views.name}}</span></p>
                            <p>货柜编号 ： <span>{{views.surface_no}}</span></p>
                            <p>货柜型号 ： <span>{{views.model}}</span></p>
                            <p>DTU编号 ： <span>{{views.dtu_no}}</span></p>
                            <p>货柜状态 ： <span>{{views.dto_status}}</span></p>
                            <p>尺寸 ： <span>{{views.spec}}</span></p>
                            <p>分配时间 ： <span>{{views.gmt_assign}}</span></p>
                            <p>分配商家 ： <span>{{views.merchant_name}}</span></p>
                            <p>容量 ： <span>{{views.volume}}</span></p>
                        </div>
                        <div class="right">
                            <p class="imgTxt">DTU编号：{{views.dtu_no}}  货柜编号：{{views.surface_no}}</p>
                            <div class="imgBox">
                                <img :src="views.qrcode" v-show="views.qrcode">
                            </div>
                            <el-button @click="view_print">打 印</el-button>
                        </div>
                    </div>
                </div>
                <div class="prodInfo">
                    <h3>设备详情</h3>
                    <el-table :data="viewData" tooltip-effect="dark" style="width: 70%;margin:0 auto;" border>
                        <el-table-column prop="grid_location" label="格子序号" align="center" width="200"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                        <el-table-column prop="price" label="商品价格" align="center"></el-table-column>元
                    </el-table>
                </div>
            </div>
        </el-dialog>
        <!-- 表格 -- 配置/添加 弹窗 -->
        <el-dialog title="设备配置/添加" :visible.sync="set_add_visible" width="35%" center :close-on-click-modal='false'>
            <el-form :model="set_add_form" class="set_add_form" :rules="set_add_rule" ref="set_add_form" label-width="120px">
                <el-form-item label="货柜名" prop="name">
                    <el-input v-model="set_add_form.name" placeholder="请输入货柜名（不验重）"></el-input>
                </el-form-item>
                <el-form-item label="货柜编号">
                    <el-input v-model="set_add_form.surface_no" disabled></el-input>
                </el-form-item>
                <el-form-item label="货柜型号">
                    <el-input v-model="set_add_form.model" disabled></el-input>
                </el-form-item>
                <el-form-item label="DTU编号">
                    <el-input v-model="set_add_form.dtu_no" disabled></el-input>
                </el-form-item>
                <el-form-item label="货柜状态">
                    <el-input v-model="set_add_form.dto_status" disabled></el-input>
                </el-form-item>
                <el-form-item label="尺寸" prop="size">
                    <el-input v-model="set_add_form.spec" disabled></el-input>
                </el-form-item>
                <el-form-item label="容量" prop="volume">
                    <el-input v-model="set_add_form.volume" disabled></el-input>
                </el-form-item>
                <el-form-item label="分配商家" prop="merchant_name">
                    <el-select v-model="set_add_form.merchant_name">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in business" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_add_cancel">取 消</el-button>
                <el-button @click="set_add_sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 清除/删除 第一次提示弹窗 -->
        <el-dialog title="货柜配置清除" :visible.sync="curVisible" width="30%" @close="curVisible = false" :close-on-click-modal='false'>
            <span style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>选中的设备如已分配给商家，清除后原商家将无法管理该货柜！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="curVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureClick">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 清除/删除 第二次提示弹窗 -->
        <el-dialog title="输入密码" :visible.sync="curShowOne" width="30%" @close="closeDialog" :close-on-click-modal='false'>
            <p v-show="curShowTwo" class="curShowTwo"><span>交易密码 ：</span> <el-input v-model="buyPassword" placeholder="请输入交易密码"></el-input></p>
            <!-- <span style="font-size:18px;" v-show="curShowThree"><i class="el-icon-success" style="margin-right:5px;"></i>操作成功！</span>
            <span style="font-size:18px;" v-show="curShowFour"><i class="el-icon-warning" style="margin-right:5px;"></i>交易密码错误，你今天还有3次机会！</span>
            <span style="font-size:18px;" v-show="curShowFive"><i class="el-icon-warning" style="margin-right:5px;"></i>交易密码已无效，请重新设置交易密码！</span> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="curcancelClick">取 消</el-button>
                <el-button type="primary" @click="curSureClick">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 表格 -- 配置/添加 弹窗 不同商家 -->
        <!-- <el-dialog title="批量配置提示" :visible.sync="set_mention_visible" width="30%" @close="setVisible = false" :close-on-click-modal='false'>
            <span style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>你选中的设备已分配给了不同的商家，继续配置后原商家将无法管理该货柜！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="setClick">继续配置</el-button>
            </span>
        </el-dialog> -->
        <!-- 底部按钮 配置/添加 弹窗 -->
        <!-- <el-dialog title="设备批量配置" :visible.sync="set_visible" width="35%" :close-on-click-modal='false'>
            <el-form :model="set_form" class="set_form" :rules="set_rule" ref="set_form" label-width="120px">
                <el-form-item label="货柜名">
                    <div class="nameBox iconBox" v-model="set_form.name">
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                    </div>
                    <span>共<span style="color:red;">XX</span>个货柜</span>
                </el-form-item>
                <el-form-item label="货柜型号" prop="type">
                    <div class="typeBox iconBox" v-model="set_form.type">
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                        <span>货柜名</span>
                    </div>
                    <span>共<span style="color:red;">XX</span>种货柜</span>
                </el-form-item>
                <el-form-item label="货柜状态" prop="state">
                    <el-input disabled v-model="set_form.state"></el-input>
                </el-form-item>
                <el-form-item label="分配商家" prop="business">
                    <el-select v-model="set_form.business">
                        <el-option label="请选择" value=""></el-option>
                        <el-option label="分配商家一" value="0"></el-option>
                        <el-option label="分配商家二" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button>确 定</el-button>
            </span>
        </el-dialog> -->
    </el-container>

</template>

<style lang="scss" scoped>
    .container{
        padding: 20px;
        .header{
            height: 100px;
            margin-left: 1%;
            .form{
                .el-form-item{
                    margin-bottom: 10px;
                }
            }
        }
        .el-main{
            margin: 0;
            padding: 0;
        }
        .footer{
            .buttons{
                float: left;
                margin-top: 10px;
            }
            .block{
                float: right;
                margin-top: 10px;
            }
        }
        /** 查看弹窗 */
        .view{
            h3{
                width: 350px;
                height: 35px;
                border-bottom: 1px solid #6e6a6a;
                margin: 0;
                margin-bottom: 30px;
            }
            .viewBox{
                max-height: 700px;
                overflow: auto;
                .detailsBox{
                    .details{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                    }
                    .left{
                        margin-right: 35px;
                        p{
                            font-size: 16px;
                            color: #6e6a6a;
                            span{
                                color: #000;
                            }
                        }
                    }
                    .right{
                        width: 350px;
                        height: 400px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-around;
                        .imgTxt{
                            font-size: 16px;
                            color: #c1c1c1;
                            margin: 0;
                        }
                        .imgBox{
                            width: 300px;
                            height: 300px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
        /**配置/添加弹窗样式 */
        .set_add_form{
            .el-input,.el-select{
                width: 450px;
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
        /**底部配置样式 */
        .set_form{
            .iconBox{
                width: 80%;
                height: auto;
                padding: 5px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                border: 1px solid #c1c1c1;
                border-radius: 5px;
                span{
                    min-width: 55px;
                    height: 30px;
                    line-height: 30px;
                    background-color: #eeecec;
                    border-radius: 5px;
                    margin: 5px;
                    text-align: center;
                }
            }
            .el-input,.el-select{
                width: 80%;
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
                model_id:'',
                dto_status:'',
                bind_status:'',
                ckeys:'',
                gmt_assign:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            total:0,
            day_one:'',
            day_two:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            /***  筛选项 类型/状态/商家  *****/
            type:[],
            state:[],
            business:[],
            /**** 筛选项 类型/状态/商家  **** */
            tableData:[],
            multipleSelection: [],
            view_visible:false,                 //查看
            views:{},                       //查看信息
            viewData:[],                        //查看列表
            set_add_visible:false,           //配置/添加弹窗
            set_mention_visible:false,       //底部配置操作按钮事件
            set_add_form:{                  //配置 表单
                name:'',
                surface_no:'',
                model:'',
                dtu_no:'',
                dto_status:'',
                spec:'',
                volume:'',
                merchant_name:''
            },
            set_add_rule: {                 //配置 表单验证
                name: [
                    { required: true, message: '请输入货柜名（不验重）', trigger: 'blur' }
                ],
                spec: [
                    { required: true, message: '请输入尺寸', trigger: 'blur' }
                ],
                volume: [
                    { required: true, message: '请输入容量', trigger: 'blur' }
                ],
                merchant_name: [
                    { required: true, message: '请选择分配商家', trigger: 'change' }
                ],
            },
            curVisible:false,
            id:'',                      //清除时要传id
            buyPassword:'',             //交易密码
            curShowOne:false,           //第二次弹窗
            curShowTwo:false,           //第二次弹窗 -- 交易密码显示
            curShowThree:false,         //第二次确认事件 -- 填写成功显示内容
            curShowFour:false,          //第二次确认事件 -- 填写错误显示内容
            curShowFive:false,          //第二次确认事件 -- 填写无效显示内容
            set_visible:false,          //底部配置弹窗
            set_form:{                  //底部配置 表单
                name:[],
                type:[],
                state:'',
                business:''
            },
            set_rule:{                  //底部配置 表单验证
                type: [
                    { type: 'array', required: true, message: '请选择货柜型号', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择货柜状态', trigger: 'blur' }
                ],
                business: [
                    { required: true, message: '请选择分配商家', trigger: 'change' }
                ],
            },
            stateVal:'',                //货柜状态
        }
    },
    mounted(){
        /** 获取筛选项 */
        this.getType();
        this.getState();
        this.getBusiness();
        /** 获取列表 */
        this.getList();
    },
    methods:{
        /**  筛选项 -- 货柜型号 */
        getType(){
            requestData('/api/container/spec/list',{},'get').then((res)=>{
                if(res.status==200){
                    this.type = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /**  筛选项 -- 货柜状态 */
        getState(){
            requestData('/api/container/status',{},'get').then((res)=>{
                if(res.status==200){
                    this.state = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /**  筛选项 -- 商家 */
        getBusiness(){
            requestData('/api/merchant/list',{},'get').then((res)=>{
                if(res.status==200){
                    this.business = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 获取列表 */
        getList(){
            requestData('/api/container/list',{
                ...this.searchForm
            },'get').then((res)=>{
                if(res.status==200){
                    this.total = res.count;
                    this.tableData = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /**搜索框 -- 查询 */
        search(){
            if(this.day_one&&this.day_two){
                if(this.day_one > this.day_two){
                    this.$message.error('开始时间不能大于结束时间');
                    return
                }else{
                    this.searchForm.gmt_assign = this.day_one + '-' + this.day_two;
                }
            }else if(this.day_one){
                this.searchForm.gmt_assign = this.day_one;
            }else{
                this.searchForm.gmt_assign = this.day_two;
            }
            this.getList();
        },
        /** 查看 */
        view(id,index){
            requestData('/api/container/detail',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.views = res.data;
                    this.viewData = res.data.goods_list;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
            this.view_visible = true;
        },
        /** 查看 -- 打印 */
        view_print(){
            console.log(111)
        },
        /**操作 -- 分配 */
        settings(type,id,index){
            var obj = {};
            if(type=='line'){
                this.set_add_visible = true;
                obj = JSON.stringify(this.tableData[index]);
                this.set_add_form = JSON.parse(obj);
                for(var i = 0; i < this.business.length; i++){
                    if(this.set_add_form.merchant_name == this.business[i].name){
                        this.set_add_form.merchant_name = this.business[i].id
                    }
                }
            }else{  //底部操作 同时还得是选择的不同的商家 才会显示此弹窗 否则直接为另一个配置弹窗(即点击继续配置的弹窗)
                this.set_mention_visible = true;
            }
        },
        /**配置/添加弹窗点击事件 */
        set_add_cancel(){   //取消
            this.set_add_form = {
                name:'',
                surface_no:'',
                model:'',
                dtu_no:'',
                dto_status:'',
                spec:'',
                volume:'',
                merchant_name:''
            };
            this.set_add_visible = false;
        },
        set_add_sure(){     //确认事件
            requestData('/api/container/update',{
                id:this.set_add_form.id,
                operation:'assign',
                name:this.set_add_form.name,
                merchant:this.set_add_form.merchant_name
            },'get').then((res)=>{
                if(res.status==200){
                    this.getList();
                    this.$message.success(res.message);
                }else{
                    this.$message.error(res.message);
                }
                this.set_add_visible = false;
            },(err)=>{
                console.log(err)
            })
        },
        /**清除 第一次提示*/
        metion(id,index){
            this.id = id;
            this.curVisible = true;
        },
        /**清除 第一次弹窗确认事件 */
        sureClick(){
            this.curShowOne = true;
            this.curShowTwo = true;
        },
        /**清除 取消事件 */
        curcancelClick(){
            this.closeDialog();
        },
        /**清除 点击事件 */
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
            requestData('/api/container/update',{
                id:this.id,
                operation:'clear'
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

        /**表格多选操作 */
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val;
        },
        /**页码操作 */
        handleSizeChange(val) {
            this.searchForm.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.searchForm.page = val;
            this.getList();
        },

        /**底部配置 -- 继续配置事件 */
        setClick(){ 
            this.set_mention_visible = false;
            this.set_visible = true;
            this.stateVal = '哈哈哈哈哈哈哈哈哈哈'
        }
    }
}
</script>