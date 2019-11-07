<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="归属地域">
                    <el-select v-model="searchForm.province" @change="chooseProvince('search')">
                        <el-option label="省" value=""></el-option>
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in province" :key="index"></el-option>
                    </el-select>
                    <el-select v-model="searchForm.city">
                        <el-option label="市" value=""></el-option>
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in city" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="day_one" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入商家名称、联系人、联系电话"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="addClick"><svg-icon icon-class="add" style="margin-right:5px;"/>添加</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="name" label="商家名称" align="center"></el-table-column>
                <el-table-column prop="contact" label="联系人" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系人电话" align="center"></el-table-column>
                <el-table-column prop="container_type" label="货柜类型" align="center"></el-table-column>
                <el-table-column prop="container_amount" label="货柜总数量" align="center"></el-table-column>
                <el-table-column prop="area" label="归属地域" align="center"></el-table-column>
                <el-table-column prop="address" label="详细地址" align="center"></el-table-column>
                <el-table-column prop="trade_amount" label="累计交易额(元)" align="center" width="180"></el-table-column>
                <el-table-column prop="gmt_created" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.row.id,'view')" type="text" size="small">查看</el-button>
                        <el-button @click.native.prevent="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                        <el-button @click.native.prevent="deletes(scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <!-- 列表操作 -- 查看 弹窗 -->
        <el-dialog title="商家详情" :visible.sync="view_visible" width="35%" :close-on-click-modal='false' center @close="view_visible = false">
            <el-form :model="set_form" class="set_form" :rules="set_rule" ref="set_form" label-width="120px">
                <el-form-item label="商家名称" prop="name">
                    <el-input disabled v-model="set_form.name"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input disabled v-model="set_form.contact"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input disabled v-model="set_form.phone" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-select v-model="set_form.province" disabled>
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in province" :key="index"></el-option>
                    </el-select>
                    <el-select v-model="set_form.city" disabled>
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in city" :key="index"></el-option>
                    </el-select>
                    <el-input type="textarea" v-model="set_form.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="累计交易额">
                    <el-input disabled v-model="set_form.trade_amount"></el-input>
                </el-form-item>
                <el-form-item label="管理货柜" prop="manager">
                    <span>（共{{set_form.container_total}}个货柜）</span>
                    <div class="bigbox">
                        <section class="everybox" v-for="(item,index) in set_form.container_list">
                            <div class="smallbox"><span>{{item.total}}</span></div>
                            <span>{{item.NAME}}</span>
                        </section>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="view_visible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 列表操作 -- 编辑 弹窗（同添加） -->
        <el-dialog title="商家详情" :visible.sync="add_edit_visible" width="35%" :close-on-click-modal='false' center @close="closeDialog">
            <el-form :model="add_edit_form" class="add_edit_form" :rules="add_edit_rule" ref="add_edit_form" label-width="120px">
                <el-form-item label="商家名称" prop="name">
                    <el-input v-model="add_edit_form.name"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="add_edit_form.contact"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input :disabled="isEdit" v-model="add_edit_form.phone" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-select v-model="add_edit_form.province" @change="chooseProvince('add_edit')">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in province" :key="index"></el-option>
                    </el-select>
                    <el-select v-model="add_edit_form.city">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in city" :key="index"></el-option>
                    </el-select>
                    <el-input type="textarea" v-model="add_edit_form.address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button @click="sureClick">添加/保存</el-button>
            </span>
        </el-dialog>
        <!-- 删除 第一次提示弹窗 -->
        <el-dialog title="商家删除提示" :visible.sync="curVisible" width="30%" @close="curVisible = false" :close-on-click-modal='false'>
            <span style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>{{curMention}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="curVisible = false" v-if="isCommon">取 消</el-button>
                <el-button type="primary" @click="curClick">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除 第二次提示弹窗 -->
        <el-dialog title="输入密码" :visible.sync="curShowOne" width="30%" @close="closeCurDialog" :close-on-click-modal='false'>
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
        /** 查看弹窗样式 */
        .set_form{
            .el-input,.el-textarea{
                width: 81.5%;
            }
            .el-textarea{
                margin-top: 5px;
            }
            .bigbox{
                width: 80%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-around;
                .everybox{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    .smallbox{
                        width: 80px;
                        height: 80px;
                        line-height: 80px;
                        text-align: center;
                        border: 1px solid #c1c1c1;
                    }

                }
            }
        }
        /** 编辑/添加弹窗样式 */
        .add_edit_form{
            .el-input,.el-textarea{
                width: 80%;
            }
            .el-textarea{
                margin-top: 5px;
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
import regRxp from '@/utils/validate';
export default {
    data() {
        return {
            province:[],        //省
            city:[],            //市
            searchForm:{
                province:'',
                city:'',
                gmt_created:'',
                name:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            day_one:'',
            day_two:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            total:0,        //列表总数
            tableData:[],
            view_visible:false,          //查看商家详情
            set_form:{                  //查看商家详情 表单
                name:'',
                contact:'',
                phone:'',
                address:'',
                province:'',
                city:'',
                trade_amount:'',
                container_list:[],
                container_total:0
            },
            set_rule: {                 //查看商家详情 表单验证
                name: [
                    { required: true, message: '请选择商家姓名', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请选择地址', trigger: 'change' }
                ]
            },
            add_edit_visible:false,             //添加/编辑 弹窗
            add_edit_form:{                     //添加/编辑 表单
                name:'',
                contact:'',
                phone:'',
                address:'',
                province:'',
                city:'',
            },
            add_edit_rule:{                 //添加/编辑 表单验证
                name: [
                    { required: true, message: '请选择商家姓名', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { validator: regRxp.validMoblie , trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请选择地址', trigger: 'change' }
                ]
            },
            id:'',                          //编辑时传商家id
            isEdit:false,                       //如果为添加 电话号码可输入 如果为编辑 电话号码不可编辑
            curVisible:false,            //删除 第一次 弹窗
            curMention:'',
            isCommon:true,             //是否为正常删除(可以输交易密码)
            curShowOne:false,           //删除 第二次 弹窗
            curShowTwo:false,           //第二次弹窗 -- 交易密码显示
            curShowThree:false,         //第二次确认事件 -- 填写成功显示内容
            curShowFour:false,          //第二次确认事件 -- 填写错误显示内容
            curShowFive:false,          //第二次确认事件 -- 填写无效显示内容
            buyPassword:'',             //交易密码
        }
    },
    mounted(){
        this.getProvince(0);
        this.getList();
    },
    methods:{
        /** 归属省请求接口 */
        getProvince(pid){
            requestData('/api/china',{
                pid:pid
            },'get').then((res)=>{
                if(res.status==200){
                    this.province = res.data;
                }
            },(err)=>{
                console.log(err)
            })
        },
        /**选择省--归属市请求接口*/
        getCity(pid){
            requestData('/api/china',{
                pid:pid
            },'get').then((res)=>{
                if(res.status==200){
                    this.city = res.data;
                }
            },(err)=>{
                console.log(err)
            })
        },
        chooseProvince(type){
            if(type=='search'){
                this.getCity(this.searchForm.province);
            }else{
                this.getCity(this.add_edit_form.province);
            }
        },
        /** 获取商家管理列表 */
        getList(){
            requestData('/api/merchant/list',{
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
        /** 筛选条件 搜索 */
        search(){
            if(this.day_one&&this.day_two){
                if(this.day_one > this.day_two){
                    this.$message.error('开始时间小于结束时间！')
                }else{
                    this.searchForm.gmt_created = this.day_one + '~' + this.day_two;
                }
            }else if(this.day_one){
                this.searchForm.gmt_created = this.day_one;
            }else{
                this.searchForm.gmt_created = this.day_two;
            }
            this.getList();
        },
        /** 添加商家 */
        addClick(){
            this.isEdit = false;
            this.add_edit_visible = true;
        },
        /** 表格操作 -- 查看 */
        view(id,type){
            requestData('/api/merchant/detail',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.getCity(this.set_form.province);
                    if(type=='view'){
                        this.set_form = res.data;
                        this.view_visible = true;
                    }else{
                        this.add_edit_form.name = res.data.name;
                        this.add_edit_form.contact = res.data.contact;
                        this.add_edit_form.phone = res.data.phone;
                        this.add_edit_form.address = res.data.address;
                        this.add_edit_form.province = res.data.province;
                        this.add_edit_form.city = res.data.city;
                    }
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 表格操作 -- 编辑 */
        edit(id){
            this.id = id;
            this.view(id,'edit');
            this.add_edit_visible = true;
            this.isEdit = true;
        },
        /** 表格操作 -- 编辑（同添加）--关闭弹窗 */
        closeDialog(){
            this.add_edit_form = {                     //添加/编辑 表单
                name:'',
                contact:'',
                phone:'',
                address:'',
                province:'',
                city:'',
                id:''
            };
            this.add_edit_visible = false;
        },
        /** 表格操作 -- 编辑（同添加） --确定事件 */
        sureClick(){
            var _url = '';
            if(this.isEdit){
                _url = '/api/merchant/update';
                this.add_edit_form.id = this.id;
            }else{
                _url = '/api/merchant/add';
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    requestData(_url,{
                        ...this.add_edit_form
                    },'get').then((res)=>{
                        if(res.status==200){
                            this.$message.success(res.message);
                            this.getList();
                        }else{
                            this.$message.error(res.message);
                        }
                    },(err)=>{
                        console.log(err)
                    })
                    this.add_edit_visible = false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /** 表格操作 -- 删除 */
        deletes(id,index){
            if(this.tableData[index].container_amount==0){      //数量为0 不可删除
                this.isCommon = false;   
            }else{
                this.isCommon = true;   
            }
            this.curVisible = true;
            if(this.isCommon){
                this.curMention = '删除该商家后，平台将无法管理该商家！';
            }else{
                this.curMention = '该商机的货柜数量不为0，不能删除！';
            }
        },
        /** 表格操作 -- 删除 第一次弹窗 确认事件 */
        curClick(){
            this.curVisible = false;
            if(this.isCommon){      //如果可以正常删除
                this.curShowOne = true;
                this.curShowTwo = true;
            }
        },
        /**删除 取消事件 */
        curcancelClick(){
            this.closeCurDialog();
        },
        /**删除 点击事件 */
        curSureClick(){
            if(!this.buyPassword){      //第一次 确认事件
                this.$message.error('请输入交易密码！')
            }else{                      //第二次 确认事件
                console.log(this.curTitle)
                console.log(this.buyPassword)
                this.curShowTwo = false;
                // this.curShowThree = true;
                // this.curShowFour = true;
                this.curShowFive = true;
            }
        },
        /** 删除成功 请求函数 */
        deletesSure(){
            requestData('/api/merchant/delete',{
                id:this.id
            },'get').then((res)=>{
                if(res.status==200){
                    console.log(res)
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 关闭弹窗事件 */
        closeCurDialog(){
            this.curVisible = false;
            this.curShowOne = false;
            this.curShowTwo = false;
            this.curShowThree = false;
            this.curShowFour = false;
            this.curShowFive = false;
            this.buyPassword = '';
        },
        /**页码操作 */
        handleSizeChange(val) {     //改变pagesize时
            this.searchForm.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {      //改变curpage时
            this.searchForm.page = val;
            this.getList();
        },
    }
}
</script>