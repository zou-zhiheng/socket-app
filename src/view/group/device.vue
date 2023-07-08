<template>
  <div class="debugBox">
    <div class="tableBox">
      <table width="100%" cellspacing="0px">
        <tr>
          <th colspan="1">编号</th>
          <th colspan="1">端口</th>
        </tr>
        <tr v-for="(item, index) in tableData" :key="index">
          <td width="25%" align="center">{{ item["code"] }}</td>
          <td width="50%" align="center">{{ item["port"] }}</td>
          <td width="10%" align="center">
            <div v-if="item.isListen">
              <van-icon
                name="hot-o"
                size="25"
                color="#2ca1cf"
                @click="onDevice(tableData[index])"
              />
            </div>
            <div v-else>
              <van-icon
                name="hot-o"
                size="25"
                color="#666"
                @click="onDevice(tableData[index])"
              />
            </div>
          </td>
          <td width="15%" align="center">
            <div>
              <van-icon
                name="edit"
                size="25"
                color="#2ca1cf"
                @click="updateDevice(tableData[index])"
              />
            </div>
          </td>
          <td width="30%" align="center">
            <div>
              <van-icon
                name="delete"
                size="25"
                color="#2ca1cf"
                @click="deleteDevice(tableData[index])"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="add">
      <van-icon name="plus" size="25" color="#2ca1cf" @click="addDevice" />
    </div>
  </div>
  <!-- 右侧弹出,添加 -->
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
            v-model="device.code"
            name="设备编号"
            label="设备编号"
            placeholder="设备编号"
            :rules="[{ required: true, message: '请填写设备编号' }]"
          />
          <van-field
            v-model="device.addr"
            name="监听地址"
            label="监听地址"
            placeholder="监听地址"
            :rules="[{ required: true, message: '请填写监听地址' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitAddDevice"
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
            v-model="device.code"
            name="设备编号"
            label="设备编号"
            placeholder="设备编号"
            :rules="[{ required: true, message: '请填写设备编号' }]"
          />
          <van-field
            v-model="device.addr"
            name="监听地址"
            label="监听地址"
            placeholder="监听地址"
            :rules="[{ required: true, message: '请填写监听地址' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitUpdateDevice"
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
let app = getCurrentInstance();
let tableData = reactive<any>([]);
let device = reactive({ _id: "", code: "", addr: "", port: "" });
let showRight = ref(false);
let showRightUpdate = ref(false);

//获取设备数据
function getDeviceData() {
  app?.appContext.config.globalProperties.$axios
    .get("http://127.0.0.1:7001/device/get?flag=false")
    .then((res: any) => {
      tableData.length = 0;
      if (res.data.data.data !== null) {
        res.data.data.data.forEach((item: never) => {
          tableData.push(item);
        });
      }
    });
}



//设备添加
function addDevice() {
  clearDevice()
  showRight.value = true;
}

//确认添加
function onSubmitAddDevice() {
  const params = {
    code: device.code,
    addr: device.addr,
  };

  app?.appContext.config.globalProperties.$axios
    .post(`http://127.0.0.1:7001/device/create`, params)
    .then(() => {
      clearDevice();
      getDeviceData();
      showRight.value = false;
    });
}

//初始化device
function clearDevice() {
  device.code = "";
  device.addr = "";
}

//删除设备
function deleteDevice(item: any) {
  app?.appContext.config.globalProperties.$axios
    .delete(`http://127.0.0.1:7001/device/delete`, {
      params: {
        id: item._id,
      },
    })
    .then(() => {
      getDeviceData();
    });
}

//更新设备
function updateDevice(item: any) {
  device._id = item._id;
  device.code = item.code;
  device.addr = item.addr;
  showRightUpdate.value = true;
}

//确定更新
function onSubmitUpdateDevice() {
  const params = {
    _id: device._id,
    code: device.code,
    addr: device.addr,
  };

  app?.appContext.config.globalProperties.$axios
    .put(`http://127.0.0.1:7001/device/update`, params)
    .then(() => {
      clearDevice();
      getDeviceData();
      showRightUpdate.value = false;
    });
}

//监听或关闭监听
function onDevice(item: any) {
  if (item.isListen===true){
    item.isListen=false
  }else{
    item.isListen=true
  }
  app?.appContext.config.globalProperties.$axios
    .get(`http://127.0.0.1:7001/device/signal?port=${item.port}&signal=${item.isListen}`)
    .then(() => {
      getDeviceData();
    });
}

onMounted(() => {
  getDeviceData();
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