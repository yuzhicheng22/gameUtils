import * as fs from 'fs'
import excelRead from "./ExcelRead";
import excelParser from "./parser/ExcelParser";
import genClientCode from "./parser/GenClientCode";
import ExcelMetaData from "./parser/base/ExcelMetaData";

let baseUrl = "E:\\project\\projectTjp\\tjp-client-1\\策划\\";
let excelName = "Item_技能书.xlsx";
// let excelName = "Shop_NPC商店_1125.xlsx";

function parserMetaData(excelName: string) {
    let fileUrl = baseUrl + excelName;
    let lastTime = Date.now();
    let fileData = fs.readFileSync(fileUrl, {flag: 'r'});
    let data = excelRead.parserHandler(fileData);
    let metaData = excelParser.parserMetaData(data);
    console.log(excelName + "解析时间", Date.now() - lastTime);
    return metaData;
}

function genClientCodeFunc(metaData: ExcelMetaData, className?: string) {
    let lastTime = Date.now();
    let savePath: string = __dirname + "..\\gen\\client\\";
    let clientData = genClientCode.genClientCodeData(savePath, metaData, className);

    fs.writeFile(clientData.path, clientData.code, () => {
        console.log("生成时间", Date.now() - lastTime);
    });
}

function genClientDataFunc(metaData: ExcelMetaData, className?: string) {
    let lastTime = Date.now();
    let savePath: string = __dirname + "..\\gen\\data\\";
    let clientData = genClientCode.genClientData(savePath, metaData, className);

    fs.writeFile(clientData.path, JSON.stringify(clientData.code), () => {
        console.log("生成时间", Date.now() - lastTime);
    });
}

let metaData = parserMetaData(excelName);
genClientDataFunc(metaData);
genClientCodeFunc(metaData);


// console.log(metaData);
// let collCounts = data["!ref"]!.split(":");
// let  collCount = collCounts[1].replace(/\D+/,"");
// let  collCount1 = collCounts[1].replace(/\d+/,"");