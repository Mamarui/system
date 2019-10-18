<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="归属地域">
                    <el-select v-model="searchForm.province">
                        <el-option label="省" value=""></el-option>
                        <el-option label="甘肃" value="0"></el-option>
                        <el-option label="四川" value="1"></el-option>
                    </el-select>
                    <el-select v-model="searchForm.city">
                        <el-option label="市" value=""></el-option>
                        <el-option label="兰州" value="0"></el-option>
                        <el-option label="成都" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
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
                <el-table-column prop="businessname" label="商家名称" align="center"></el-table-column>
                <el-table-column prop="name" label="联系人" align="center"></el-table-column>
                <el-table-column prop="mobile" label="联系人电话" align="center"></el-table-column>
                <el-table-column prop="type" label="货柜类型" align="center"></el-table-column>
                <el-table-column prop="totalnum" label="货柜总数量" align="center"></el-table-column>
                <el-table-column prop="region" label="归属地域" align="center"></el-table-column>
                <el-table-column prop="address" label="详细地址" align="center"></el-table-column>
                <el-table-column prop="totalpay" label="累计交易额(元)" align="center" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.$index)" type="text" size="small">查看</el-button>
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">编辑</el-button>
                        <el-button @click.native.prevent="deletes(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <!-- 列表操作 -- 查看 弹窗 -->
        <el-dialog title="商家详情" :visible.sync="view_visible" width="35%" :close-on-click-modal='false' center @close="view_visible = false">
            <el-form :model="set_form" class="set_form" :rules="set_rule" ref="set_form" label-width="120px">
                <el-form-item label="商家名称" prop="businessname">
                    <el-input disabled v-model="set_form.businessname"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="name">
                    <el-input disabled v-model="set_form.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input disabled v-model="set_form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-select v-model="set_form.province" disabled>
                        <el-option label="省" value=""></el-option>
                        <el-option label="四川" value="0"></el-option>
                        <el-option label="甘肃" value="1"></el-option>
                    </el-select>
                    <el-select v-model="set_form.city" disabled>
                        <el-option label="市" value=""></el-option>
                        <el-option label="成都" value="0"></el-option>
                        <el-option label="兰州" value="1"></el-option>
                    </el-select>
                    <el-input type="textarea" v-model="set_form.detailaddress" disabled></el-input>
                </el-form-item>
                <el-form-item label="累计交易额">
                    <el-input disabled v-model="set_form.totalpay"></el-input>
                </el-form-item>
                <el-form-item label="管理货柜" prop="manager">
                    <span>（共x个货柜）</span>
                    <div class="bigbox">
                        <section class="everybox">
                            <div class="smallbox"><span>3</span></div>
                            <span>型号1</span>
                        </section>
                        <section class="everybox">
                            <div class="smallbox"><span>3</span></div>
                            <span>型号1</span>
                        </section>
                        <section class="everybox">
                            <div class="smallbox"><span>3</span></div>
                            <span>型号1</span>
                        </section>
                        <section class="everybox">
                            <div class="smallbox"><span>3</span></div>
                            <span>型号1</span>
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
                <el-form-item label="商家名称" prop="businessname">
                    <el-input v-model="add_edit_form.businessname"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="name">
                    <el-input v-model="add_edit_form.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input :disabled="isEdit" v-model="add_edit_form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-select v-model="add_edit_form.province">
                        <el-option label="省" value=""></el-option>
                        <el-option label="四川" value="0"></el-option>
                        <el-option label="甘肃" value="1"></el-option>
                    </el-select>
                    <el-select v-model="add_edit_form.city">
                        <el-option label="市" value=""></el-option>
                        <el-option label="成都" value="0"></el-option>
                        <el-option label="兰州" value="1"></el-option>
                    </el-select>
                    <el-input type="textarea" v-model="add_edit_form.detailaddress" placeholder="请输入详细地址"></el-input>
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
export default {
    data() {
        return {
            searchForm:{
                province:'',
                city:'',
                date:'',
                name:'',
                curpage:1,
                pagesize:10,
                pagesizes:[10,20,50,100],
                total:100
            },
            day_one:'',
            day_two:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            tableData:[
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
                {
                    businessname:'天上人间',
                    name:'张三',
                    mobile:'15200000000',
                    type:'3',
                    totalnum:'1369852',
                    region:'四川-成都',
                    address:'锦江区天府广场',
                    totalpay:'100，000.00',
                    createTime:'2019/12/10 11：00:00'
                },
            ],
            view_visible:false,          //查看商家详情
            set_form:{                  //查看商家详情 表单
                businessname:'',
                name:'',
                mobile:'',
                address:'',
                province:'',
                city:'',
                detailaddress:'',
                totalpay:'',
                manager:[]
            },
            set_rule: {                 //查看商家详情 表单验证
                businessname: [
                    { required: true, message: '请选择商家姓名', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请选择地址', trigger: 'change' }
                ]
            },
            add_edit_visible:false,             //添加/编辑 弹窗
            add_edit_form:{                     //添加/编辑 表单
                businessname:'',
                name:'',
                mobile:'',
                address:'',
                province:'',
                city:'',
                detailaddress:'',
            },
            add_edit_rule:{                 //添加/编辑 表单验证
                businessname: [
                    { required: true, message: '请选择商家姓名', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请选择地址', trigger: 'change' }
                ]
            },
            isEdit:false,                       //如果为添加 电话号码可输入 如果为编辑 电话号码不可编辑
            curVisible:false,            //删除 第一次 弹窗
            curMention:'',
            isCommon:true,             //是否为正常删除
            curShowOne:false,           //删除 第二次 弹窗
            curShowTwo:false,           //第二次弹窗 -- 交易密码显示
            curShowThree:false,         //第二次确认事件 -- 填写成功显示内容
            curShowFour:false,          //第二次确认事件 -- 填写错误显示内容
            curShowFive:false,          //第二次确认事件 -- 填写无效显示内容
            buyPassword:'',             //交易密码
        }
    },
    methods:{
        /** 筛选条件 搜索 */
        search(){

        },
        /** 添加商家 */
        addClick(){
            this.add_edit_visible = true;
            this.isEdit = false;
        },
        /** 表格操作 -- 查看 */
        view(index){
            console.log(index)
            this.view_visible = true;
        },
        /** 表格操作 -- 编辑 */
        edit(index){
            console.log(index)
            this.add_edit_visible = true;
            this.isEdit = true;
        },
        /** 表格操作 -- 删除 */
        deletes(index){
            this.curVisible = true;
            if(this.isCommon){
                this.curMention = '删除该商家后，平台将无法管理该商家！';
            }else{
                this.curMention = '该商机的货柜数量不为0，不能删除！';
            }
            console.log(index)
        },
        /** 表格操作 -- 删除 第一次弹窗 确认事件 */
        curClick(){
            this.curVisible = false;
            if(this.isCommon){
                this.curShowOne = true;
                this.curShowTwo = true;
            }
        },
        /**清除/删除 取消事件 */
        curcancelClick(){
            this.closeCurDialog();
        },
        /**清除/删除 点击事件 */
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
        /** 表格操作 -- 编辑（同添加）--关闭弹窗 */
        closeDialog(){
            console.log(this.add_edit_form)
            this.add_edit_form = {                     //添加/编辑 表单
                businessname:'',
                name:'',
                mobile:'',
                address:'',
                province:'',
                city:'',
                detailaddress:'',
            };
            this.add_edit_visible = false;
        },
        /** 表格操作 -- 编辑（同添加） --确定事件 */
        sureClick(){
            console.log(this.add_edit_form)
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