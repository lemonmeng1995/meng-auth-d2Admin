<template>
  <d2-container>
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane label="权限系统管理后台" name="first">
          <usermanagement :project_id="0" ></usermanagement>
        </el-tab-pane> -->
        <el-tab-pane label="弗兰合伙人管理后台" name="second">
          <usermanagement :project_id="1" ></usermanagement>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </d2-container>
</template>
<script>
import usermanagement from "./usermanage";
export default {
  components: { usermanagement },
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
