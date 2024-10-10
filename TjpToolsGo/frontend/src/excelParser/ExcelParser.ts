import ExcelMetaData from "./base/ExcelMetaData";
import {IExcelItemConfig, IExcelPathConfig, loadExcelPathConfig} from "@/views/excel/data";
import {FileExists, ReadFileB, WriteFile} from "@w/go/main/App";
import XLSX from "xlsx";
import genClientCode from "@/excelParser/GenTsCSVClientCode"
import genTsCSVServerCode from "@/excelParser/GenTsCSVServerCode";

export class ExcelParser {

    public pathConfig?: IExcelPathConfig;

    public async loadPathConfig() {
        this.pathConfig = await loadExcelPathConfig();
    }

    public parserMetaData(data: any,excelName:string): ExcelMetaData {
        return ExcelMetaData.parserData(data,excelName)
    }

    async genClientCodeFunc(metaData: ExcelMetaData, className?: string) {
        let lastTime = Date.now();
        let savePath: string = this.pathConfig!.clientCode ?? "..\\gen\\client\\";
        let clientDataList = genClientCode.genClientCodeData(savePath, metaData, className);
        let res = "ok";
        for (let clientData of clientDataList) {
            if(!clientData.cover){
                let exist = await FileExists(clientData.path)
                if(exist){
                    continue;
                }
            }
            res = await WriteFile(clientData.path, clientData.code)
            if(res != "ok"){
                return res;
            }
            console.log(clientData.path, res);
            console.log("生成时间1", Date.now() - lastTime);
        }
        return res;

        // let serverPath: string = this.pathConfig!.serverCode ?? "..\\config";
        // let serverDataList = genClientCode.genClientCodeData(serverPath, metaData, className);
        // serverDataList.forEach(serverData=>{
        //     if(serverData.cover){
        //         WriteFile(serverData.path, serverData.code).then(res => {
        //             console.log(serverData.path, res);
        //             console.log("生成时间1", Date.now() - lastTime);
        //         })
        //     }else{
        //         FileExists(serverData.path).then(res=>{
        //             if(!res){
        //                 WriteFile(serverData.path, serverData.code).then(res => {
        //                     console.log(serverData.path, res);
        //                     console.log("生成时间", Date.now() - lastTime);
        //                 })
        //             }
        //         })
        //     }
        // })
    }

    async genClientDataFunc(metaData: ExcelMetaData, className?: string) {
        let lastTime = Date.now();
        let savePath: string = this.pathConfig!.clientData ?? +"..\\gen\\data\\";
        let clientData = genClientCode.genClientData(savePath, metaData, className);
        let res = await WriteFile(clientData.path, clientData.codeStr)
        if(res != "ok"){
            return res;
        }
        console.log(clientData.path, res);
        console.log("生成时间", Date.now() - lastTime);
        return res;
    }

    async genServerDataFunc(metaData: ExcelMetaData, className?: string) {
        let lastTime = Date.now();

        let serverPath: string = this.pathConfig!.serverData ?? "..\\config";
        let serverData = genTsCSVServerCode.genServerData(serverPath, metaData, className);
        let res = await WriteFile(serverData.path, serverData.codeStr)
        if(res != "ok"){
            return res;
        }
        console.log(serverData.path, res);
        console.log("生成时间", Date.now() - lastTime);
        return res;

    }
    public async parserItemData(configData: IExcelItemConfig) {
        let excelPath = this.pathConfig!.excelPath + configData.excelName;
        let result = await FileExists(excelPath);
        console.log(excelPath, result);
        if (result) {
            // let excelData = await ReadFile(excelPath);
            let excelData = await ReadFileB(excelPath);
            let lastTime = Date.now();
            let workBook = XLSX.read(excelData)
            // let workBook = XLSX.read(buffer.Buffer.from(excelData,'utf-8'))
            // let names = workBook.SheetNames;
            // let workSheer = workBook.Sheets[names[0]];
            console.log("读取时间", Date.now() - lastTime);
            let metaData = this.parserMetaData(workBook,configData.excelName);
            // console.log(metaData);\
            let res = "ok";
            if (configData.clientCode) {
                res = await this.genClientCodeFunc(metaData, configData.clientName);
                if(res != "ok"){
                    return res;
                }
            }
            if (configData.clientData) {
                res = await this.genClientDataFunc(metaData, configData.clientName);
                if(res != "ok"){
                    return res;
                }
            }
            if (configData.serverData) {
                res = await this.genServerDataFunc(metaData, configData.serverName);
                if(res != "ok"){
                    return res;
                }
            }
            return res;
        } else {
            //todo 输出错误信息
            return configData.excelName + "   文件夹不存在";
        }

    }
}

const excelParser = new ExcelParser();
export default excelParser;

