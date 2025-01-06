<template>
  <div class="login-container">
    <h1>登入</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用戶名</label>
        <input v-model="loginData.username" type="text" id="username" placeholder="請輸入用戶名" class="form-control" required/>
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input v-model="loginData.password" type="password" id="password" placeholder="請輸入密碼" class="form-control" required/>
      </div>
      <button type="submit" class="btn btn-primary">登入</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../plugins/axios";
import Swal from "sweetalert2";
import router from "../routers/routers.js"; 
import { useAuthStore } from "../stores/auth.js";

const authStore = useAuthStore();

const loginData = ref({
  username: "",
  password: "",
});

const handleLogin = () => {
  authStore.login(loginData.value);
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}
.form-group {
  margin-bottom: 15px;
}
</style>
