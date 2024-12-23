import {defineStore} from 'pinia'
import Swal from 'sweetalert2';
import axios from '../plugins/axios.js';
import router from '../routers/routers.js'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("jwtToken") || null,
    username: localStorage.getItem("username") || null,
    roles: JSON.parse(localStorage.getItem("roles")) || [], 
  }),
  actions: {
    // 登入
    async login(loginData) {
      try {
        const response = await axios.post("/api/auth/login", {
          username: loginData.username,
          password: loginData.password,
        });
        if(response && response.status === 200){
          const token = response.data.token;
          const username = response.data.username;
          const roles = response.data.roles;
  
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("username", username);
          localStorage.setItem("roles", JSON.stringify(roles));
  
          this.token = token;
          this.username = username;
          this.roles = roles;
  
          Swal.fire("成功", "登入成功！", "success");
          router.push("/products"); 
        }
      } catch (error) {
        Swal.fire("錯誤", error.response.data.error, "warning").then(() => {
          router.push("/"); 
        });
      }
    },
    // 登出
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("username");
      localStorage.removeItem("roles");

      this.token = null;
      this.username = null;
      this.roles = [];

      Swal.fire("成功", "登出成功！", "success");
      router.push("/"); // 跳轉到登入頁
    },
  },
  getters: {
    // 判斷是否登入
    isLoggedIn: (state) => !!state.token, 
    // 判斷是否擁有某角色
    hasRole: (state) => (role) => state.roles.includes(role), 
  },
});
