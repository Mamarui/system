<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="货柜型号">
                    <el-select v-model="searchForm.type">
                        <el-option label="货柜型号一" value="0"></el-option>
                        <el-option label="货柜型号二" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货柜状态">
                    <el-select v-model="searchForm.state">
                        <el-option label="货柜状态一" value="0"></el-option>
                        <el-option label="货柜状态二" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入货柜名/商家名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="set_add_visible = true"><svg-icon icon-class="add" style="margin-right:5px;"/>添加</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="name" label="货柜名" align="center"></el-table-column>
                <el-table-column prop="type" label="货柜型号" align="center"></el-table-column>
                <el-table-column prop="bodycode" label="货柜机身编号" align="center"></el-table-column>
                <el-table-column prop="code" label="货柜编号" align="center"></el-table-column>
                <el-table-column prop="volume" label="容量" align="center"></el-table-column>
                <el-table-column prop="state" label="货柜状态" align="center"></el-table-column>
                <el-table-column prop="business" label="商家名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="settings('line',scope.$index)" type="text" size="small">配置</el-button>
                        <el-button @click.native.prevent="metion('clear',scope.$index)" type="text" size="small">清除</el-button>
                        <el-button @click.native.prevent="metion('delete',scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <div class="buttons">
                <el-button @click.native.prevent="settings('select')" plain size="small">配置</el-button>
                <el-button @click.native.prevent="metion('clear')" plain size="small">清除</el-button>
                <el-button @click.native.prevent="metion('delete')" plain size="small">删除</el-button>
            </div>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
            </div>
        </el-footer>
        <!-- 表格 -- 配置/添加 弹窗 -->
        <el-dialog title="设备配置/添加" :visible.sync="set_add_visible" width="35%" center :close-on-click-modal='false'>
            <el-form :model="set_add_form" class="set_add_form" :rules="set_add_rule" ref="set_add_form" label-width="120px">
                <el-form-item label="货柜名">
                    <el-input v-model="set_add_form.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="货柜型号" prop="type">
                    <el-select v-model="set_add_form.type">
                        <el-option label="货柜型号一" value="0"></el-option>
                        <el-option label="货柜型号二" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="容量">
                    <el-input v-model="set_add_form.volume" disabled></el-input>
                </el-form-item>
                <el-form-item label="货柜机身编号" prop="bodycode">
                    <el-input v-model="set_add_form.bodycode" placeholder="请输入货柜编号"></el-input>
                </el-form-item>
                <el-form-item label="货柜编号" prop="code">
                    <el-input v-model="set_add_form.code" placeholder="请输入货柜编号"></el-input>
                </el-form-item>
                <el-form-item label="货柜状态" prop="state">
                    <el-select v-model="set_add_form.state" disabled>
                        <el-option label="货柜状态一" value="0"></el-option>
                        <el-option label="货柜状态二" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分配商家" prop="business">
                    <el-select v-model="set_add_form.business">
                        <el-option label="分配商家一" value="0"></el-option>
                        <el-option label="分配商家二" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_add_cancel">取 消</el-button>
                <el-button @click="set_add_sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 清除/删除 第一次提示弹窗 -->
        <el-dialog :title="curTitle" :visible.sync="curVisible" width="30%" @close="curVisible = false" :close-on-click-modal='false'>
            <span style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>{{curMention}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="curVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureClick">确 定</el-button>
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
        <!-- 表格 -- 配置/添加 弹窗 不同商家 -->
        <el-dialog title="批量配置提示" :visible.sync="set_mention_visible" width="30%" @close="setVisible = false" :close-on-click-modal='false'>
            <span style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>你选中的设备已分配给了不同的商家，继续配置后原商家将无法管理该货柜！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="setClick">继续配置</el-button>
            </span>
        </el-dialog>
        <!-- 底部按钮 配置/添加 弹窗 -->
        <el-dialog title="设备批量配置" :visible.sync="set_visible" width="35%" :close-on-click-modal='false'>
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
            .buttons{
                float: left;
                margin-top: 10px;
            }
            .block{
                float: right;
                margin-top: 10px;
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
export default {
    data() {
        return {
            searchForm:{
                type:'',
                state:'',
                name:'',
                date:'',
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
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
                {
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
                {
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
                {
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
                {
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
                {
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
                {
                    name:'11楼1号',
                    type:'xx12345',
                    bodycode:'xxa123456789',
                    code:'123456',
                    volume:'8/12',
                    state:'断电',
                    business:'天上人间',
                    createTime:'2019/10/02 12：00：15',
                    updateTime:'2019/10/02 12：00：18'
                },
            ],
            multipleSelection: [],
            set_add_visible:false,           //配置/添加弹窗
            set_mention_visible:false,       //底部配置操作按钮事件
            set_add_form:{                  //配置 表单
                name:'',
                type:'',
                volume:'',
                bodycode:'',
                code:'',
                state:'',
                business:''
            },
            set_add_rule: {                 //配置 表单验证
                type: [
                    { required: true, message: '请选择货柜型号', trigger: 'change' }
                ],
                bodycode: [
                    { required: true, message: '请输入货柜机身编号', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入货柜编号', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择货柜状态', trigger: 'change' }
                ],
                business: [
                    { required: true, message: '请选择分配商家', trigger: 'change' }
                ],
            },
            curTitle:'',
            curVisible:false,
            curMention:'',
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
    methods:{
        /**搜索框 -- 查询 */
        search(){
            if(this.day_one&&this.day_two){
                if(this.day_one > this.day_two){
                    this.$message.error('开始时间不能大于结束时间');
                    return
                }else{
                    this.searchForm.date = this.day_one + ',' + this.day_two;
                }
            }else if(this.day_one){
                this.searchForm.date = this.day_one;
            }else{
                this.searchForm.date = this.day_two;
            }
            console.log(this.searchForm)
        },
        /**操作 -- 配置 */
        settings(type,index){
            console.log(type)
            if(type=='line'){
                this.set_add_visible = true;
            }else{  //底部操作 同时还得是选择的不同的商家 才会显示此弹窗 否则直接为另一个配置弹窗(即点击继续配置的弹窗)
                this.set_mention_visible = true;
            }
        },
        /**清除/删除 第一次提示*/
        metion(type,index){
            this.curVisible = true;
            if(type=='clear'){
                this.curTitle = '货柜配置清除';
                this.curMention = '选中的设备如已分配给商家，清除后原商家将无法管理该货柜！';
            }else{
                this.curTitle = '货柜删除提示';
                this.curMention = '删除该货柜后，原商家及平台将无法管理该货柜！';
            }
            console.log(type,index)
        },
        /**清除/删除 第一次弹窗确认事件 */
        sureClick(){
            this.curShowOne = true;
            this.curShowTwo = true;
        },
        /**清除/删除 取消事件 */
        curcancelClick(){
            this.closeDialog();
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
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },

        /**配置/添加弹窗点击事件 */
        set_add_cancel(){
            this.set_add_form = {
                name:'',
                type:'',
                volume:'',
                bodycode:'',
                code:'',
                state:'',
                business:''
            };
            this.set_add_visible = false;
        },
        set_add_sure(){
            this.set_add_visible = false;
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