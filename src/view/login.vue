<template>
  <div class="login">
    <h1>Login</h1>
    <van-cell-group inset>
      <van-field
        v-model="user.account"
        label="账号"
        placeholder="请输入用户名"
        left-icon="user-circle-o"
      />
      <form>
        <van-field
          v-model="user.password"
          label="密码"
          :type="inputType"
          placeholder="请输入密码"
          left-icon="browsing-history-o"
          :right-icon="passwordIcon"
          @click-right-icon="showOrHidePassword"
          autocomplete="off"
        />
      </form>
    </van-cell-group>
    <div class="logRegBox">
      <van-button class="loginRegBtn" type="default" round @click="login"
        >登录</van-button
      >
    </div>
  </div>
  <!-- 右侧弹出 -->
  <van-popup
    v-model:show="showRight"
    closeable
    position="right"
    close-icon-position="top-left"
    close-icon="arrow-left"
    style="padding-top: 250px"
    :style="{ width: '100%', height: '100%' }"
    ><van-cell-group inset>
      <van-field
        v-model="user.account"
        label="账号"
        placeholder="请输入用户名"
      />
      <form>
        <van-field
          v-model="user.password"
          label="密码"
          :type="inputType"
          placeholder="请输入密码"
          @click-right-icon="showOrHidePassword"
          autocomplete="off"
        />
        <van-field
          v-model="user.password"
          label="确认密码"
          :type="inputType"
          placeholder="请再次输入密码"
          @click-right-icon="showOrHidePassword"
          autocomplete="off"
        />
      </form>
    </van-cell-group>
    <div class="registerBox">
      <van-button class="loginRegBtn" type="default" round>确定</van-button>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from "vue";
import { FieldType,showNotify } from "vant";
import { useRouter } from "vue-router";
let app = getCurrentInstance();
let user = reactive({
  account: "",
  password: "",
});
let passwordIcon = ref("closed-eye");
let inputType = ref<FieldType>("password");
let showRight = ref(false);
function showOrHidePassword() {
  if (passwordIcon.value === "closed-eye") {
    passwordIcon.value = "eye-o";
    inputType.value = "text";
  } else {
    passwordIcon.value = "closed-eye";
    inputType.value = "password";
  }
}
let router = useRouter();
function login() {
  const params = {
    account: user.account,
    password: user.password,
  };

  app?.appContext.config.globalProperties.$axios
    .post(`http://127.0.0.1:7001/login`, params)
    .then((res: any) => {
      if (res.data.code === 200) {
        localStorage.setItem("token",res.data.data.token)
        router.push("/group");
      }else{
        showNotify({ type: 'primary', message: '账号或密码错误！' })
      }
    });
}


</script>

<style scoped>
.login {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 60%;
  box-sizing: border-box;
  flex-direction: column;
  color: rgb(83, 82, 82);
}

.logRegBox {
  height: 80px;
  display: flex;
  align-items: flex-end;
  margin-left: 75px;
}

.registerBox {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.loginRegBtn {
  width: 150px;
  right: 36px;
}
</style>