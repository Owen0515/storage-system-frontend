<template>
  <div class="container-expand"> 
    <h1>產品列表</h1>
    <!-- 查詢條件表單 -->
    <form @submit.prevent="fetchProducts">
      <div class="mb-3">
        <label for="productName" class="form-label">產品名稱:</label>
        <input v-model="filters.productName" type="text" id="productName" placeholder="輸入產品名稱" class="form-control">
      </div>
      <div class="row g-3">
        <div class="col">
          <label for="minPrice">最低價格:</label>
          <input v-model="filters.minPrice" type="number" id="minPrice" step="0.1" class="form-control">
        </div>
        <div class="col">
          <label for="maxPrice">最高價格:</label>
          <input v-model="filters.maxPrice" type="number" id="maxPrice" step="0.1" class="form-control">
        </div>
      </div>
      <div class="row g-3">
        <div class="col">
          <label for="minQuantity">最低數量:</label>
          <input v-model="filters.minQuantity" type="number" id="minQuantity" class="form-control">
        </div>
        <div class="col">
          <label for="maxQuantity">最高數量:</label>
          <input v-model="filters.maxQuantity" type="number" id="maxQuantity" class="form-control">
        </div>
      </div>
      <div class="flex-box">
        <div class="col-md-2">
          <label for="deleted" class="form-label">是否已刪除:</label>
          <select v-model="filters.deleted" id="deleted" class="form-select">
            <option :value="null">全部</option>
            <option :value="true">已刪除</option>
            <option :value="false">未刪除</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-expand">查詢</button>
        <button v-if="authStore.hasRole('admin')" @click="openCreateModal" class="btn btn-primary btn-expand">新增</button>
      </div>
    </form>

    <!-- 產品列表 -->
    <div v-if="loading">載入中...</div>
    <!-- 產品表格 -->
    <div v-if="loading">載入中...</div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>產品名稱</th>
            <th>描述</th>
            <th>價格</th>
            <th>庫存</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products.content" :key="product.productId">
            <td>{{ product.productId }}</td>

            <td class="text-truncate" style="max-width: 150px;">{{ product.productName }}</td>
            <td class="text-truncate" style="max-width: 200px;">{{ product.productDescription }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.quantity }}</td>
            <td class="button-container">
              <span v-if="!product.deleted">
                <button v-if="authStore.hasRole('admin') || authStore.hasRole('warehouseManager')" type="button" class="btn btn-primary" @click="updateQuantity(product.productId, 'DECREASE')">出庫</button>
                <button v-if="authStore.hasRole('admin') || authStore.hasRole('warehouseManager')" type="button" class="btn btn-primary" @click="updateQuantity(product.productId, 'INCREASE')">入庫</button>
                <button v-if="authStore.hasRole('admin')" type="button" class="btn btn-warning" @click="openEditModal(product)">編輯</button>
                <button v-if="authStore.hasRole('admin')" type="button" class="btn btn-danger" @click="deleteProduct(product.productId)">刪除</button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 分頁 -->
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center" >
          <li class="page-item" :class="{ disabled: filters.page === 0 }">
            <a class="page-link" href="#" @click.prevent="changePage(filters.page - 1)" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: filters.page === page - 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(page - 1)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: filters.page === totalPages - 1 }">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(filters.page + 1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <ProductModal :visible="showModal" ref="productModal" @submit="handleSubmit" @close="closeModal" />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from '../plugins/axios';
import Swal from "sweetalert2";
import ProductModal from '../components/ProductModal.vue'
import { useAuthStore } from "../stores/auth.js";

const authStore = useAuthStore();

const products = ref([]);
const loading = ref(true);
const showModal = ref(false);
const productModal = ref(null);
const totalPages = ref(0);

// 查詢條件
const filters = ref({
  productName: '',
  minPrice: null,
  maxPrice: null,
  minQuantity: null,
  maxQuantity: null,
  deleted: false, 
  page: 0,
  size: 10,
});

// 查詢產品
const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/products', {
      params: {
        productName: filters.value.productName || null,
        minPrice: filters.value.minPrice || null,
        maxPrice: filters.value.maxPrice || null,
        minQuantity: filters.value.minQuantity || null,
        maxQuantity: filters.value.maxQuantity || null,
        deleted: filters.value.deleted,
        page: filters.value.page,
        size: filters.value.size,
      },
    });
    products.value = response.data
    totalPages.value = products.value.totalPages;
  } catch (error) {
    if(error?.response?.status === 400 ){
      Swal.fire("錯誤", "查詢失敗", "error");
    }
  } finally {
    loading.value = false;
  }
};

// 切換頁面
const changePage = (newPage) => {
  if (newPage < 0 || newPage >= totalPages.value) return; // 防止越界
  filters.value.page = newPage;
  fetchProducts(); 
};

const updateQuantity = async (productId, operationType) => {
  const { value: quantity } = await Swal.fire({
    title: `請輸入要${operationType === "DECREASE" ? "出庫" : "入庫"}的數量`,
    input: "number",
    inputLabel: "數量 :   ",
    inputPlaceholder: "請輸入數量",
    inputAttributes: {
      min: "1", 
    },
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    preConfirm: (inputValue) => {
      if (!inputValue || inputValue <= 0) {
        Swal.showValidationMessage("請輸入大於 0 的有效數量！");
      }
      return inputValue;
    },
  });

  // 數量有效
  if (quantity) {
    try {
        await axios.put(`api/products/${productId}/quantity`, null, {
        params: {
          operationType,
          quantity,
        },
      });
      Swal.fire("操作成功", `${operationType === "DECREASE" ? "出庫" : "入庫"}成功！`, "success");
      fetchProducts(); 
    } catch (error) {
      Swal.fire("操作失敗", error.response?.data.error || "請求失敗，請重試", "error");
    }
  }
};

// 刪除產品
const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`/api/products/${productId}`);
    if (response.status === 204) {
      Swal.fire("成功", "產品已成功刪除！", "success");
      fetchProducts(); 
    } else {
      Swal.fire("錯誤", "未能成功刪除產品，請稍後重試！", "error");
    }
  } catch (error) {
    Swal.fire("錯誤", error.response.data?.message || "刪除產品失敗", "error");
  }
};

// 打開新增模態框
const openCreateModal = () => {
  showModal.value = true;
};

// 打開編輯模態框
const openEditModal = (product) => {
  productModal.value.setProduct(product);
  showModal.value = true; // 打開模態框
};

// 關閉模態框
const closeModal = () => {
  showModal.value = false;
};

// 表單提交
const handleSubmit = async (submittedProduct) => {
  try {
    if (submittedProduct.productId) {   //編輯
      const response = await axios.put(`/api/products/${submittedProduct.productId}/admin`, submittedProduct);
      if(response && response.status === 200 && response.data){
        Swal.fire("成功","產品修改成功！", "success");
      }
    } else {   //新增
      const response = await axios.post('/api/products',submittedProduct );
      if(response && response.status === 201 && response.data){
        Swal.fire("成功", "產品新增成功！", "success");
      }
    }
    fetchProducts(); 
    showModal.value = false; 
  } catch (error) {
    Swal.fire("錯誤", "操作失敗", "error");
  }
};

// 初次加載時調用
onMounted(fetchProducts);
</script>


<style scoped>
.container-expand{
  margin: auto;
  width: 800px;
  align-items: center;
  
}
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.flex-box{
  display: flex;
}
.btn-expand{
  margin: auto 0px 0px 10px;
}
.button-container button{
  margin-left: 5px;
}
</style>
