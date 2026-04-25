<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = zhCn
const readmeVisible = ref(true)

</script>


<template>
  <div id="app">
    <!-- 使用Element Plus的全局配置 -->
    <ElConfigProvider :locale="locale">
      <RouterView />
    </ElConfigProvider>

    <el-dialog
      v-model="readmeVisible"
      width="560px"
      :close-on-click-modal="false"
      align-center
    >
      <div class="readme-content">
        <img
          src="@/assets/Fleet_Snowfluff.webp"
          alt="Fleet Snowfluff"
          class="readme-image"
        />
        <div class="disclaimer">
          <p class="disclaimer-title">⚠️ 重要声明：</p>
          <ul class="disclaimer-list">
            <li>本项目仅用于个人技术学习和面试展示。</li>
            <li>所有页面数据、接口返回均为 mock 数据，不包含任何真实敏感信息。</li>
            <li>项目内图标、业务名称均为虚构，与任何真实机构无关。</li>
            <li>禁止用于任何商业目的或实际业务环境。</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="readmeVisible = false">我已了解</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.readme-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.readme-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

.disclaimer {
  width: 100%;
}

.disclaimer-title {
  font-size: 16px;
  font-weight: 700;
  color: #d97706;
  margin: 0 0 10px 0;
}

.disclaimer-list {
  margin: 0;
  padding-left: 20px;
  color: #475569;
  line-height: 1.8;
  font-size: 14px;
}

.disclaimer-list li {
  margin-bottom: 6px;
}
</style>