import ExcelMetaData from "./base/ExcelMetaData";

/**
 * 生成客户端代码
 */
export class GenUnityClientCode{

    public genClientData(path:string,metaData:ExcelMetaData,className?:string):IClientData{
        this.metaData = metaData;
        if(className){
            this.className = className;
        }else{
            this.className = "";
        }
        let codeCode:IClientData = {code: [], codeStr:"", path: path+this.getClassName()+".json"};
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
                // if(!cellData){
                //     debugger;
                // }
               if(!itemMetaData ||!itemMetaData.unityType){
                    debugger;
                }
               // if(itemMetaData.index == 14){
               //     debugger;
               // }
               // var temp1 = itemMetaData.unityType.parseByData(cellData);
               // if(isNaN(temp1)){
               //     debugger;
               // }
               // console.log(temp1);
                temp.push( itemMetaData.unityType.parseByData(cellData));
            }
            // if(temp[0]== 1023){
            //     debugger;
            // }
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
        if(className){
            this.className = className;
        }else{
            this.className = "";
        }
        let codeCodes = [];

        let codeCode:IClientCode = {code: "", path: path+"Config\\"+this.getClassName()+".cs",cover:true};
        this.genClientCode(codeCode);
        codeCodes.push(codeCode);
        let codeCode1:IClientCode = {code: "", path: path+"ConfigExt\\"+this.getClassName()+"Ext.cs",cover:false};
        this.genClientCode1(codeCode1);
        codeCodes.push(codeCode1);
        let codeCode2:IClientCode = {code: "", path: path+"Dictionary\\"+this.getClassName()+"Dic.cs",cover:false};
        this.genClientCode2(codeCode2);
        codeCodes.push(codeCode2);
        return codeCodes;
    }

    public IdentityVar:string = "";

    private genClientCode(data:IClientCode){
        let codeStr:string[] = [];
        let importSet:Set<string> = new Set<string>();
        let varArray:string [] = [];//数据列表
        let parseArray:string [] = [];//解析列表

        for (let i = 0,len=this.metaData.itemMetaDataList.length; i < len; i++) {
            let itemMetaData = this.metaData.itemMetaDataList[i];
            importSet.add(itemMetaData.unityType.clientImport);
            varArray.push(itemMetaData.getUnityClientVar());
            parseArray.push(itemMetaData.getClientUnityParse());
            if(i == 0){
                this.IdentityVar = itemMetaData.typeNameCS;
            }

        }
        importSet.forEach(importStr=>{
            codeStr.push(importStr);
        })
        let str = ClientCodeTempleStr.replace("&ImportStr&",codeStr.join("\n"));
        str = str.replaceAll('&ClassName&',this.getClassName());
        // str = str.replace('&ClassName&',this.getClassName());
        str = str.replace('&ValueStr&',varArray.join("\n"));
        str = str.replace('&ParseStr&',parseArray.join("\n"));
        data.code = str;
    }

    private genClientCode1(data:IClientCode){
        data.code = ClientCodeTemple1Str.replaceAll('&ClassName&',this.getClassName());
    }
    private genClientCode2(data:IClientCode){
        let code = ClientCodeTemple2Str.replaceAll('&ClassName&',this.getClassName());
        if(this.IdentityVar){
            code = code.replaceAll('&Identity&',this.IdentityVar);
        }
        data.code = code;
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

const ClientCodeTempleStr =
`
using System;
using System.Runtime.Serialization;
using LitJson;
using TEngine;
&ImportStr&

namespace GameProto.GamePubData
{
    /**
     * &ClassName&
     */
    [Serializable]
    public partial class &ClassName& : PubDataBase
    {
&ValueStr&
        
        public override void ParseData(JsonData json)
        {
&ParseStr&
            ParseData1();
        }
    }
}
`
const ClientCodeTemple1Str =
    `
using System;

namespace GameProto.GamePubData
{
    public partial class &ClassName&
    {
        // public override void ParseData1()
        // {
        // }
        //
        // public override void EditCheck()
        // {
        //     var _ = UrlData.IsNone;
        // }
    }
}
`;
const ClientCodeTemple2Str =
    `using System;
using System.Collections.Generic;
using System.Linq;
using LitJson;

namespace GameProto.GamePubData
{
    public class &ClassName&Dic : PubDataDicBase<&ClassName&>, IPubDataDic
    {
        protected override Func<&ClassName&, int> IdKey => value => value.&Identity&;
        
        public void Init()
        {
            if (JsonData != null)
            {
                ParseData(JsonData);
                ParseData1();
            }
            JsonData = null;
        }

        private void ParseData1()
        {
            // _listMapByKey = ToMapList(ele => ele.MapId);
            // _mapByName = ToMap(ele => ele.Name);
            // _mapByIdLv = ToMap2(ele=>ele.TypeInt, ele => ele.TypeInt2);

        }
        // private Dictionary<int, Dictionary<int, &ClassName&>> _mapByIdLv;
        //
        // public &ClassName& GetByKey2(int key,int level)
        // {
        //    return !_mapByIdLv.TryGetValue(key, out var dic) ? null : dic.GetValueOrDefault(level,null);
        // }
        // private  Dictionary<int, List<&ClassName&>> _listMapByKey ;
        // public List<&ClassName&> GetListByKey(int key)
        // {
        //     return _listMapByKey.GetValueOrDefault(key,null);
        // }
        // private Dictionary<string, &ClassName&> _mapByName ;
        // public &ClassName& GetByName(string name)
        // {
        //     return _mapByName.GetValueOrDefault(name,null);
        // }
    }
}
`;

interface IClientData{
    //路径
    path:string;
    //代码
    code:any[];
    codeStr:string;
}

interface IClientCode{
    //路径
    path:string;
    //代码
    code:string;
    //
    cover?:boolean;
}

const genUnityClientCode = new GenUnityClientCode();

export default genUnityClientCode;