<template>
    <div>
        <span class="ml-3 w-35 text-gray-600 inline-flex items-center">表格名称</span>
        <el-input
                v-model="itemData.excelName"
                class="w-50 m-2"
                placeholder="Pick a date"
        />
        <span class="ml-3 w-35 text-gray-600 inline-flex items-center">客户端名称</span>
        <el-input
                v-model="itemData.clientName"
                class="w-50 m-2"
                placeholder="Pick a date"
        />
        <el-switch
                v-model="itemData.clientCode"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="代码"
        />
        <el-switch
                v-model="itemData.clientCode"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="数据"
        />
        <span class="ml-3 w-35 text-gray-600 inline-flex items-center">服务端名称</span>
        <el-input
                v-model="itemData.serverName"
                class="w-50 m-2"
                placeholder="Pick a date"
        />
        <el-switch
                v-model="itemData.serverData"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="代码"
        />
        <el-switch
                v-model="itemData.serverCode"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="数据"
        />
    </div>
</template>

<script setup lang="ts">
const itemData = withDefaults(defineProps<{
    excelName: string,
    clientName: string,
    clientCode: boolean,
    clientData: boolean,
    serverName: string,
    serverCode: boolean,
    serverData: boolean,
}>(), {
    excelName: "",
    clientName: "",
    clientCode: false,
    clientData: false,
    serverName: "",
    serverCode: false,
    serverData: false,
});
</script>

<style scoped>

</style>