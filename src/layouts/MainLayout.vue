<template>
  <div class="layout-container">
    <!-- Header区域 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <el-icon :size="24">
              <Platform />
            </el-icon>
          </div>
          <span class="logo-text">警综平台演示DEMO</span>
        </div>
        <div class="header-right">
          <el-space :size="20">
            <el-badge :value="12" class="item" type="danger">
              <el-button :icon="Bell" circle class="bell-btn" />
            </el-badge>
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="34" :src="userAvatar" />
                <span class="username">管理员</span>
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </div>
      </div>
    </el-header>

    <!-- 主体区域 -->
    <div class="main-container">
      <!-- Aside侧边栏 -->
      <el-aside class="aside" width="240px">
        <div class="sidebar-brand">
          <span class="brand-text">警务管理系统</span>
          <span class="brand-version">v2.0</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="transparent"
          text-color="#94a3b8"
          active-text-color="#ffffff"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>

          <el-menu-item index="/todo">
            <el-icon><Notebook /></el-icon>
            <span>今日待办</span>
          </el-menu-item>

          <el-menu-item index="/all-incidents">
            <el-icon><Document /></el-icon>
            <span>全部警情</span>
          </el-menu-item>

          <el-menu-item index="/police-approval">
            <el-icon><Warning /></el-icon>
            <span>处警审批</span>
          </el-menu-item>

          <el-menu-item index="/modify">
            <el-icon><Edit /></el-icon>
            <span>警情修改</span>
          </el-menu-item>

          <el-menu-item index="/transfer">
            <el-icon><Van /></el-icon>
            <span>移送警情管理</span>
          </el-menu-item>

        </el-menu>
      </el-aside>

      <!-- Main内容区域 - 使用 router-view -->
      <el-main class="main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  House,
  Notebook,
  Document,
  Warning,
  Edit,
  Van,
  Bell,
  ArrowDown,
  SwitchButton,
  Setting,
  Platform,
  User
} from '@element-plus/icons-vue'

defineOptions({
  name: 'MainLayout'
})

// 响应式数据
const activeMenu = ref('/home')
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 路由实例
const route = useRoute()
const router = useRouter()

// 监听路由变化，更新激活菜单
import { watch } from 'vue'
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
}, { immediate: true })

// 菜单选择处理 - 编程式导航，只在 main 区域跳转
const handleMenuSelect = (index: string) => {
  router.push(index)
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%);
  color: white;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.25);
  position: relative;
  z-index: 100;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;

      .logo-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .logo-text {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    .header-right {
      .bell-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .username {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.aside {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  box-shadow: 4px 0 24px rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;

  .sidebar-brand {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: baseline;
    gap: 8px;

    .brand-text {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 1px;
    }

    .brand-version {
      font-size: 10px;
      color: #64748b;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .sidebar-menu {
    border: none;
    height: 100%;
    padding: 12px 14px;

    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
      margin-bottom: 6px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.25s ease;

      .el-icon {
        font-size: 18px;
        margin-right: 10px;
      }

      &:hover {
        background: rgba(59, 130, 246, 0.12) !important;
        color: #e2e8f0 !important;
        transform: translateX(2px);
      }

      &.is-active {
        background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
        font-weight: 600;

        &::before {
          content: '';
          position: absolute;
          left: -14px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #60a5fa;
          border-radius: 0 3px 3px 0;
        }
      }
    }
  }
}

.main {
  padding: 0;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  overflow-y: auto;
}

// 响应式设计
@media (max-width: 768px) {
  .aside {
    width: 200px !important;
  }
}
</style>
