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
    }
</style>

<script>
export default {
    data() {
        return {
            searchForm:{
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
            set_add_visible:false,
            tableData:[
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

            ]
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

        },
        /** 表格 -- 删除 */
        deletes(index){

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