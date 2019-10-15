<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item label="创建时间">
                    <el-date-picker v-model="day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.type" placeholder="请输入货柜类型"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="set_add_visible = true"><svg-icon icon-class="add" style="margin-right:5px;"/>添加</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="type" label="货柜型号" align="center"></el-table-column>
                <el-table-column prop="volume" label="容量" align="center"></el-table-column>
                <el-table-column prop="specifications" label="规格(cm)" align="center"></el-table-column>
                <el-table-column prop="layer" label="层数" align="center"></el-table-column>
                <el-table-column prop="unitprice" label="单价(元)" align="center"></el-table-column>
                <el-table-column prop="number" label="数量" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="200"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text">编辑</el-button>
                        <el-button @click.native.prevent="deletes(scope.$index)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <!-- 添加/编辑 弹窗 -->
        <el-dialog title="货柜型号编辑/添加" :visible.sync="set_add_visible" width="35%" center :close-on-click-modal='false'>
            <el-form :model="set_add_form" class="set_add_form" :rules="set_add_rule" ref="set_add_form" label-width="120px">
                <el-form-item label="货柜型号" prop="type">
                    <el-input v-model="set_add_form.type" placeholder="请输入货柜型号"></el-input>
                </el-form-item>
                <el-form-item label="容量" prop="volume">
                    <el-input v-model="set_add_form.volume" placeholder="请输入货柜的总容量"></el-input>
                </el-form-item>
                <el-form-item label="规格" prop="specifications">
                    <el-input v-model="set_add_form.specifications" placeholder="请输入货柜的尺寸规格"></el-input>
                    <span>厘米</span>
                </el-form-item>
                <el-form-item label="层数" prop="layer">
                    <el-input v-model="set_add_form.layer" placeholder="请输入货柜层数"></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="unitprice">
                    <el-input v-model="set_add_form.unitprice" placeholder="请输入货柜的单价"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="set_add_form.number" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="set_add_cancel">取 消</el-button>
                <el-button @click="set_add_sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除 弹窗 -->
        <el-dialog title="货柜类型删除" :visible.sync="delete_visible" width="30%" @close="closeDialog">
            <span v-show="deletefail" style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>该类型的货柜数量不为0，不能删除！</span>
            <span v-show="deletesuccess" style="font-size:18px;"><i class="el-icon-warning" style="margin-right:5px;"></i>确定删除该类型的货柜么？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="setClick(deletefail)">{{ deletefail ? '确定' : '删除' }}</el-button>
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
        .footer{
            .pages{
                float: right;
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
                    right: 110px;
                }
            }
        }
    }
</style>

<script>
export default {
    data() {
        return {
            searchForm:{        //搜索表单
                date:'',
                type:'',
                curpage:1,
                pagesizes:[10,20,50,100],
                pagesize:10,
                total:100
            },
            day_one:'',
            day_two:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            set_add_visible:false,      //添加/编辑弹窗
            tableData:[         //表格数据
                {
                    type:'xx123456',
                    volume:'16',
                    specifications:'123*456',
                    layer:'5',
                    unitprice:'500.00',
                    number:'16',
                    createTime:'2019/12/12 18:00:00',
                    updateTime:'2019/12/12 18:00:00'
                },
                {
                    type:'xx123456',
                    volume:'16',
                    specifications:'123*456',
                    layer:'5',
                    unitprice:'500.00',
                    number:'16',
                    createTime:'2019/12/12 18:00:00',
                    updateTime:'2019/12/12 18:00:00'
                },
                {
                    type:'xx123456',
                    volume:'16',
                    specifications:'123*456',
                    layer:'5',
                    unitprice:'500.00',
                    number:'16',
                    createTime:'2019/12/12 18:00:00',
                    updateTime:'2019/12/12 18:00:00'
                }
            ],
            set_add_form:{      //编辑/添加 表单
                type:'',
                volume:'',
                specifications:'',
                layer:'',
                unitprice:'',
                number:'16',
            },
            set_add_rule: {                 //编辑/添加 表单验证
                type: [
                    { required: true, message: '请输入货柜型号', trigger: 'blur' }
                ],
                volume: [
                    { required: true, message: '请输入货柜容量', trigger: 'blur' }
                ],
                specifications: [
                    { required: true, message: '请输入货柜规格', trigger: 'blur' }
                ],
                layer: [
                    { required: true, message: '请输入货柜层数', trigger: 'blur' }
                ],
                unitprice: [
                    { required: true, message: '请输入货柜单价', trigger: 'blur' }
                ],
            },
            delete_visible:false,       //删除弹窗
            deletefail:false,              //删除失败显示内容
            deletesuccess:false,            //删除成功显示内容
        }
    },
    methods:{
        /** 查询 */
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
        /** 表格 -- 编辑 */
        edit(index){
            this.set_add_visible = true;
        },
        /** 表格 -- 删除 */
        deletes(index){
            this.delete_visible = true;
            if(index==0){
                this.deletefail = true;
            }else{
                this.deletesuccess = true;
            }
        },
        /** 删除 -- 确定事件 */
        setClick(isDelete){
            if(isDelete){       //不能删除
                this.delete_visible = false;
                this.deletefail = false;
            }else{
                this.delete_visible = false;
                this.deletesuccess = false;
                this.$message.success('删除成功！');
            }
        },
        /** 删除 -- 关闭/取消关闭弹窗 */
        closeDialog(){
            this.delete_visible = false;
            this.deletefail = false;
            this.deletesuccess = false;
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