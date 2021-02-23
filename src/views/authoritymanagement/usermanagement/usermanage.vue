<template>
  <div>
    <template>
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        size="mini"
      >
        <el-form-item
          label="账号名称"
          prop="username"
        >
          <el-input
            v-model="searchForm.username"
            placeholder="账号名称"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
          style="margin-left: 20px"
        >
          <el-input
            v-model="searchForm.mobile"
            placeholder="手机号"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearchFormSubmit"
          >
            <d2-icon name="search" /> 查询
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleSearchFormReset">
            <d2-icon name="refresh" /> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-circle-plus"
      @click="add"
    >
      新增
    </el-button>
    <!-- <el-button
      v-if="multipleSelection.length>0"
      type="danger"
      size="mini"
      icon="el-icon-delete"
      @click="batchDel"
    >
      删除
    </el-button> -->
    <el-table
      :data="tableData"
      v-loading="loading"
      size="small"
      height="492"
      border
      stripe
      highlight-current-row
      style="width: 100%;margin: 10px 0"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- <el-table-column
        type="selection"
        width="100"
        align="center"
      >
      </el-table-column> -->
      <el-table-column
        label="账号名称"
        prop="username"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.username}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="手机号"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
       <el-table-column
        label="启用状态"
        prop="status"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">     
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="del(scope.row.id, scope.row.status)"
          ></el-switch>   
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="400"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"          
            @click="openEditForm(scope.row)"
          >编辑</el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-tickets"        
            @click="openUserRoleDialog(scope.row)"
          >角色列表</el-button>
           <el-button
            type="danger"
            size="mini"
            icon="el-icon-switch-button"        
            @click="userLogout(scope.row)"
          >强制退出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        :page-sizes="[5,10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
    </el-pagination>
    <edit-form
      :user="user"
      :project_id="project_id"
      v-model="editFormVisible"
      @submit="getTableData"
    />
    <user-role
      :user="user"
      :project_id="project_id"
      v-model="userRoleDialogVisible"
    />
  </div>
</template>
<script>
import { aes_encryptObject } from '@/api/tools'
import userRole from './userRole'
import editForm from './editForm'
import { userStatus, userClear } from '@/api/sys/role'
export default {
  name: 'UserPage',
  components: { editForm, userRole },
  props: {
    project_id: Number,
  },
  data () {
    return {
      searchForm: {
        username: '',
        mobile: ''
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
      user: {},
      editFormVisible: false,
      userRoleDialogVisible: false
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      let query = {
        page: this.page.page,
        limit: this.page.limit,
        project_id: 1,
        mobile: this.searchForm.mobile,
        username: this.searchForm.username
      }
      this.$http.get(this.$configApi.userList, {
        params: aes_encryptObject(query),
      }).then(res => {
        if(res.code == '0') {
          this.tableData = res.data
          this.page.total = res.count
        }      
      })
    },
    handleSearchFormSubmit () {
      this.getTableData()
    },
    handleSearchFormReset () {
      this.$refs.searchForm.resetFields()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSortChange (val) {
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getTableData()
    },
    handleSizeChange (val) {
      this.page.limit = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getTableData()
    },
    openEditForm (user) {
      console.log(user)
      this.user = user
      this.editFormVisible = true
    },
    add () {
      this.user = {}
      this.editFormVisible = true
    },
    openUserRoleDialog (user) {
      console.log(user)
      this.user = user
      this.userRoleDialogVisible = true
    },
    del (id, status) {
      const text = ['禁用', '启用']
      this.$confirm(`您确认${text[status]}该用户嘛？`, `${text[status]}提示`, {
        distinguishCancelAndClose: true,
        confirmButtonText: `${text[status]}`,
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          userId: id,
          status
        }
        userStatus(params).then((res) => {
          if (res.code == '0') {
            this.$message.success(`${text[status]}成功`)
            this.getTableData()
          }
        })
      }).catch(() => {
        this.getTableData()
      })
    },
    userLogout(row) {
       this.$confirm(`您确认强制退出该用户嘛？`, `强制退出提示`, {
        distinguishCancelAndClose: true,
        confirmButtonText: `强制退出`,
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          user_id: row.id
        }
        console.log('params', params)
        userClear(params).then((res) => {
          if (res.code == '0') {
            this.$message.success(`强制退出成功`)
          }
        })
      })
    }
  }
}
</script>
