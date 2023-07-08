<template>
  <div class="debugBox">
    <div class="tableBox">
      <table width="100%" cellspacing="0px">
        <tr>
          <th colspan="1">名称</th>
          <th colspan="1">接口</th>
        </tr>
        <tr v-for="(item, index) in tableData" :key="index">
          <td width="25%" align="center">{{ item["name"] }}</td>
          <td width="50%" align="center">{{ item["path"] }}</td>
          <td width="25%" align="center">
            <div>
              <van-icon
                name="edit"
                size="25"
                color="#2ca1cf"
                @click="updateApi(tableData[index])"
              />
            </div>
          </td>
          <td width="25%" align="center">
            <div>
              <van-icon
                name="delete"
                size="25"
                color="#2ca1cf"
                @click="deleteApi(tableData[index])"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="add">
      <van-icon name="plus" size="25" color="#2ca1cf" @click="addApi" />
    </div>
  </div>
  <!-- 右侧弹出,添加 -->
  <!-- 下拉框 -->
  <van-popup v-model:show="showPicker" round position="bottom">
    <div>
      <van-picker
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </div>
  </van-popup>
  <van-popup
    v-model:show="showRight"
    closeable
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <div style="margin-top: 70%">
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="api.name"
            name="接口名称"
            label="接口名称"
            placeholder="接口名称"
            :rules="[{ required: true, message: '请填写接口名称' }]"
          />
          <van-field
            v-model="api.path"
            name="接口路径"
            label="接口路径"
            placeholder="接口路径"
            :rules="[{ required: true, message: '请填写接口路径' }]"
          />
          <van-field
            v-model="api.method"
            name="接口方法"
            label="接口方法"
            @click="showPicker = true"
            placeholder="接口方法"
            :rules="[{ required: true, message: '请填写接口方法' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitAddApi"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </van-popup>

  <!-- 右侧弹出,修改 -->
  <van-popup
    v-model:show="showRightUpdate"
    closeable
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <div style="margin-top: 70%">
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="api.name"
            name="接口名称"
            label="接口名称"
            placeholder="接口名称"
            :rules="[{ required: true, message: '请填写接口名称' }]"
          />
          <van-field
            v-model="api.path"
            name="接口路径"
            label="接口路径"
            placeholder="接口路径"
            :rules="[{ required: true, message: '请填写接口路径' }]"
          />
          <van-field
            v-model="api.method"
            name="接口方法"
            label="接口方法"
            @click="showPicker = true"
            placeholder="接口方法"
            :rules="[{ required: true, message: '请填写接口方法' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitUpdateApi"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance, ref, onMounted } from "vue";
import { showConfirmDialog } from "vant";
let app = getCurrentInstance();
let tableData = reactive([]);
let api = reactive({ _id: "", name: "", path: "", method: "" });
let showRight = ref(false);
let showRightUpdate = ref(false);
const columns = ref([
  { text: "GET", value: "GET" },
  { text: "POST", value: "POST" },
  { text: "PUT", value: "PUT" },
  { text: "DELETE", value: "DELETE" },
]);
const showPicker = ref(false);

//选择器
const onConfirm = ({ selectedOptions }: { selectedOptions: any }) => {
  showPicker.value = false;
  api.method = selectedOptions[0].text;
};

//获取api数据
function getApiData() {
  app?.appContext.config.globalProperties.$axios
    .get("http://127.0.0.1:7001/api/get?pageSize=0")
    .then((res: any) => {
      tableData.length = 0;
      if (res.data.data.data !== null) {
        res.data.data.data.forEach((item: never) => {
          tableData.push(item);
        });
      }
    });
}

//api添加
function addApi() {
  clearApi();
  showRight.value = true;
}

//确认添加
function onSubmitAddApi() {
  const params = {
    name: api.name,
    path: api.path,
    method: api.method,
  };

  app?.appContext.config.globalProperties.$axios
    .post(`http://127.0.0.1:7001/api/create`, params)
    .then(() => {
      clearApi();
      getApiData();
      showRight.value = false;
    });
}

//初始化Api
function clearApi() {
  api._id = "";
  api.name = "";
  api.path = "";
  api.method = "";
}

//删除api
function deleteApi(item: any) {
  showConfirmDialog({
    message: "是否确认删除",
  })
    .then(() => {
      app?.appContext.config.globalProperties.$axios
        .delete(`http://127.0.0.1:7001/api/delete`, {
          params: {
            id: item._id,
          },
        })
        .then(() => {
          getApiData();
        });
    })
    .catch(() => {});
}

//更新api
function updateApi(item: any) {
  api._id = item._id;
  api.name = item.name;
  api.path = item.path;
  api.method = item.method;
  showRightUpdate.value = true;
}

//确定更新
function onSubmitUpdateApi() {

  app?.appContext.config.globalProperties.$axios
    .put(`http://127.0.0.1:7001/api/update`, api)
    .then(() => {
      clearApi();
      getApiData();
      showRightUpdate.value = false;
    });
}

onMounted(() => {
  getApiData();
});
</script>

<style scoped>
.debugBox {
  padding-top: 5%;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: center;
}

.tableBox {
  height: 770px;
  width: 100%;
  padding: 0 5%;
  overflow-y: scroll;
}

th {
  padding-bottom: 10px;
  border-bottom: 1px solid #2ca1cf;
  color: rgb(230, 227, 227);
  position: sticky;
  top: 0;
  background-color: #1c1c1e;
}

td {
  padding: 10px 0 10px 0;
  color: rgb(218, 217, 217);
  font-size: 13px;
}
.add {
  position: absolute;
  top: 18px;
  left: 340px;
}
</style>