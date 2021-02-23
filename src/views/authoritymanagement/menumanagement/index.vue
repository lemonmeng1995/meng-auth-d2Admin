<template>
  <d2-container>
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane label="公共权限管理后台" name="first">
          <menumang :project_id="0" />
        </el-tab-pane> -->
        <el-tab-pane label="弗兰合伙人管理后台" name="second">
          <menumang :project_id="1" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </d2-container>
</template>
<script>
import * as menuService from "@/api/sys/menu";
import { aes_encryptObject } from "@/api/tools";
import menumang from "./menumang";
export default {
  name: "managementMenu",
  components: { menumang },
  data() {
    return {
      activeName: "second",
    };
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
