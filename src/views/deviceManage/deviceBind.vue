<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-input v-model="searchForm.type" placeholder="请输入DTU编号/货柜编号/货柜型号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="dtuCode" label="DTU编号" align="center"></el-table-column>
                <el-table-column prop="dtuState" label="DTU状态" align="center"></el-table-column>
                <el-table-column prop="code" label="货柜编号" align="center"></el-table-column>
                <el-table-column prop="type" label="货柜型号" align="center"></el-table-column>
                <el-table-column prop="specifications" label="规格(cm)" align="center"></el-table-column>
                <el-table-column prop="volume" label="容量" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="200"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="setCode(scope.$index)" type="text">二维码</el-button>
                        <el-button @click.native.prevent="edit(scope.$index)" type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <!-- 添加/编辑 弹窗 -->
        <el-dialog title="设备绑定" :visible.sync="set_add_visible" width="35%" center :close-on-click-modal='false'>
            <el-form :model="set_add_form" class="set_add_form" :rules="set_add_rule" ref="set_add_form" label-width="120px">
                <el-form-item label="货柜编号" prop="code">
                    <el-input v-model="set_add_form.code" placeholder="请输入货柜编号（二维码）"></el-input>
                </el-form-item>
                <el-form-item label="货柜型号" prop="type">
                    <el-radio-group v-model="set_add_form.type" @change="changeType">
                        <el-radio label="已有型号"></el-radio>
                        <el-radio label="新型号"></el-radio>
                    </el-radio-group>
                    <el-select v-model="set_add_form.hasType" placeholder="请选择" v-show="!isNew" style="width:80%;">
                        <el-option label="型号一" value="0"></el-option>
                        <el-option label="型号二" value="1"></el-option>
                    </el-select>
                    <el-input v-model="set_add_form.newType" placeholder="请输入货柜型号" v-show="isNew"></el-input>
                </el-form-item>
                <el-form-item label="规格" prop="specifications">
                    <el-input v-model="set_add_form.width" placeholder="货柜宽度" style="width:38%"></el-input>
                    <span class="cm_left">厘米</span>
                    <b> * </b>
                    <el-input v-model="set_add_form.height" placeholder="货柜高度" style="width:39%"></el-input>
                    <span class="cm_right">厘米</span>
                </el-form-item>
                <el-form-item label="容量" prop="volume">
                    <el-input v-model="set_add_form.volume" placeholder="请输入货柜的总容量"></el-input>
                </el-form-item>
                <el-form-item label="DTU编号" prop="dtuCode">
                    <el-input v-model="set_add_form.dtuCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="DTU状态" prop="dtuState">
                    <el-input v-model="set_add_form.dtuState" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_add_cancel">取 消</el-button>
                <el-button @click="set_add_sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 二维码查看 -->
        <el-dialog title="二维码查看" :visible.sync="code_view_visible" width="35%" center :close-on-click-modal='false' @close="closeCodeView">
            <p class="imgTxt">DTU编号：13456465446  货柜编号：13415646</p>
            <div class="imgBox">
                <img src="../../assets/imgs/banner.jpg">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_add_sure">打 印</el-button>
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
                    margin-right: 120px;
                    .el-input{
                        width: 140%;
                    }
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
        .set_add_form{
            .el-form-item{
                position: relative;
                .el-input{
                    width: 80% ;
                }
                span{
                    position: absolute;
                }
                .cm_left{
                    right: 315px;
                }
                .cm_right{
                    right: 115px;
                }
            }
        }
        /**二维码查看弹窗样式 */
        .imgTxt{
            font-size: 18px;
            color: #c1c1c1;
            margin: 0;
        }
        .imgBox{
            width: 300px;
            height: 300px;
            margin: 10px auto 0 auto;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>

<script>
export default {
    data() {
        return {
            searchForm:{        //搜索表单
                type:'',
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
            set_add_visible:false,      //添加/编辑弹窗
            tableData:[         //表格数据
                {
                    dtuCode:'123456',
                    dtuState:'断电',
                    code:'xx1234564',
                    type:'xx123456',
                    specifications:'123*456',
                    volume:'16',
                    createTime:'2019/12/12 18:00:00',
                    updateTime:'2019/12/12 18:00:00'
                },
                {
                    dtuCode:'123456',
                    dtuState:'断电',
                    code:'xx1234564',
                    type:'xx123456',
                    specifications:'123*456',
                    volume:'16',
                    createTime:'2019/12/12 18:00:00',
                    updateTime:'2019/12/12 18:00:00'
                },
                {
                    dtuCode:'123456',
                    dtuState:'断电',
                    code:'xx1234564',
                    type:'xx123456',
                    specifications:'123*456',
                    volume:'16',
                    createTime:'2019/12/12 18:00:00',
                    updateTime:'2019/12/12 18:00:00'
                }
            ],
            isNew:false,            //是否新型号
            set_add_form:{      //编辑/添加 表单
                code:'',
                type:'已有型号',
                hasType:'',
                newType:'',
                volume:'',
                specifications:'',
                width:'',
                height:'',
                dtuCode:'',
                dtuState:''
            },
            set_add_rule: {                 //编辑/添加 表单验证
                code: [
                    { required: true, message: '请输入货柜编号', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请输入货柜型号', trigger: 'blur' }
                ],
                volume: [
                    { required: true, message: '请输入货柜容量', trigger: 'blur' }
                ],
                specifications: [
                    { required: true, message: '请输入货柜规格', trigger: 'blur' }
                ],
                dtuCode: [
                    { required: true, message: 'DTU编号', trigger: 'blur' }
                ],
                dtuState: [
                    { required: true, message: 'DTU状态', trigger: 'blur' }
                ],
            },
            code_view_visible:false,         //二维码查看弹窗
        }
    },
    methods:{
        /** 查询 */
        search(){
            console.log(this.searchForm)
        },
        /** 表格 -- 二维码 */
        setCode(index){
            console.log(index)
            this.code_view_visible = true;
        },
        /** 关闭二维码查看弹窗 */
        closeCodeView(){
            this.code_view_visible = false;
        },
        /** 表格 -- 编辑 */
        edit(index){
            this.set_add_visible = true;
        },
        /** 编辑 -- 货柜型号切换 */
        changeType(){
            if(this.set_add_form.type == '已有型号'){
                this.isNew = false;
            }else{
                this.isNew = true;
            }
        },
        /**页码操作 */
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },

        /** 弹窗 -- 取消事件 */
        set_add_cancel(){
            this.set_add_form = {
                type:'',
                volume:'',
                specifications:'',
                layer:'',
                unitprice:'',
                number:''
            }
            this.set_add_visible = false;
        },
        /** 弹窗 -- 确认事件 */
        set_add_sure(){
            console.log(this.set_add_form)
            this.set_add_visible = false;
        }
    }
}
</script>