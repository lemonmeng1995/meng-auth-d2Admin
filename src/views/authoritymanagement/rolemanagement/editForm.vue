<template>
  <el-dialog title="角色信息" :visible.sync="dialogVisible" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small" :rules="rules">
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks"  :rules="[{ required: true, message: '不能为空', trigger: 'blur'}]">
        <el-input v-model="form.remarks"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="saveRole">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import { getRoleSave } from '@/api/sys/role'
export default {
  name: 'roleEditForm',
  props: {
    role: Object,
    value: Boolean,
    project_id: Number
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        name: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator:function(rule,value,callback){
            if(value.length > 30){
              callback(new Error("角色名称不能高于30个字符！"));
            }else{
              callback();
            }
            }, trigger: 'blur'}
        ],
      },
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
      this.$refs.form.resetFields()
      if (this.role.id) {
          const form = {}
          form.name = this.role.name
          form.remarks = this.role.remarks
          this.form = form
        } else {
          this.form = {}
        }
    },
    saveRole () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          getRoleSave({ ...this.form, role_id: this.role.id || '', project_id: this.project_id })
            .then(res => {
              if (res.code == '0') {
                this.loading = false
                this.dialogVisible = false
                this.$emit('submit')
              } else {
                this.loading = false
                this.dialogVisible = false
              }
            })
        } else {
          return false
        }
      })
    },
    close () {
      this.dialogClose()
    },
    dialogClose () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
