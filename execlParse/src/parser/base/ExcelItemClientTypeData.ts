import XLSX from 'xlsx';

/**
 * 数据类型
 */
export class ExcelItemClientTypeParseUtils {
    public parseByData(value: string): ExcelItemClientTypeData {
        let data: ExcelItemClientTypeData;
        let lowerValue = value.toLowerCase();
        switch (lowerValue) {
            case "number":
            case "integer":
            case "short":
            case "long":
                data = ExcelItemClientNumberTypeData.instance;
                break;
            default:
                if (lowerValue.indexOf("enum") >= 0) {
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
        return `data[${index}]`;
    }
    public parseByData(value: XLSX.CellObject) {
        if(!value){
            return 0;
        }
        return value.v?value.v:0;
    }

}

export class ExcelItemClientStringTypeData extends ExcelItemClientTypeData {
    public type: string = "string";
    protected static _instance: ExcelItemClientNumberTypeData = new ExcelItemClientNumberTypeData();
}

export class ExcelItemClientEnumTypeData extends ExcelItemClientTypeData {
    public type: string = "string";
    public type1: string = "value";
    //todo 添加数据
    public clientImport: string = "";
    public static parseByType(value: string) {
        let data = new ExcelItemClientEnumTypeData();
        let typeValue = value.split("|");
        data.type = typeValue[0];
        if (typeValue.length > 1) {
            data.type1 = typeValue[1];
        }
        return data;
    }

    public getParseStr(index: number) {
        if (this.type1 == "name") {//使用名称
            return `${this.type}[data[${index}]]`
        }
        return `data[${index}]`;
    }
}
