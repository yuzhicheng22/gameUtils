import {OpenExcelFile, ReadFile, WriteFile} from "@w/go/main/App";

export interface IExcelItemConfig {
    excelName:string,
    clientName:string,
    clientCode:boolean,
    clientData:boolean,
    serverName:string,
    serverCode:boolean,
    serverData:boolean,
    modTime:number,
}
export interface IExcelPathConfig {
    excelPath: string, //excel位置
    clientData: string, //客户端数据位置
    clientCode: string, //客户端代码位置
    serverData: string, //服务端数据位置
    serverCode: string, //服务端代码位置
}
export const  excelPathConfig = "./excelPathConfig.json";

export const saveConfigData = async (path:string,data:any)=>{
    let dataStr = JSON.stringify(data,null,"\t");
    return await WriteFile(path,dataStr);
}

export const loadExcelPathConfig = async ()=>{
   let data = await ReadFile(excelPathConfig);
    if(data){
        return JSON.parse(data);
    }else{
        return {
            excelPath: "", //excel位置
            clientData: '', //客户端数据位置
            clientCode: '', //客户端代码位置
            serverData: '', //服务端数据位置
            serverCode: '', //服务端代码位置
        }
    }
}
export const openExcelFileHandler = async ()=>{
    let data = await loadExcelPathConfig();
    return await OpenExcelFile(data.excelPath);
}
