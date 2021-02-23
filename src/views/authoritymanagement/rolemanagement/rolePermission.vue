<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
      <div slot="title">维护 <el-tag>{{role.name}}</el-tag> 权限</div>
      <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" style="padding-bottom: 5px;"></el-input>
      <el-tree ref="tree" show-checkbox check-on-click-node default-expand-all :props="{label: 'title'}" highlight-current node-key="id" :data="permissionList" :filter-node-method="filterNode" :expand-on-click-node="false" style="height: 450px;overflow-y: scroll;">
        <span slot-scope="{ node, data }">
          <i v-if="data.type==2" class="fa fa-cog"></i>&nbsp;{{ node.label }}
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer" v-if="role.super != '1'">
        <el-button type="primary" :loading="loading" @click="saveRolePermission">保存</el-button>
        <el-button @click="close">取消</el-button>
      </div>
  </el-dialog>

</template>
<script>
import { aes_encryptObject } from '@/api/tools'
import { permissionSave } from '@/api/sys/role'
export default {
  name: 'rolePermission',
  props: {
    role: Object,
    value: Boolean,
    project_id: Number
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      filterText: '',
      permissionList: []
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    dialogOpen () {
      this.$http.get(this.$configApi.menuList, {
        params: aes_encryptObject({project_id: this.project_id})
      }).then(res => {
        if (res.code === '0') {
          this.permissionList = res.data
        }
      })
      this.$http.get(this.$configApi.rolePermissionList, {
        params: aes_encryptObject({project_id: this.project_id, role_id: this.role.id})
      }).then(res => {
        if (res.data.permission) {
          this.$refs.tree.setCheckedKeys(res.data.permission)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    saveRolePermission () {
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      console.log('checkedNodes', checkedNodes)
      const checkedPermissins = []
      for (const checked of checkedNodes) {
        checkedPermissins.push(checked.id)
      }
      console.log('checkedPermissins', checkedPermissins)
      if (checkedPermissins.length == 0) {
        this.$message.info('请先勾选需要的权限')
        return
      }
      const data = {
        role_id: this.role.id,
        permissions: checkedPermissins,
        project_id: this.project_id
      }
      this.loading = true
      permissionSave(data).then(res => {
        if (res.code === '0') {
          this.loading = false
          this.$message.success('保存成功')
          this.dialogVisible = false
        } else {
          this.loading = false
        }
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
