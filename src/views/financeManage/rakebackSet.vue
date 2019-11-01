<template>
    <el-container class="container">
        <el-header class="header">
            <el-form :inline="true" :model="searchForm" class="form">
                <el-form-item>
                    <el-select v-model="searchForm.paytime">
                        <el-option label="创建时间" value="0"></el-option>
                        <el-option label="更新时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker v-model="searchForm.day_one" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                    <span> - </span>
                    <el-date-picker v-model="searchForm.day_two" type="datetime" placeholder="选择日期" value-format="yyyy/MM/dd HH:mm:ss" :picker-options="pickerOptions">></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search"><svg-icon icon-class="search" style="margin-right:5px;"/>查询</el-button>
                    <el-button type="primary" @click="exportXLS">XLS导出</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" border>
                <el-table-column prop="business" label="商家名称" align="center"></el-table-column>
                <el-table-column prop="businessaccount" label="商家返佣账号" align="center"></el-table-column>
                <el-table-column prop="businessratio" label="商家返佣比例" align="center" width="150"></el-table-column>
                <el-table-column prop="manager" label="中介" align="center"></el-table-column>
                <el-table-column prop="manageraccount" label="中介返佣账号" align="center"></el-table-column>
                <el-table-column prop="managerratio" label="中介返佣比例" align="center" width="150"></el-table-column>
                <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updatetime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="view(scope.$index)" type="text" size="small">配置</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-pagination class="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.curpage" :page-sizes="searchForm.pagesizes" :page-size="searchForm.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total"></el-pagination>
        </el-footer>
        <!-- 表格 -- 配置 弹窗 -->
        <el-dialog title="配置返佣" :visible.sync="set_visible" width="35%" center :close-on-click-modal='false' @close="set_cancel">
            <div class="userInfo">
                <p><span>返佣商家 ：</span>天上人间</p>
                <p><span>货柜数量 ：</span>30</p>
                <p><span>货柜总容量 ：</span>150</p>
            </div>
            <el-form :model="set_form" class="set_form" label-width="120px">
                <el-form-item label="商家返佣比例">
                    <el-input v-model="set_form.businessratio" placeholder="请输入"></el-input>
                    <span>%</span>
                </el-form-item>
                <el-form-item label="返佣中介">
                    <el-select v-model="set_form.manager" placeholder="请选择" style="width:80%">
                        <el-option label="中介1" value="0"></el-option>
                        <el-option label="中介2" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中介返佣比例">
                    <el-input v-model="set_form.managerratio" placeholder="请输入"></el-input>
                    <span>%</span>
                </el-form-item>
                <el-form-item label="平台收益比例">
                    <el-input v-model="set_form.benefitratio" disabled></el-input>
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
export default {
    data() {
        return {
            searchForm:{
                paytime:'',
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
                    business:'天上人间',
                    businessaccount:'1111111111',
                    businessratio:'1%',
                    manager:'天上人间',
                    manageraccount:'222222222222',
                    managerratio:'1%',
                    createtime:'2015/11/10 15：00：15',
                    updatetime:'2015/11/10 15：00：15',
                },
                {
                    business:'天上人间',
                    businessaccount:'1111111111',
                    businessratio:'1%',
                    manager:'天上人间',
                    manageraccount:'222222222222',
                    managerratio:'1%',
                    createtime:'2015/11/10 15：00：15',
                    updatetime:'2015/11/10 15：00：15',
                },
                {
                    business:'天上人间',
                    businessaccount:'1111111111',
                    businessratio:'1%',
                    manager:'天上人间',
                    manageraccount:'222222222222',
                    managerratio:'1%',
                    createtime:'2015/11/10 15：00：15',
                    updatetime:'2015/11/10 15：00：15',
                },
                {
                    business:'天上人间',
                    businessaccount:'1111111111',
                    businessratio:'1%',
                    manager:'天上人间',
                    manageraccount:'222222222222',
                    managerratio:'1%',
                    createtime:'2015/11/10 15：00：15',
                    updatetime:'2015/11/10 15：00：15',
                },
            ],
            set_visible:false,        //配置 弹窗
            set_form:{                  //配置 弹窗 表单
                businessratio:'',
                manager:'',
                managerratio:'',
                benefitratio:''
            }, 
        }
    },
    methods:{
        /** 搜索 */
        search(){
            console.log(this.searchForm)
        },
        /** XSL导出 */
        exportXLS(){

        },
        /** 表单操作 查看 */
        view(index){
            // console.log(index)
            this.set_visible = true;
        },
        /** 弹窗操作 -- 取消 */
        set_cancel(){
            this.set_form = {                  //配置 弹窗 表单
                businessratio:'',
                manager:'',
                managerratio:'',
                benefitratio:''
            };
            this.set_visible = false;
            console.log(this.set_form)
        },
        /** 弹窗操作 -- 确定 */
        set_sure(){
            this.set_visible = false;
            console.log(this.set_form)
        } ,

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