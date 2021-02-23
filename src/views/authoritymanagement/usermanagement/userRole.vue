<template>
  <el-dialog
    :visible.sync="dialogVisible"
    @open="dialogOpen"
  >
    <div slot="title">维护 
      <el-tag>{{user.username}}</el-tag> 角色</div>
    <el-form
      :inline="true"
      :model="searchForm"
      ref="searchForm"
      size="mini"
      style="margin-bottom: -6px;"
    >
      <el-form-item
        label="角色名称"
        prop="name"
      >
        <el-input
          v-model="searchForm.name"
          placeholder="角色名称"
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

    <el-table
      :data="tableData"
      v-loading="loading"
      size="small"
      stripe
      highlight-current-row
      height="500"
      style="width: 100%;"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="角色名称"
        prop="name"
      >
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>

      <el-table-column
        label="描述"
        align="center"
        prop="remarks"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{scope.row.remarks}}
        </template>
      </el-table-column>
      <el-table-column
        label="启用状态"
        prop="status"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status == '0'"
            size="mini"
            type="info"
          >已禁用</el-tag>
          <el-tag
            v-if="scope.row.status == '1'"
            size="mini"
            type="success"
          >已启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="关联状态"
        prop="user_flag"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="!scope.row.user_flag"
            size="mini"
            type="info"
          >未添加</el-tag>
          <el-tag
            v-if="scope.row.user_flag"
            size="mini"
            type="success"
          >已添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.user_flag"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="modifyRoleUser(scope.row,1)"
          >添加</el-button>
          <el-button
            v-if="scope.row.user_flag"
            type="danger"
            size="mini"
            icon="el-icon-minus"
            @click="modifyRoleUser(scope.row,2)"
          >移除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div slot="footer">
      <el-pagination
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { aes_encryptObject } from '@/api/tools'
import { userRoleEdit } from '@/api/sys/role'
export default {
  name: 'userRole',
  props: {
    user: Object,
    value: Boolean,
    project_id: Number
  },
  data () {
    return {
      dialogVisible: false,
      searchForm: {
        name: '',
        code: ''
      },
      loading: false,
      tableData: [],
      page: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    dialogOpen () {
      this.getTableData()
    },
    getTableData () {
      const query = {
        user_id: this.user.id,
        page: this.page.page,
        limit: this.page.limit,
        project_id: this.project_id,
        name: this.searchForm.name
      }
      this.$http.get(this.$configApi.userUserRoleList, {
        params: aes_encryptObject(query),
      }).then(res => {
        if (res.code === '0') {
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
    modifyRoleUser (row, action) {
      const query = {
        action,
        roleId: row.id,
        userId: this.user.id
      }
      console.log('query', query)
      userRoleEdit(query).then(res => {
        if (res.code === '0') {
          console.log(res.data)
          const msg = action === 1 ? '已添加' : '已移除'
          this.$notify({
            title: '操作成功',
            message: msg,
            type: 'success'
          })
          this.getTableData()
        }
      })
    }
  }
}
</script>
