<template>
  <el-dialog
    title="用户信息"
    :visible.sync="dialogVisible"
    @opened="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      size="small"
      :rules="rules"
    >
      <el-form-item
        prop="username"
        label="用户账号"
      >
        <el-input v-model="form.username" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item
        prop="name"
        label="用户名称"
      >
        <el-input v-model="form.name" ></el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        label="登录密码"
        v-if="!user.id"
        :rules="[{ required: true, message: '不能为空', trigger: 'blur'}]"
      >
        <el-input type="password" v-model="form.password" autocomplete="new-password" show-password></el-input>
      </el-form-item>
      <el-form-item
        prop="mobile"
        label="手机号"
        :rules="[{ required: true, message: '不能为空', trigger: 'blur'}]"
      >
        <el-input v-model="form.mobile" type="number" oninput="if(value.length>11)value=value.slice(0,11)" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        label="重置密码"
        v-if="user.id"
      >
        <el-input v-model="form.password" type="password" autocomplete="new-password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="saveUser"
        >保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import { getUserSave } from '@/api/sys/role'
export default {
  name: 'userEditForm',
  props: {
    user: Object,
    value: Boolean,
    project_id: Number
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        username: '',
        name: '',
        mobile: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator:function(rule,value,callback){
            if(value.length < 5){
              callback(new Error("用户账号不能低于5个字符！"));
            } else if (value.length > 30) {
              callback(new Error("用户账号不能高于30个字符！"));
            } else{
              callback();
            }
            }, trigger: 'blur'}
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ]
      },
      disabled: false
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
      if (this.user.id) {
        this.disabled = true
        const form = {}
        form.username = this.user.username
        form.name = this.user.name
        form.mobile = this.user.mobile
        form.password = this.user.password
        this.form = form
      } else {
        this.disabled = false
        this.form = {}
      }
    },
    saveUser () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.user.id && (this.form.password == '' || this.form.password == undefined)) {
            this.form.password = '******'
          }
          getUserSave({ ...this.form, id: this.user.id || '', project_id: this.project_id })
            .then(data => {
              this.loading = false
              this.dialogVisible = false
              this.$emit('submit')
            })
        } else {
          return false
        }
      })
    },
    close () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
