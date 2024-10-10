<template>
    <div class="common-layout">
        <el-container>
            <el-main>
                <el-form
                        label-position="left"
                        label-width="150px"
                        :model="formData"
                        style="min-width: 600px"
                >
                    <el-form-item label="excel位置">
                        <el-input v-model="formData.excelPath" class="w-50 m-2"></el-input>
                    </el-form-item>
                    <el-form-item label="客户端数据位置">
                        <el-input v-model="formData.clientData" class="w-50 m-2"></el-input>
                    </el-form-item>
                    <el-form-item label="客户端代码位置">
                        <el-input v-model="formData.clientCode" class="w-50 m-2"></el-input>
                    </el-form-item>
                    <el-form-item label="服务端数据位置">
                        <el-input v-model="formData.serverData" class="w-50 m-2"></el-input>
                    </el-form-item>
                    <el-form-item label="服务端代码位置">
                        <el-input v-model="formData.serverCode" class="w-50 m-2"></el-input>
                    </el-form-item>
                </el-form>

            </el-main>
            <el-footer>
                <el-button @click="saveConfig">保存配置</el-button>
                <el-button @click="goHome">返回</el-button>
            </el-footer>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {PageEnum} from "@/enums/pageEnum";
import {onMounted, reactive, ref, toRaw} from "vue";
import {ElMessage} from "element-plus";
import {excelPathConfig, IExcelPathConfig, loadExcelPathConfig, saveConfigData} from "@/views/excel/data";

const formData = reactive<IExcelPathConfig>({
    excelPath: "", //excel位置
    clientData: '', //客户端数据位置
    clientCode: '', //客户端代码位置
    serverData: '', //服务端数据位置
    serverCode: '', //服务端代码位置
})

const router = useRouter()

const saveConfig = async ()=>{
    let result = await saveConfigData(excelPathConfig,toRaw(formData));
    ElMessage(result);
}
const getConfig = ()=>{
    loadExcelPathConfig().then(data=>{
        Object.assign(formData, data)
    })
}
onMounted(()=>{
    getConfig();
})
function goHome() {
    router.push(PageEnum.Excel);
}
</script>

<style>
.el-form-item__label {
    color: white;
}
</style>