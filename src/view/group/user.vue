<template>
  <div class="debugBox">
    <div class="tableBox">
      <table width="100%" cellspacing="0px">
        <tr>
          <th colspan="1">账号</th>
          <th colspan="1">用户</th>
        </tr>
        <tr v-for="(item, index) in tableData" :key="index">
          <td width="28%" align="center">{{ item["account"] }}</td>
          <td width="40%" align="center">{{ item["name"] }}</td>
          <td width="10%" align="center">
            <div>
              <van-icon
                name="edit"
                size="25"
                color="#2ca1cf"
                @click="updateUser(tableData[index])"
              />
            </div>
          </td>
          <td width="8%" align="center">
            <div>
              <van-icon
                name="award-o"
                size="25"
                color="#2ca1cf"
                @click="updateAuth(tableData[index], index)"
              />
            </div>
          </td>
          <td align="center">
            <div>
              <van-icon
                name="delete"
                size="25"
                color="#2ca1cf"
                @click="deleteUser(tableData[index])"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="add">
      <van-icon name="plus" size="25" color="#2ca1cf" @click="addUser" />
    </div>
  </div>

  <!-- 右侧弹出,添加用户 -->
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
            v-model="user.name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="user.account"
            name="账号"
            label="账号"
            placeholder="账号"
            :rules="[{ required: true, message: '账号不可修改' }]"
          />
          <van-field
            v-model="user.password"
            name="密码"
            label="密码"
            type="password"
            placeholder="密码"
            :rules="[{ required: false, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitAddUser"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </van-popup>

  <!-- 右侧弹出,修改用户 -->
  <van-popup
    v-model:show="showRightUpdateUser"
    closeable
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <div style="margin-top: 70%">
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="user.name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />

          <div style="margin: 16px; width: 20%">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              @click="updatePassword"
            >
              修改密码
            </van-button>
          </div>
          <div v-if="user.flag">
            <van-field
              v-model="user.password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: false, message: '请填写密码' }]"
            />
          </div>
        </van-cell-group>

        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitUpdateUser"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </van-popup>

  <!-- 右侧弹出,修改权限 -->
  <van-popup
    v-model:show="showRightAuth"
    closeable
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <div class="AuthGroup">
      <table width="100%" cellspacing="0px">
        <tr>
          <th>名称</th>
        </tr>
        <tr v-for="(item, index) in apiData" :key="index">
          <td width="50%" align="center">{{ item["name"] }}</td>
          <td width="30%" align="center">
            <div v-if="item.flag">
              <van-icon
                name="points"
                size="25"
                color="#2ca1cf"
                @click="reverAuth(index)"
              />
            </div>
            <div v-else>
              <van-icon
                name="points"
                size="25"
                color="#666"
                @click="reverAuth(index)"
              />
            </div>
          </td>
        </tr>
      </table>
      <div>
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          @click="onSubmitUpdateAuth"
        >
          确定修改
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance, ref, onMounted } from "vue";
import { showConfirmDialog } from "vant";
let app = getCurrentInstance();
let tableData = reactive<any>([]);
let apiData = reactive<any>([]);
let userAuthIdx = 0;
let showRight = ref(false);
let showRightAuth = ref(false);
let showRightUpdateUser = ref(false);
let user = reactive<any>({
  _id: "",
  name: "",
  account: "",
  password: "",
  flag: false,
  auth: [],
});

//获取用户
function getUser() {
  app?.appContext.config.globalProperties.$axios
    .get("http://127.0.0.1:7001/user/get")
    .then((res: any) => {
      tableData.length = 0;
      if (res.data.data.data !== null) {
        res.data.data.data.forEach((item: never) => {
          tableData.push(item);
        });
      }
    });
}

//获取api数据,并判断用户是否有此权限,flag
function getApiData(user: any) {
  app?.appContext.config.globalProperties.$axios
    .get("http://127.0.0.1:7001/api/get?pageSize=0")
    .then((res: any) => {
      apiData.length = 0;
      if (res.data.data.data !== null) {
        const data = res.data.data.data;
        let flag = false;
        for (let i = 0; i < data.length; i++) {
          flag = false;
          for (let j = 0; user.auth != null && j < user.auth.length; j++) {
            if (user.auth[j] == data[i]._id) {
              flag = true;
              break;
            }
          }

          apiData.push({
            _id: data[i]._id,
            name: data[i].name,
            flag: flag,
          });
        }
      }
    });
}

function clearUser(){
  user._id=""
  user.name=""
  user.account=""
  user.passowrd=""
}

//用户添加
function addUser() {
  clearUser()
  showRight.value = true;
}

function onSubmitAddUser() {
  const params = {
    name: user.name,
    account: user.account,
    password: user.password,
  };

  app?.appContext.config.globalProperties.$axios
    .post(`http://127.0.0.1:7001/user/create`, params)
    .then(() => {
      getUser();
      showRight.value = false;
    });
}

//删除用户
function deleteUser(item: any) {
  showConfirmDialog({
    message: "是否确认删除",
  })
    .then(() => {
      app?.appContext.config.globalProperties.$axios
        .delete(`http://127.0.0.1:7001/user/delete?id=${item._id}`)
        .then(() => {
          getUser();
        });
    })
    .catch(() => {});
}

//更新用户
function updateUser(item: any) {
  showRightUpdateUser.value = true;
  user._id = item._id;
  user.account = item.account;
  user.password = "";
  user.name = item.name;
}

//更新密码
function updatePassword() {
  if (!user.flag) {
    user.flag = true;
  } else {
    user.flag = false;
  }
}

//确认更新用户
function onSubmitUpdateUser() {
  app?.appContext.config.globalProperties.$axios
    .put(`http://127.0.0.1:7001/user/update?flag=${user.flag}`, user)
    .then(() => {
      getUser();
      showRightUpdateUser.value = false;
    });
}

//修改用户权限
function updateAuth(item: any, idx: number) {
  showRightAuth.value = true;
  userAuthIdx = idx; //记录修改是哪个用户的权限
  getApiData(item);
}

//修改权限
function reverAuth(idx: number) {
  if (apiData[idx].flag === true) {
    apiData[idx].flag = false;
  } else {
    apiData[idx].flag = true;
  }
}

//确认修改用户权限
function onSubmitUpdateAuth() {
  let user = tableData[userAuthIdx];

  //清空原有权限
  user.auth = [];
  for (let i = 0; i < apiData.length; i++) {
    if (apiData[i].flag === true) {
      user.auth.push(apiData[i]._id);
    }
  }

  app?.appContext.config.globalProperties.$axios
    .put(`http://127.0.0.1:7001/user/update`, user)
    .then(() => {
      showRightAuth.value = false;
    });
}

//添加用户权限

onMounted(() => {
  getUser();
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
.AuthGroup {
  height: 770px;
  padding-top: 10%;
  padding-left: 5%;
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