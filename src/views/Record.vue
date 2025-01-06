<template>
  <div class="container-expand">
    <h1>紀錄查詢</h1>
    <!-- 查詢條件表單 -->
    <form @submit.prevent="fetchRecords">
      <div class="row g-3">
        <div class="col">
          <label for="productId" class="form-label">產品 ID:</label>
          <input v-model="filters.productId" type="number" id="productId" placeholder="輸入產品 ID" class="form-control">
        </div>
        <div class="col">
          <label for="operationType" class="form-label">操作類型:</label>
          <select v-model="filters.operationType" id="operationType" class="form-select">
            <option value="">全部</option>
            <option value="CREATE">新增</option>
            <option value="INCREASE">入庫</option>
            <option value="DECREASE">出庫</option>
            <option value="DELETE">刪除</option>
          </select>
        </div>
      </div>
      <div class="row g-3">
        <div class="col">
          <label for="operator" class="form-label">操作者:</label>
          <input v-model="filters.operator" type="text" id="operator" placeholder="輸入操作者" class="form-control">
        </div>
        <div class="col">
          <label for="startTime" class="form-label">起始時間:</label>
          <input v-model="filters.startTime" type="datetime-local" id="startTime" class="form-control">
        </div>
        <div class="col">
          <label for="endTime" class="form-label">結束時間:</label>
          <input v-model="filters.endTime" type="datetime-local" id="endTime" class="form-control">
        </div>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <button type="submit" class="btn btn-primary">查詢</button>
      </div>
    </form>

    <!-- 紀錄列表 -->
    <div v-if="loading">載入中...</div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>產品 ID</th>
            <th>操作類型</th>
            <th>數量</th>
            <th>操作時間</th>
            <th>操作者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records.content" :key="record.recordId">
            <td>{{ record.recordId }}</td>
            <td>{{ record.product?.productId }}</td>
            <td>{{ operationTypeMap[record.operationType] || "未知" }}</td>
            <td>{{ record.quantity }}</td>
            <td>{{ formatTime(record.operationTime)}}</td>
            <td>{{ record.operator }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 分頁 -->
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: filters.page === 0 }">
            <a class="page-link" href="#" @click.prevent="changePage(filters.page - 1)">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: filters.page === page-1 }">
            <a class="page-link" href="#" @click.prevent="changePage(page - 1)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: filters.page === totalPages - 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(filters.page + 1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../plugins/axios";
import Swal from "sweetalert2";
import { formatTime } from '../utils/dateUtil.js'

const records = ref([]);
const loading = ref(true);
const totalPages = ref(0);

// 查詢條件
const filters = ref({
  productId: null,
  operationType: "",
  operator: "",
  startTime: null,
  endTime: null,
  page: 0,
  size: 10,
});

// 操作映射
const operationTypeMap = {
  CREATE: "新增",
  UPDATE:"更新",
  INCREASE: "入庫",
  DECREASE: "出庫",
  DELETE: "刪除",
};

// 查詢紀錄的函數
const fetchRecords = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/api/records", {
      params: {
        productId: filters.value.productId || null,
        operationType: filters.value.operationType || null,
        operator: filters.value.operator || null,
        startTime: filters.value.startTime || null,
        endTime: filters.value.endTime || null,
        page: filters.value.page,
        size: filters.value.size,
      },
    });
    records.value = response.data;
    totalPages.value = records.value.totalPages;
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
  if (newPage < 0 || newPage >= totalPages.value) return;
  filters.value.page = newPage;
  fetchRecords();
};

onMounted(fetchRecords);
</script>

<style scoped>
.container-expand {
  margin: auto;
  width: 800px;
  align-items: center;
}

.flex-box {
  display: flex;
}

.table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
}
</style>
