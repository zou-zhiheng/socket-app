<template>
    <div class="deviceBox">
        <div class="tableBox">
            <table width="100%" cellspacing="0px">
                <tr>
                    <th colspan="1">时间</th>
                    <th colspan="3">payload</th>
                </tr>
                <tr v-for="(item, index) in tableData" :key="index">
                    <td width="25%" align="center">{{ item["createTime"] }}</td>
                    <td width="75%" align="center">{{ item["data"] }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance } from 'vue';
let app = getCurrentInstance();
let tableData = reactive([]);

(function () {
    app?.appContext.config.globalProperties.$axios.get('http://127.0.0.1:7001/device/get').then((res: any) => {
        res.data.data.data.forEach((item: never) => {
            tableData.push(item)
        })
    })
})()
</script>

<style scoped>
.deviceBox {
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
    border-bottom: 1px solid rgb(44, 161, 207);
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
</style>