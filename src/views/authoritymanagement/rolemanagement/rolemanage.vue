<template>
<div>
    <template>
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="名称" style="width: 200px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchFormSubmit">
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
    <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="add">
      新增
    </el-button>
    <!-- <el-button v-if="multipleSelection.length>0" type="danger" size="mini" icon="el-icon-delete" @click="batchDel">
      删除
    </el-button> -->
    <!-- <el-popover placement="top-start" title="温馨提示" width="200" trigger="hover">
      <li>121212</li>
      <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right">
        操作提示
      </el-button>
    </el-popover> -->
    <el-table :data="tableData" height="492" v-loading="loading" size="small" border stripe highlight-current-row style="width: 100%;margin: 10px 0" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <!-- <el-table-column type="selection" width="55" align="center">
      </el-table-column> -->
      <el-table-column label="角色名称" prop="name" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="描述" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.remarks}}
        </template>
      </el-table-column>
      <el-table-column label="所属项目名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.project_name}}
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
            @change="delRole(scope.row.id, scope.row.status)"
          ></el-switch> 
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openEditForm(scope.row)" v-if="scope.row.super != '1'">编辑</el-button>
          <el-button type="warning" size="mini" icon="el-icon-tickets"  @click="openRoleUserDialog(scope.row)">用户列表</el-button>
          <el-button type="info" size="mini" icon="el-icon-setting"  @click="openPermissionDialog(scope.row)">权限</el-button>
          <el-button type="danger" size="mini" icon="el-icon-switch-button"  @click="userLogout(scope.row)">强制退出</el-button>
        </template>
      </el-table-column>
    </el-table>  
    <el-pagination :current-page="page.page" :page-size="page.limit" :total="page.total" :page-sizes="[5,10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>  
    <edit-form :role="role" :project_id="project_id" v-model="editFormVisible" @submit="submit" />
    <role-permission :role="role" :project_id="project_id"  v-model="permissionDialogVisible" />
    <role-user :role="role" :project_id="project_id" v-model="roleUserDialogVisible" />
  </div>
</template>
<script>

import { aes_encryptObject } from '@/api/tools'
import { roleDel, roleClear } from '@/api/sys/role'
import editForm from './editForm'
import rolePermission from './rolePermission'
import roleUser from './roleUser'
export default {
  name: 'RolePage',
  components: { editForm, rolePermission, roleUser },
  props: {
    project_id: Number,
  },
  data () {
    return {
      searchForm: {},
      loading: false,
      tableData: [],
      multipleSelection: [],
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
      role: { id: '', name: '' },
      editFormVisible: false,
      permissionDialogVisible: false,
      roleUserDialogVisible: false,
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
        project_id: this.project_id,
        name: this.searchForm.name
      }
      this.$http.get(this.$configApi.roleList, {
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
    delRole (id, status) {
      const text = ['禁用', '启用']
      this.$confirm(`您确认${text[status]}该角色嘛？`, `${text[status]}提示`, {
        distinguishCancelAndClose: true,
        confirmButtonText: `${text[status]}`,
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          role_id: id,
          status
        }
        roleDel(params).then((res) => {
          if (res.code == '0') {
            this.$message.success(`${text[status]}成功`);
            this.getTableData()
          } else {
            this.getTableData()
            this.$message(res.msg);
          }
        })
      }).catch(() => {
        this.getTableData()
      })
    },
    userLogout(row) {
      this.$confirm(`您确认强制退出该角色下用户嘛？`, `强制退出提示`, {
        distinguishCancelAndClose: true,
        confirmButtonText: `强制退出`,
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          role_id: row.id
        }
        roleClear(params).then((res) => {
          if (res.code == '0') {
            this.$message.success(`强制退出成功`)
          }
        })
      })
    },
    openEditForm (role) {
      this.role = role
      this.editFormVisible = true
    },
    add () {
      this.role = {}
      this.editFormVisible = true
    },
    submit() {
      this.$message.success('保存成功');
      this.getTableData()
    },
    openPermissionDialog (role) {
      this.role = role
      this.permissionDialogVisible = true
    },
    openRoleUserDialog (role) {
      this.role = role
      this.roleUserDialogVisible = !this.roleUserDialogVisible
    }
  }
}
</script>
