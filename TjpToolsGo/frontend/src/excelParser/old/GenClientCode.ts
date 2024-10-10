import ExcelMetaData from "../base/ExcelMetaData";

/**
 * 生成客户端代码
 */
export class GenClientCode{

    public genClientData(path:string,metaData:ExcelMetaData,className?:string):IClientData{
        this.metaData = metaData;
        if(className){
            this.className = className;
        }else{
            this.className = "";
        }
        let codeCode:IClientData = {code: [], codeStr:"",path: path+this.getClassName()+".json"};
        this.getClientData(codeCode,metaData);
        return codeCode;
    }
    private getClientData(data:IClientData,metaData:ExcelMetaData){
        for (let row = 4; row <= metaData.rowCount; row++) {
            let temp = [];
            for (let column = 1,len= metaData.itemMetaDataList.length; column <= len; column++) {
                let itemMetaData = metaData.itemMetaDataList[column-1];
                // debugger;
                let cellData = metaData.getCell(column,row);
                if(!cellData){
                    debugger;
                }
               if(!itemMetaData ||!itemMetaData.type){
                    debugger;
                }
                temp.push(itemMetaData.type.parseByData(cellData));
            }
            data.code.push(temp);
        }
        data.codeStr = JSON.stringify(data.code);
    }
    public metaData!:ExcelMetaData;
    /**
     * 生成客户端代码
     */
    public genClientCodeData(path:string,metaData:ExcelMetaData,className?:string):IClientCode[]{
        this.metaData = metaData;
        this.className = className || "";
        let codeCode:IClientCode = {code: "", path: path+this.getClassName()+".ts"};
        this.genClientCode(codeCode);
        return [codeCode];
    }

    private genClientCode(data:IClientCode){
        let codeStr:string[] = [];
        let importSet:Set<string> = new Set<string>();
        let varArray:string [] = [];//数据列表
        let parseArray:string [] = [];//解析列表

        for (let i = 0,len=this.metaData.itemMetaDataList.length; i < len; i++) {
            let itemMetaData = this.metaData.itemMetaDataList[i];
            importSet.add(itemMetaData.type.clientImport);
            varArray.push(itemMetaData.getClientVar());
            parseArray.push(itemMetaData.getClientParse());

        }
        importSet.forEach(importStr=>{
            codeStr.push(importStr);
        })
        let str = ClientCodeTempleStr.replace("&ImportStr&",codeStr.join("\n"));
        str = str.replace('&ClassName&',this.getClassName());
        str = str.replace('&ClassName&',this.getClassName());
        str = str.replace('&ValueStr&',varArray.join("\n"));
        str = str.replace('&ParseStr&',parseArray.join("\n"));
        data.code = str;
    }

    public getDataName(){

    }
    public dataName?:string;
    private _className?:string;
    get className(): string {
        return this._className!;
    }

    set className(value: string) {
        this._className = value;
    }
    private getClassName(){
        if(this._className){
            return this.className;
        }
        let names = this.metaData.sheetName.split("_");
        names.map(itemName=>{
            return itemName[0].toUpperCase() + itemName.slice(1,itemName.length);
        })
        return names.join("");
    }
}

export let ClientCodeTempleStr =
`
import {PublicConfigBase} from "db://assets/scripts/PubConfig/PublicConfigBase";
&ImportStr&
/**
 * &ClassName&
 */
export default class &ClassName& extends PublicConfigBase{
&ValueStr&
    
    public parseData(data:any[]){
        super.parseData(data);
&ParseStr&
        this.parseData1();
    }
}
`
interface IClientData{
    //路径
    path:string;
    codeStr:string;
    //代码
    code:any[];
}
interface IClientCode{
    //路径
    path:string;
    //代码
    code:string;
}
const genClientCode = new GenClientCode();

export default genClientCode;