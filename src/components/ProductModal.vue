<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ localProduct.productId ? "修改產品" : "新增產品" }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="productName" class="form-label">產品名稱:</label>
              <input type="text" v-model="localProduct.productName" id="productName" class="form-control" required/>
            </div>
            <div class="mb-3">
              <label for="productDescription" class="form-label">產品描述:</label>
              <textarea v-model="localProduct.productDescription" id="productDescription" class="form-control" ></textarea>
            </div>
            <div class="mb-3">
              <label for="price" class="form-label">價格:</label>
              <input v-model="localProduct.price" type="number" id="price" step="0.01" class="form-control" required/>
            </div>
            <div class="mb-3">
              <label for="quantity" class="form-label">庫存數量:</label>
              <input v-model="localProduct.quantity" type="number" id="quantity" class="form-control" required/>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
          <button type="button" class="btn btn-primary" @click="submitForm">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import Swal from "sweetalert2";
import { reactive, defineExpose } from "vue";

defineProps({
  visible: Boolean,
  product: Object,
});

const emit = defineEmits(["submit", "close"]);

const localProduct = reactive({
  productId: null,
  productName: "",
  productDescription: "",
  price: null,
  quantity: null,
});

const setProduct = (product) => {
  if (product) {
    Object.assign(localProduct, product);
  } else {
    Object.assign(localProduct, {
      productId: null,
      productName: "",
      productDescription: "",
      price: null,
      quantity: null,
    });
  }
};

// 表單提交
const submitForm = async () => {
  const confirm = await Swal.fire({
    title: "確認提交？",
    text: localProduct.productId ? "確定要修改產品資料？" : "確定要新增產品？",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "是",
    cancelButtonText: "否",
  });

  if (confirm.isConfirmed) {
    emit("submit", { ...localProduct });
    closeModal();
  }
};

// 關閉模態框
const closeModal = () => {
  emit("close");
  resetForm();
};

// 重置表單數據
const resetForm = () => {
  localProduct.productId = null;
  localProduct.productName = "";
  localProduct.productDescription = "";
  localProduct.price = null;
  localProduct.quantity = null;
};

defineExpose({
  setProduct,
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

button {
  margin: 10px;
}
</style>
