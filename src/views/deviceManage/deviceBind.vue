<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-input v-model="searchForm.ckeys" placeholder="请输入DTU编号/货柜编号/货柜型号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="dtu_no" label="DTU编号" align="center"></el-table-column>
                <el-table-column prop="dto_status" label="DTU状态" align="center"></el-table-column>
                <el-table-column prop="surface_no" label="货柜编号" align="center"></el-table-column>
                <el-table-column prop="model" label="货柜型号" align="center"></el-table-column>
                <el-table-column prop="spec" label="规格(cm)" align="center"></el-table-column>
                <el-table-column prop="volume" label="容量" align="center"></el-table-column>
                <el-table-column prop="gmt_created" label="创建时间" align="center" width="200"></el-table-column>
                <el-table-column prop="gmt_modified" label="更新时间" align="center" width="200"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="setCode(scope.row.id,scope.$index)" type="text">二维码</el-button>
                        <el-button @click.native.prevent="edit(scope.row.id,scope.$index)" type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.page" :page-sizes="pagesizes" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-footer>
        <!-- 添加/编辑 弹窗 -->
        <el-dialog title="设备绑定" :visible.sync="set_add_visible" width="35%" center :close-on-click-modal='false'>
            <el-form :model="set_add_form" class="set_add_form" :rules="set_add_rule" ref="set_add_form" label-width="120px">
                <el-form-item label="货柜编号" prop="surface_no">
                    <el-input v-model="set_add_form.surface_no" placeholder="请输入货柜编号（二维码）"></el-input>
                </el-form-item>
                <el-form-item label="货柜型号" prop="model">
                    <el-radio-group v-model="set_add_form.is_new" @change="changeType">
                        <el-radio label="已有型号" value="0"></el-radio>
                        <el-radio label="新型号" value="1"></el-radio>
                    </el-radio-group>
                    <el-select v-model="hasType" placeholder="请选择" v-show="set_add_form.isNew==0" style="width:80%;">
                        <el-option :label="item.model" :value="item.model_id" v-for="(item,index) in type" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="newType" placeholder="请输入货柜型号" v-show="set_add_form.isNew==1"></el-input>
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
                <el-form-item label="DTU编号" prop="dtu_no">
                    <el-input v-model="set_add_form.dtu_no" disabled></el-input>
                </el-form-item>
                <el-form-item label="DTU状态" prop="dto_status">
                    <el-input v-model="set_add_form.dto_status" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_add_cancel">取 消</el-button>
                <el-button @click="set_add_sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 二维码查看 -->
        <el-dialog title="二维码查看" :visible.sync="code_view_visible" width="35%" center :close-on-click-modal='false' @close="closeCodeView">
            <p class="imgTxt">DTU编号：{{views.dtu_no}}  货柜编号：{{views.surface_no}}</p>
            <div class="imgBox">
                <img :src="views.qrcode" v-show="views.qrcode">
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
import requestData  from '@/utils/requestMethod';
import regRxp from '@/utils/validate';
export default {
    data() {
        return {
            searchForm:{        //搜索表单
                ckeys:'',
                page:1,
                limit:10,
            },
            pagesizes:[10,20,50,100],
            total:100,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            set_add_visible:false,      //添加/编辑弹窗
            tableData:[],         //表格数据
            type:[],                //已有型号
            set_add_form:{      //编辑/添加 表单
                surface_no:'',
                model:'已有型号',
                volume:'',
                width:'',
                height:'',
                dtuCode:'',
                dtuState:'',
                is_new:''
            },
            hasType:'',
            newType:'',
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
            views:{},                           //查看窗口
        }
    },
    mounted(){
        this.getList();
    },
    methods:{
        /** 获取列表 */
        getList(){
            requestData('/api/container/bind/list',{
                ...this.searchForm
            },'get').then((res)=>{
                if(res.status==200){
                    this.tableData = res.data;
                    this.total = res.count;
                }else{
                    this.$message.error(res.message);
                }
                this.set_add_visible = false;
            },(err)=>{
                console.log(err)
            })
        },
        /** 查询 */
        search(){
            this.getList();
        },
        /** 表格 -- 二维码 */
        setCode(id,index){
            this.code_view_visible = true;
            requestData('/api/container/detail',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.views = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
        },
        /** 关闭二维码查看弹窗 */
        closeCodeView(){
            this.views = {};
            this.code_view_visible = false;
        },
        /** 获取型号 */
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
        /** 表格 -- 编辑 */
        edit(id,index){
            requestData('/api/container/bind/detail',{
                id:id
            },'get').then((res)=>{
                if(res.status==200){
                    this.getType();
                    this.set_add_visible = true;
                    this.set_add_form = res.data;
                }else{
                    this.$message.error(res.message);
                }
            },(err)=>{
                console.log(err)
            })
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
            this.searchForm.limit = val;
            this.getList();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.searchForm.page = val;
            this.getList();
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