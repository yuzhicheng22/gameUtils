<script lang="ts" setup>
import {h, reactive} from 'vue'
import {ReadDir, ReadFile, WriteFile} from '@w/go/main/App'
import {useRouter} from "vue-router";
import {PageEnum} from "@/enums/pageEnum";
import dayjs from 'dayjs';

const data = reactive({
    name: "",
    resultText: "打开文件",
})
const router = useRouter();

function openFile(){
    ReadFile(data.name).then(res=>{
        data.resultText = res;
    })
}
function goExcelParse(){
    router.push(PageEnum.Excel);
}

function goStoryEdit(){
    router.push(PageEnum.StoryEdit);
}

function goZhiHu(){
    ReadDir(data.name).then(res=>{
      res.forEach(fileInfo=>{
        let date = Date.parse(fileInfo.Modtime);
        console.log(dayjs(date).locale("zh-cn").format("YY-MM-DD HH:mm:ss"));
      })
    }).catch(e=>{
      console.log(e);
    })
}

</script>

<template>
    <main>
        <div id="result" class="result text-white">{{ data.resultText }}</div>
        <div id="input" class="input-box">
<!--            <el-input v-model="data.name"></el-input>-->
            <el-button type="primary" @click="goExcelParse">进入表格解析</el-button>
            <el-button type="primary" @click="goStoryEdit">进入剧情编辑</el-button>
<!--            <el-button type="primary" @click="goZhiHu">测试连接</el-button>-->
        </div>
<!--        <iframe-->
<!--            id="bdIframe"-->
<!--            ref="iframe"-->
<!--            frameborder="0"-->
<!--            style="width:100%;height:100%;"-->
<!--            src="https://embed.diagrams.net/?embed=1&spin=1&modified=unsavedChanges&proto=json"-->
<!--        ></iframe>-->
    </main>
</template>

<style scoped>
.result {
    height: 20px;
    line-height: 20px;
    margin: 1.5rem auto;
}

.input-box .btn {
    width: 60px;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    border: none;
    margin: 0 0 0 20px;
    padding: 0 8px;
    cursor: pointer;
}

.input-box .btn:hover {
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
    color: #333333;
}

.input-box .input {
    border: none;
    border-radius: 3px;
    outline: none;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background-color: rgba(240, 240, 240, 1);
    -webkit-font-smoothing: antialiased;
}

.input-box .input:hover {
    border: none;
    background-color: rgba(255, 255, 255, 1);
}

.input-box .input:focus {
    border: none;
    background-color: rgba(255, 255, 255, 1);
}
</style>
