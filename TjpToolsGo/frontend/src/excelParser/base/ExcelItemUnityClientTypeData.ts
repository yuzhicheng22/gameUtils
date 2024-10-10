import XLSX from 'xlsx';

/**
 * 数据类型
 */
export class ExcelItemUnityClientTypeDataUtils {
    public parseByData(value: string): ExcelItemUnityClientTypeData {
        let data: ExcelItemUnityClientTypeData;
        let lowerValueS = value.toLowerCase().split("|");
        let lowerValue = lowerValueS[0]
        switch (lowerValue) {
            case "number":
            case "float":
                data = ExcelItemClientNumberTypeData.instance;
                break;
            case "integer":
            case "short":
            case "long":
                if(lowerValue == "short"){
                    console.log(lowerValue)
                }
                data = ExcelItemClientIntTypeData.instance;
                break;
            case "string":
                data = ExcelItemClientStringTypeData.instance;
                break;
            default:
                if (lowerValue.endsWith("enum")) {
                    data = ExcelItemClientEnumTypeData.parseByType(value);
                } else {
                    data = ExcelItemUnityClientTypeData.parseByType(value);
                }
                break;
        }
        return data;
    }
}

const excelItemUnityClientTypeDataUtils = new ExcelItemUnityClientTypeDataUtils();
export default excelItemUnityClientTypeDataUtils;

export class ExcelItemUnityClientTypeData {
    public type!: string;
    public clientImport: string = "";

    public getParseStr(index: number) {
        // return `if(!json[${index}].IsInt) { throw new SerializationException(json.ToJson()); } TypeEnum = (DemoEnum)((IJsonWrapper)json[${index}]).GetInt();`
        // return `data[${index}]`;
        return `if(!json[${index}].IsString) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); }  &0& = ${this.type}.Parse(((IJsonWrapper)json[${index}]).GetString()) ;`;
    }

    protected static _instance: ExcelItemUnityClientTypeData
    public static get instance() {
        return this._instance;
    }

    public parseByData(value: XLSX.CellObject):any {
        if(!value){
            return "";
        }
        return value.v?value.v.toString():"";
    }
    public static parseByType(value: string) {
        let data = new ExcelItemUnityClientTypeData();
        data.type = value;
        return data;
    }

}

export class ExcelItemClientIntTypeData extends ExcelItemUnityClientTypeData {
    public type: string = "int";
    protected static _instance: ExcelItemClientIntTypeData = new ExcelItemClientIntTypeData();
    public static get instance() {
        return this._instance;
    }

    public getParseStr(index: number) {
        // return `data[${index}]`;
        return `if(!json[${index}].IsInt) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); }  &0& = ((IJsonWrapper)json[${index}]).GetInt() ;`;
    }
    public parseByData(value: XLSX.CellObject) {
        if(!value || !value.v){
            return 0;
        }
        let temp = parseInt(value.v as any);
        if(isNaN(temp)){
            debugger;
            return temp;
        }
        return temp;
    }
}
export class ExcelItemClientNumberTypeData extends ExcelItemUnityClientTypeData {
    public type: string = "double";
    public clientImport: string = "using GameBase;";
    protected static _instance: ExcelItemClientNumberTypeData = new ExcelItemClientNumberTypeData();
    public static get instance() {
        return this._instance;
    }

    public getParseStr(index: number) {
        // return `if(!json[${index}].IsDouble) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); }  &0& = ((IJsonWrapper)json[${index}]).GetDouble() ;`;
        return `  &0& = json[${index}].ToDouble() ;`;
        // return `data[${index}]`;
    }
    public parseByData(value: XLSX.CellObject) {
        if(!value || !value.v){
            return 0.0;
        }
        return parseFloat(value.v as any);
    }
}

class ExcelItemClientStringTypeData extends ExcelItemUnityClientTypeData {
    public type: string = "string";
    protected static _instance: ExcelItemClientStringTypeData = new ExcelItemClientStringTypeData();
    public getParseStr(index: number) {
        // return `if(!json[${index}].IsString) { throw new SerializationException("&0&"+"{["+json[${index}]+"]}"+json.ToJson()); }  &0& = ${this.type}.Parse(((IJsonWrapper)json[${index}]).GetString()) ;`;
        return `if(!json[${index}].IsString) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); }  &0& = ((IJsonWrapper)json[${index}]).GetString() ;`;
    }
    public parseByData(value: XLSX.CellObject) {
        if(!value){
            return "";
        }
        return value.v?value.v.toString():"";
    }
}

class ExcelItemClientEnumTypeData extends ExcelItemUnityClientTypeData {
    public type: string = "number";
    public type1: string = "number";
    //todo 添加数据
    public clientImport: string = ``;
    public static parseByType(value: string) {
        let data = new ExcelItemClientEnumTypeData();
        let typeValue = value.split("|");
        data.type = typeValue[0];
        data.clientImport = data.clientImport.replaceAll("&0&",data.type);
        if (typeValue.length > 1) {
            data.type1 = typeValue[1];
        }
        return data;
    }
    public parseByData(value: XLSX.CellObject) {
        if(this.type1 == "number"){//看看是什么类型
            if(!value){
                return 0;
            }
            return value.v?value.v:0;
        }else if (this.type1 == "label"){//todo 这里需要支持 通过程序转换成 enum 值 然后进行判断

        }

        if(!value){
            return "";
        }
        return value.v?value.v.toString():"";
    }
    public getParseStr(index: number) {
        // import {&0&} from "db://assets/scripts/enums/&0&";
        // return `if(!json[${index}].IsInt) { throw new SerializationException("&0&"+"{["+json[${index}]+"]}"+json.ToJson()); } TypeEnum = (&0&)((IJsonWrapper)json[${index}]).GetInt();`
        if (this.type1.toLowerCase() == "name") {//使用名称
            return `if(!json[${index}].IsString) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); } &0& = (json[${index}] as IJsonWrapper).GetString().Parse<${this.type}>();`
            // return `${this.type}[data[${index}]] as any`
        }else if (this.type1.toLowerCase() == "parse") {//使用名称
            return `if(!json[${index}].IsString) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); } &0& =  ${this.type}Parse.Parse((json[${index}] as IJsonWrapper).GetString());`
            // return `${this.type}[data[${index}]] as any`
        }
        return `if(!json[${index}].IsInt) { throw new SerializationException("&0&"+"{[${index}]["+json[${index}]+"]}"+json.ToJson()); } &0& = (${this.type})(json[${index}] as IJsonWrapper).GetInt();`;
    }
}
