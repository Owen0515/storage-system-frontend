<template>
    <nav class="navbar bg-body-tertiary fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">倉儲管理系統</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasNavbarLabel">歡迎 {{ authStore.username }} !</h5>
                    <p v-for="role in displayRoles" :key="role" class="text-success">{{ role }}</p>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li v-if="!authStore.isLoggedIn" class="nav-item">
                            <router-link class="nav-link active" aria-current="page" to="/">登入</router-link>
                        </li>
                        <span v-else>
                            <li  class="nav-item">
                                <a href="#" @click="handleLogout" class="nav-link active">登出</a>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/products">產品查詢</router-link>
                            </li>
                            <li v-if="authStore.hasRole('admin') || authStore.hasRole('warehouseManager')" class="nav-item">
                                <router-link class="nav-link" to="/records">紀錄查詢</router-link>
                            </li>
                        </span>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { onMounted,ref,computed } from "vue";
import { useAuthStore } from "../stores/auth.js";

const authStore = useAuthStore();

// 登出
const handleLogout = () => {
  authStore.logout();
};

// 角色名稱映射
const roleMapping = {
  admin: "管理員",
  warehouseManager: "倉儲管理員",
  employees: "一般員工",
};

// 名稱轉換
const displayRoles = computed(() =>
  authStore.roles.map((role) => roleMapping[role] || "未知角色")
);

</script>

<style>
.text-success{
    margin: auto auto 2px 10px;
}
</style>