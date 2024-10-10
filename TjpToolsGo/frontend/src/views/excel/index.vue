<template>
  <div class="common-layout page-excel-index">
    <el-container>
      <el-header class="fix-header">
        <ul>
          <li>
            <el-text class="ml-3 w-35 text-white inline-flex items-center" style="--el-text-color:#fff">搜索</el-text>
            <el-input class="w-15 m-2" v-model="selectText"></el-input>
            <el-text class="w-15 m-2 text-white inline-flex items-center" style="--el-text-color:#fff">上次记录时间 {{lastParseDateText}}</el-text>
            <el-button @click="genCodeByLastTime">生成最新表格</el-button>
          </li>
        </ul>
      </el-header>
      <el-main style="--el-main-padding:10px 2px 10px 2px ; position: absolute; top: 50px; bottom: 50px; width: 100%;">
        <ul>
          <li v-for="itemData in filterDataList">
            <el-text class="ml-3 w-35 text-white inline-flex items-center" style="--el-text-color:#fff">表格名称
            </el-text>
            <el-input
                v-model="itemData.excelName"
                class="w-15 m-2"
                placeholder="请输入excel表格名称"
            />
            <el-text class="ml-3 w-35 text-white inline-flex items-center" style="--el-text-color:#fff">客户端名称
            </el-text>
            <el-input
                v-model="itemData.clientName"
                class="w-15 m-2"
                placeholder="请输入生成的文件名称"
            />
            <el-switch
                v-model="itemData.clientCode"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="代码"
                inactive-text="代码"
            />
            <el-switch
                v-model="itemData.clientData"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="数据"
                inactive-text="数据"
            />
            <el-text class="ml-3 w-35 text-white inline-flex items-center" style="--el-text-color:#fff">服务端名称
            </el-text>
            <el-input
                v-model="itemData.serverName"
                class="w-15 m-2"
                placeholder="请输入生成的文件名称"
            />
            <el-switch
                v-model="itemData.serverCode"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="代码"
                inactive-text="代码"
            />
            <el-switch
                v-model="itemData.serverData"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="数据"
                inactive-text="数据"
            />
            <el-button @click="genItemCode(itemData)">生成</el-button>
            <el-button @click="removeItemData(itemData)">删除</el-button>
            <el-button @click="openItemFile(itemData)">打开</el-button>
          </li>
        </ul>
      </el-main>
      <el-footer class="fix-bottom">
        <el-button @click="addItem">添加表格</el-button>
        <el-button @click="genCode">生成数据</el-button>
        <el-button @click="goConfig">修改路径</el-button>
        <el-button @click="saveConfig">保存配置</el-button>
        <el-button @click="orderChangeHandle">{{ orderType == 0 ? "文字排序" : "时间排序" }}</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {PageEnum} from "@/enums/pageEnum";
import {computed, onMounted, ref, toRaw, watch} from "vue";
import {IExcelItemConfig, openExcelFileHandler, saveConfigData} from "@/views/excel/data";
import {ReadDir, ReadFile, SplitFile, StartFile} from "@w/go/main/App";
import {ElMessage, ElNotification} from "element-plus";
import excelParser from "@/excelParser/ExcelParser";
import dayjs from "dayjs";
// import ExcelItemConfig from "@/components/ExcelItemConfig.vue";

let curDayTime = dayjs();
const lastParseTime = ref<number>(Date.now());
const lastParseDateText = computed(()=>{
  return dayjs(lastParseTime.value).format('HH:mm:ss')
})


const orderType = ref<number>(1);
const selectText = ref<string>("");
const itemDataList = ref<IExcelItemConfig[]>([])
const filterDataList = ref<IExcelItemConfig[]>([])

const filterDataGen = async () => {
  let itemValue = toRaw(itemDataList.value);
  // console.log(itemValue)
  if (toRaw(orderType.value) == 0) {
    // console.log(JSON.stringify(toRaw(itemValue)));
    itemValue.sort((ele1, ele2) => ele1.excelName.localeCompare(ele2.excelName));
    // console.log(JSON.stringify(toRaw(itemValue)));
    // filterDataList.value = itemValue;

  } else {
    itemValue = await loadItemEditTime(itemValue);
    itemValue = itemValue.sort((item1, item2) => item2.modTime - item1.modTime);
    // if (!excelParser.pathConfig) {
    //   await excelParser.loadPathConfig();
    // }
    // let excelPath = excelParser.pathConfig?.excelPath;
    // if (!excelPath) {
    //   ElNotification({
    //     title: 'Prompt',
    //     message: "请配置execl表格地址",
    //     duration: 2000,
    //   })
    //   return
    // }
    //
    //
    // try {
    //   let fileInfos = await ReadDir(excelPath);
    //   let fileInfoMap: { [key: string]: number } = {};
    //   fileInfos.forEach(ele => {
    //     fileInfoMap[ele.Name] = Date.parse(ele.Modtime);
    //   })
    //   console.log(fileInfoMap);
    //   let dateTime = 0;
    //   for (let itemExcel of itemValue) {
    //     let curTime = fileInfoMap[itemExcel.excelName];
    //     if (curTime) {
    //       itemExcel.modTime = curTime;
    //     } else {
    //       itemExcel.modTime = dateTime;
    //     }
    //   }
    //   itemValue = itemValue.sort((item1, item2) => item2.modTime - item1.modTime);
    // } catch (e) {
    //   console.log(e)
    // }
    // console.log(excelParser.pathConfig?.excelPath+`\\`+item.excelName);

  }
    console.log(itemValue)
  let filterName = selectText.value.toLowerCase();
  filterDataList.value = itemValue.filter(ele => {
    return ele.excelName.toLowerCase().indexOf(filterName) >= 0;
  });
}
watch(selectText, (value, oldValue, onCleanup) => {
  filterDataGen();
});
watch(itemDataList, (value, oldValue, onCleanup) => {
  filterDataGen();
});
const configPath = "./excelList.json";
const router = useRouter()

function goConfig() {
  router.push(PageEnum.ExcelConfig);
}

function goHome() {
  router.push(PageEnum.INDEX);
}

function addItem() {
  openExcelFileHandler().then(res => {
    console.log(res);
    res && res.forEach(file => {
      addItemByFile(file);
    })
    // if()
  })

}

let itemUpdate = false;

let loadItemEditTime = async (itemValue:IExcelItemConfig[]):Promise<IExcelItemConfig[]>=>{
  if (!excelParser.pathConfig) {
    await excelParser.loadPathConfig();
  }
  let excelPath = excelParser.pathConfig?.excelPath;
  if (!excelPath) {
    ElNotification({
      title: 'Prompt',
      message: "请配置excel表格地址",
      duration: 2000,
    })
    return [];
  }


  try {
    let fileInfos = await ReadDir(excelPath);
    let fileInfoMap: { [key: string]: number } = {};
    fileInfos.forEach(ele => {
      fileInfoMap[ele.Name] = Date.parse(ele.Modtime);
    })
    console.log(fileInfoMap);
    let dateTime = 0;
    for (let itemExcel of itemValue) {
      let curTime = fileInfoMap[itemExcel.excelName];
      if (curTime) {
        itemExcel.modTime = curTime;
      } else {
        itemExcel.modTime = dateTime;
      }
    }

  } catch (e) {
    console.log(e)
  }
  return itemValue;
}

let genCodeByLastTime = async ()=>{
  let lastModTime = lastParseTime.value;
  // let itemValue = toRaw(itemDataList.value);
  let itemValue = await loadItemEditTime(toRaw(itemDataList.value));
  itemValue = itemValue.filter(item => item.modTime > lastModTime);
  console.log(itemValue);
  lastParseTime.value = Date.now();
  itemValue.forEach(ele => {
    genItemCode(ele, false);
  })
}

function addItemByFile(file: string) {
  SplitFile(file).then(res => {
    console.log(file, res);
    if (!res.Name) {
      return;
    }
    for (let toRawElement of toRaw(itemDataList.value)) {
      if (toRawElement.excelName == res.Name) {
        return;
      }
    }
    itemUpdate = true;
    itemDataList.value.push({
      excelName: res.Name,
      clientName: "",
      clientCode: false,
      clientData: true,
      serverName: "",
      serverCode: false,
      serverData: true,
      modTime:0,
    })
    filterDataGen();
  })
}

const genCode = () => {
  itemDataList.value.forEach(ele => {
    genItemCode(ele, false);
  })
}

const removeItemData = async (item: IExcelItemConfig) => {
  item = toRaw(item);
  let index = itemDataList.value.indexOf(item);
  if (index >= 0) {
    itemDataList.value.splice(index, 1);
  }
  itemUpdate = true;
  filterDataGen().then();
}

const genItemCode = async (item: IExcelItemConfig, loadPath: boolean = true, showTip: boolean = true) => {
  item = toRaw(item);
  if (itemUpdate) {
    await saveConfig();
  }
  if (loadPath) {
    await excelParser.loadPathConfig();
  }
  let result = await excelParser.parserItemData(item);
  if (result == "ok") {
    if (showTip) {
      ElMessage.success(item.excelName + "   生成成功");
    }
  } else {
    console.log(result);
    ElNotification({
      title: 'Prompt',
      message: item.excelName + '   ' + result,
      duration: 2000,
    })
  }
  lastParseTime.value = Date.now();
}

const orderChangeHandle = () => {
  // console.log(JSON.stringify(toRaw(itemDataList.value)));
  orderType.value = orderType.value == 0 ? 1 : 0;
  filterDataGen();

}

const saveConfig = async () => {
  itemUpdate = false;
  let result = await saveConfigData(configPath, toRaw(itemDataList.value));
  if (result != "ok") {
    ElNotification.error({message: result})
  } else {
    ElMessage.success((result))
    // ElMessage({message:result,type:"success"});
  }
}

const openItemFile = async (item: IExcelItemConfig) => {
  item = toRaw(item);
  if (!excelParser.pathConfig) {
    await excelParser.loadPathConfig();
  }
  console.log(excelParser.pathConfig?.excelPath,excelParser.pathConfig?.excelPath + "\\" + item.excelName);
  // excelParser.pathConfig.excelPath +
  itemUpdate = false;
  let result = await StartFile(excelParser.pathConfig?.excelPath + `\\` + item.excelName);
  if (result != "ok") {
    // ElMessage.error(result)
    ElNotification.error({message: result})
  } else {
    // ElMessage({message:result,type:"success"});
  }

}
const getConfig = () => {
  ReadFile(configPath).then(data => {
    if (data) {
      itemDataList.value = JSON.parse(data);
    }
  })
}

onMounted(() => {
  getConfig();
})
</script>

<style scoped lang="scss">
.w-15 {
  width: 15%;
}

.page-excel-index {
  ul {
    margin: 2px;

    li {
      list-style: none;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;

      > div {
        margin: 0 7px;
      }

      > span {

      }

    }
  }

}

.fix-header {
  position: fixed;
  height: 60px;
  left: 0;
  right: 0;
  top: 0;
}

.fix-bottom {
  position: fixed;
  height: 40px;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
