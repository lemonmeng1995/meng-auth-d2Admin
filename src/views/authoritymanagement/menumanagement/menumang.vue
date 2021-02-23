<template>
  <div>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addFather"
        >添加父菜单</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="add"
        >添加子菜单</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="edit"
        :disabled="!currentId"
        >编辑</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-delete"
        size="mini"
        :disabled="!currentId"
        @click="del"
        >删除</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-circle-close-outline"
        size="mini"
        :disabled="!currentId"
        @click="cancel"
        >取消</el-button
      >
    </el-button-group>
    <el-popover
      placement="top-start"
      title="温馨提示"
      width="400"
      trigger="hover"
    >
      <li>请不要在`功能`类型节点下建子节点</li>
      <li>`菜单`类型节点的权限标识请设置为其某个`功能`类型子节点的权限标识</li>
      <el-button
        slot="reference"
        size="mini"
        icon="el-icon-info"
        style="float: right"
        >操作提示</el-button
      >
    </el-popover>
    <el-row>
      <el-col :span="8" style="margin-top: 15px">
        <el-tree
          v-loading="treeloading"
          ref="tree"
          class="filter-tree"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          :data="menuList"
          :props="defaultProps"
          @node-click="getMenuData"
        ></el-tree>
      </el-col>
      <el-col :span="16" style="margin-top: 15px">
        <el-card shadow="always">
          <el-form
            label-position="right"
            label-width="80px"
            :model="menuform"
            ref="menuform"
          >
            <el-form-item label="父级节点" prop="parentId">
              <el-input
                v-model="menuform.parentId"
                :disabled="true"
                placeholder="父级节点"
              ></el-input>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input
                v-model="menuform.title"
                :disabled="!formEdit"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
              <el-input
                v-model="menuform.path"
                :disabled="!formEdit"
                placeholder="请输入路径"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="图标"
              prop="icon"
            >
              <d2-icon-select
                v-model="menuform.icon"
                :user-input="true"
              />
            </el-form-item>
            <el-form-item label="权限标识" prop="permission">
              <el-input
                v-model="menuform.permission"
                :disabled="!formEdit"
                placeholder="请输入权限标识"
              ></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model="menuform.sort"
                :disabled="!formEdit"
                placeholder="请输入排序"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select
                class="filter-item"
                v-model="menuform.type"
                :disabled="!formEdit"
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.velue"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="formEdit">
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button @click="reset">清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as menuService from "@/api/sys/menu";
import { aes_encryptObject } from "@/api/tools";
export default {
  name: "menumang",
  props: {
    project_id: Number,
  },
  data() {
    return {
      treeloading:false,
      defaultProps: {
        label: "title",
      },
      currentId: 0,
      menuList: [],
      formEdit: false,
      menuform: {},
      typeOptions: [
        {
          value: 1,
          label: "菜单",
        },
        {
          value: 2,
          label: "功能",
        },
      ],
    };
  },
  created() {
    console.log("一进来,", this.project_id);
    this.getMenuList();
  },
  methods: {
    getMenuList() {
        this.treeloading = true
      this.$http
        .get(this.$configApi.menuList, {
          params: aes_encryptObject({ project_id: this.project_id }),
        })
        .then((res) => {
          console.log("一进来拿到的数据tree,", res);
          if (res.code === "0") {
            this.treeloading = false
            this.menuList = res.data;
          }
        });
    },
    getMenuData(data) {
      console.log("点击菜单的时候，，", data);
      let id = data.id;
      this.menuform = {
        id: data.id,
        parentId: data.parent_id,
        title: data.title,
        path: data.path,
        icon: data.icon,
        permission: data.permission,
        sort: data.sort,
        type: data.type,
      };
      this.currentId = id;
    },
    submit() {
      if (!this.menuform.type) {
        this.$message({
          type: "info",
          message: "请选择类型！！！",
        });
        return;
      } else {
        if (this.menuform.type == 1) {
          if (!this.menuform.path) {
            this.$message({
              type: "info",
              message: "类型为菜单，路径必填！！！",
            });
            return;
          }
        }
      }
      menuService.getmenuSave(this.menuform).then((res) => {
        console.log("保存提交，，，", res, this.menuform);
        if (res.code == 0) {
          this.getMenuList();
          this.reset();
          this.formEdit = false;
        }
      });
    },
    reset() {
      this.menuform = {
        id: this.currentId,
        parentId: this.menuform.parentId,
        title: "",
        path: "",
        icon: "",
        permission: "",
        sort: 0,
        type: 1,
      };
    },
    //编辑需要把当前id传过去
    edit() {
      this.formEdit = true;
    },
    addFather() {
      this.formEdit = true;
      this.menuform = {
        parentId: 0,
        project_id: this.project_id,
      };
    },
    add() {
     
      if( this.menuform.type == '2'){
            this.$message({
              type: "info",
              message: "请不要在`功能`类型节点下建子节点！！！",
            });
            return;
      }else{
           this.formEdit = true;
           this.menuform = {
                parentId: this.currentId,
                project_id: this.project_id,
            };

      }
     
      // this.menuform = {
      //   parentId: this.currentId,
      //   project_id:'1',
      //   title: "弗兰合伙人后台",
      //   path: "/partner-admin-web",
      //   permission: "PARTNER-ADMIN-WEB",
      //   sort: 1,
      //   type: 1,
      // };
    },
    cancel() {
      this.formEdit = false;
      this.currentId = 0;
      this.menuform = {};
    },
    del() {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      }).then(() => {
        menuService.getmenuDelete({ menu_id: this.currentId }).then((res) => {
            if(res.code == 0){
                this.currentId = 0;
                this.getMenuList();
                this.reset();
            }
        });
      });
    },
  },
};
</script>
<style scoped>
</style>