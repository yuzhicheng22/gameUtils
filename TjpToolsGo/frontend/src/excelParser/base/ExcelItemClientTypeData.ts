import XLSX from 'xlsx';

/**
 * 数据类型
 */
export class ExcelItemClientTypeParseUtils {
    public parseByData(value: string): ExcelItemClientTypeData {
        let data: ExcelItemClientTypeData;
        let lowerValueS = value.toLowerCase().split("|");
        let lowerValue = lowerValueS[0]
        switch (lowerValue) {
            case "number":
            case "float":
            case "double":
                data = ExcelItemClientNumberTypeData.instance;
                break;
            case "integer":
            case "short":
            case "long":
                data = ExcelItemClientIntTypeData.instance;
                break;
            case "string":
                data = ExcelItemClientStringTypeData.instance;
                break;
            default:
                if (lowerValue.endsWith("enum")) {
                    data = ExcelItemClientEnumTypeData.parseByType(value);
                } else {
                    data = ExcelItemClientTypeData.parseByType(value);
                }
                break;
        }
        return data;
    }
}

const excelItemClientTypeParseUtils = new ExcelItemClientTypeParseUtils();
export default excelItemClientTypeParseUtils;

export class ExcelItemClientTypeData {
    public type!: string;
    public clientImport: string = "";

    public getParseStr(index: number) {
        return `data[${index}]`;
    }

    protected static _instance: ExcelItemClientTypeData
    public static get instance() {
        return this._instance;
    }
    public parseToStr(value: XLSX.CellObject):any {
        if(!value){
            return "";
        }
        return value.v?value.v.toString():"";
    }
    public parseByData(value: XLSX.CellObject):any {
        if(!value){
            return "";
        }
        return value.v?value.v.toString():"";
    }
    public static parseByType(value: string) {
        let data = new ExcelItemClientTypeData();
        data.type = value;
        return data;
    }

}

export class ExcelItemClientNumberTypeData extends ExcelItemClientTypeData {
    public type: string = "number";
    protected static _instance: ExcelItemClientNumberTypeData = new ExcelItemClientNumberTypeData();
    public static get instance() {
        return this._instance;
    }

    public getParseStr(index: number) {
        return `parseFloat(data[${index}])`;
    }
    public parseByData(value: XLSX.CellObject) {
        if(!value || !value.v){
            return 0;
        }
        return parseFloat(value.v as any);
    }
}
export class ExcelItemClientIntTypeData extends ExcelItemClientTypeData {
    public type: string = "number";
    protected static _instance: ExcelItemClientIntTypeData = new ExcelItemClientIntTypeData();
    public static get instance() {
        return this._instance;
    }

    public getParseStr(index: number) {
        return `parseInt(data[${index}])`;
    }
    public parseByData(value: XLSX.CellObject) {
        if(!value || !value.v){
            return 0;
        }
        return parseInt(value.v as any);
    }
}
export class ExcelItemClientStringTypeData extends ExcelItemClientTypeData {
    public type: string = "string";
    protected static _instance: ExcelItemClientStringTypeData = new ExcelItemClientStringTypeData();
}

class ExcelItemClientEnumTypeData extends ExcelItemClientTypeData {
    public type: string = "number";
    public type1: string = "number";
    //todo 添加数据
    public clientImport: string = `import {&0&} from "../../../enums/&0&";`;
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
        if (this.type1 == "name") {//使用名称
            return `${this.type}[data[${index}]] as any`
        }
        return `parseInt(data[${index}])`;
    }
}
