const OPEN_PAREN_CODE = 40; // (
const CLOSE_PAREN_CODE = 41; // )
const VARIABLE_BEGIN_CODE = 64; // @，变量开头
const PERIOD_CODE = 46; // '.'
const SINGLE_QUOTE_CODE = 39; //' single quote
const DOUBLE_QUOTE_CODE = 34; //" double quotes
const SPACE_CODES = [32, 9, 10, 13]; // space
// 一元运算符
const UNARY_OPERATORS = {'-': true, '!': true, '+': true};
// 二元逻辑运算符
const LOGICAL_OPERATORS = ['||', '&&', '===', '!==', '>', '<', '>=', '<=', 'include'];
//二元操作运算符
const BINARY_OPERATORS: { [key: string]: number } = {
    '||': 1,
    '&&': 2,
    '===': 6, '!==': 6,
    '<': 7, '>': 7, '<=': 7, '>=': 7,
    '+': 9, '-': 9,
    '*': 10, '/': 10, '%': 10,
    'include': 11,
};
// 获取对象键的最大长度
const getMaxKeyLen = function getMaxKeyLen(obj: any) {
    let max = 0;
    Object.keys(obj).forEach((key) => {
        if (key.length > max && obj.hasOwnProperty(key)) {
            max = key.length;
        }
    });
    return max;
};
const maxBinaryOperatorLength = getMaxKeyLen(BINARY_OPERATORS);
const maxUnaryOperatorLength = getMaxKeyLen(UNARY_OPERATORS);

/**
 * 条件解析
 */
export class ExprParserOne {
    /**
     * 是否解析过
     */
    public parsed: boolean = false;
    private readonly expr: string;
    private readonly exprLen: number;
    private index: number = 0;

    constructor(expr: string) {
        // if (typeof expr !== 'string') {
        //     throw new Error(`[expression-parser] constructor need a string parameter, but get [${typeof expr}]`);
        // }
        this.expr = expr;
        this.exprLen = expr.length;
    }

    public tokens?: OpenCondExprToken;
    public onErrorCallback?:Function;

    /**
     * 解析格子
     */
    public parse() {
        this.index = 0;
        try {
            this.tokens = this.eatExpression();
            if(this.index < this.exprLen){
                throw new Error(`非法字符"${this.charAt(this.index)}"`);
            }
        // @ts-ignore
        }catch (error:Error){
            this.tokens = undefined;
            if (typeof this.onErrorCallback === 'function') {
                this.onErrorCallback(error.message, this.index, this.charAt(this.index));
            } else {
                throw new Error(error.message);
            }
        }
    }

    /**
     * 解析表达式
     */
    public eatExpression(): OpenCondValueToken {
        let left = this.eatToken();
        let operator = this.eatBinaryOperator();
        if (!operator) {//没有二元操作符
            return left;
        }
        let operatorInfo = new OpenCondOperatorInfo(this.getOperatorPrecedence(operator),operator);
        //     precedence: this.getOperatorPrecedence(operator), // 获取运算符优先级
        //     value: operator,
        // };
        let right:any = this.eatToken();
        if (!right) {//获取右边token
            throw new Error(`"${operator}"运算符后应该为表达式`);
        }
        // const stack = new OpenCondExprToken();
        // stack.left = left;
        // stack.right = right;
        // stack.operatorInfo = operatorInfo;
        const stack = [left, operatorInfo, right];
        // 获取下一个运算符
        while (operator = this.eatBinaryOperator()) {
            //优先级
            const precedence = this.getOperatorPrecedence(operator);
            // 如果遇到了非法的运算符
            if (precedence === 0) {
                break;
            }
            operatorInfo = new OpenCondOperatorInfo(this.getOperatorPrecedence(operator),operator);
            // 判断优先级 如果有 左边优先级 大于 右边 左边先入栈
            while (stack.length > 2 &&  (stack[stack.length - 2] as OpenCondOperatorInfo).precedence > precedence) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                const node = this.createNode(operator as string, left, right);
                stack.push(node);
            }
            const node = this.eatToken();
            if (!node) {
                throw new Error(`"${operator}"运算符后应该为表达式`);
            }
            stack.push(operatorInfo, node);
        }
        // 计算优先级 来判断  右边向左边来判断 如果依次入栈
        // todo 这个好像不太对了 没有 做解析数据
        let index = stack.length - 1;
        let node = stack[index];
        while (index > 1) {
            node = this.createNode(stack[index - 1].value, stack[index - 2], node);
            index -= 2;
        }
        return node;
    }

    /**
     * 解析token
     */
    public eatToken(): OpenCondValueToken {
        this.eatSpaces();
        const ch = this.charCodeAt(this.index);//获取第一个数值
        if (ch === VARIABLE_BEGIN_CODE) {//变量标识开头
            // 变量
            return this.eatVariable();
        } else if (this.isDigit(ch) || ch === PERIOD_CODE) {//如果是数字或者小数点
            // 数字
            return this.eatNumber();
        } else if (ch === SINGLE_QUOTE_CODE || ch === DOUBLE_QUOTE_CODE) {//如果是引号 判断数值
            // 字符串
            return this.eatString();
        } else if (ch === OPEN_PAREN_CODE) {
            // 括号
            return this.eatGroup();
        } else {
            //应该做个 二元逻辑运算符来做区分
            // 检查单操作符 ！+ -
            let toCheck = this.expr.slice(this.index, this.index + maxUnaryOperatorLength);
            // let toCheckMaxLen = toCheck.length;
            let toCheckLength = toCheck.length;
            while (toCheckLength > 0) {//更具最大的长度 从后向前看
                if (
                    UNARY_OPERATORS.hasOwnProperty(toCheck) &&//是否单操作符
                    this.index + toCheckLength <= this.expr.length//判断是否超过了
                ) {
                    this.index += toCheckLength;
                    //得到第一个 单操作符
                    let token = new OpenCondUnaryToken();
                    token.type = OpenCondExprTokenEnum.UNARY_EXP;
                    token.operator = toCheck;
                    token.argument = this.eatToken();
                    return token;
                    // return {
                    //     type: 'UNARY_EXP',
                    //     operator: toCheck,
                    //     argument: this.eatToken(),
                    // };
                }
                toCheck = toCheck.slice(0, -1);
                toCheckLength--;
            }
        }
        //todo 错日自
        return null;
    }


    /**
     * 解析二元操作符
     * 其实应该添加一个解析数据 来做二元解析
     */
    public eatBinaryOperator(){
        this.eatSpaces();
        //得到二元操作符的最大数据
        let toCheck = this.expr.slice(this.index, this.index+maxBinaryOperatorLength);
        let toCheckLength = toCheck.length;
        while (toCheckLength){
            if (
                BINARY_OPERATORS.hasOwnProperty(toCheck) &&
                this.index + toCheckLength <= this.exprLen
            ) {
                this.index += toCheckLength;
                return toCheck;
            }
            //减少一个数据
            toCheck = toCheck.slice(0, -1);
            toCheckLength--;
        }

        return false;

    }

    /**
     * 解析字符串
     */
    public eatString() {
        let str = '';
        const quote = this.charAt(this.index++);
        let closed = false;

        if (!closed) {
            throw new Error(`字符"${str}"缺少闭合括号`);
        }
        let data = new OpenCondValueToken();
        data.type = OpenCondExprTokenEnum.STRING;
        data.value = str;
        data.raw = quote + str + quote;
        return data;
    }

    /**
     * 解析变量
     */
    public eatVariable() {
        const ch = this.charAt(this.index);
        this.index++; // eat "@"
        const start = this.index;
        while (this.index < this.exprLen) {
            const ch = this.charCodeAt(this.index);
            if (this.isVariablePart(ch)) {
                this.index++;
            } else {
                break;
            }
        }
        const identifier = this.expr.slice(start, this.index);
        let data = new OpenCondValueToken();
        data.type = OpenCondExprTokenEnum.VARIABLE;
        data.value = identifier;
        data.raw = ch + identifier;
        return data;
    }

    public eatNumber() {
        let number = '';
        // 数字开头
        while (this.isDigit(this.charCodeAt(this.index))) {
            number += this.charAt(this.index++);
        }
        // '.'开头
        if (this.charCodeAt(this.index) == PERIOD_CODE) {
            number += this.charAt(this.index++);
            while (this.isDigit(this.charCodeAt(this.index))) {
                number += this.charAt(this.index++);
            }
        }
        // 科学计数法
        let ch = this.charAt(this.index);
        if (ch === 'e' || ch === 'E') {
            ch = this.charAt(this.index++);
            number += ch;
            if (ch === '+' || ch === '-') {
                number += this.charAt(this.index++);
            }
            //读取到不是数值
            while (this.isDigit(this.charCodeAt(this.index))) {
                number += this.charAt(this.index++);
            }
            // 如果e + - 后无数字，报错
            if (!this.isDigit(this.charCodeAt(this.index - 1))) {
                throw new Error(`非法数字(${number}${this.charAt(this.index)})，缺少指数`);
            }
        }
        let data = new OpenCondValueToken();
        data.type = OpenCondExprTokenEnum.NUMBER;
        data.value = parseFloat(number);
        data.raw = number;
        return data;
    }

    /**
     * 解析表达式
     */
    public eatGroup() {
        this.index++; // eat "("
        const node = this.eatExpression();
        this.eatSpaces();
        const ch = this.charCodeAt(this.index);
        if (ch !== CLOSE_PAREN_CODE) {
            throw new Error('括号没有闭合');
        } else {
            this.index++; // eat ")"
            return node;
        }
        //todo
        return node;
    }

    //判断是否空格 空格 就接着下一个
    eatSpaces() {
        let ch = this.charCodeAt(this.index);
        while (SPACE_CODES.indexOf(ch) !== -1) {
            ch = this.charCodeAt(++this.index);
        }
    }


    /**
     * 是否变量值部分 这里只是常规的部分
     *
     * @param ch
     */
    isVariablePart(ch: number) {
        return (ch >= 65 && ch <= 90) || // A...Z
            (ch >= 97 && ch <= 122) || // a...z
            (ch >= 48 && ch <= 57); // 0...9
    }

    /**
     * 是否数字
     * @param ch
     */
    isDigit(ch: number) {
        return ch >= 48 && ch <= 57; // 0...9
    }


    charAt(index: number) {
        return this.expr.charAt(index);
    }

    charCodeAt(index: number) {
        return this.expr.charCodeAt(index);
    }
    /**
     * 获取操作符的优先级
     * @param operator
     */
    getOperatorPrecedence(operator:string) {
        return BINARY_OPERATORS[operator] || 0;
    }
    /**
     * 创建节点
     * @param operator
     * @param left
     * @param right
     */
    createNode(operator:string, left?:OpenCondValueToken, right?:OpenCondValueToken) {
        const type = LOGICAL_OPERATORS.indexOf(operator) !== -1
            ?OpenCondExprTokenEnum.LOGICAL_EXP
            : 'BINARY_EXP';
        let data = new OpenCondExprToken();
        data.type = type;
        data.operator = operator;
        data.right = left;
        data.left = right;
        return data;
    }

    public valueOf(scope:{[key:string]:any}){
        if (this.tokens == null) {
            return false;
        }
        const value = this.getNodeValue(this.tokens, scope);
        return !!value;
    }
    public getNodeValue(node:OpenCondValueToken,scope:{[key:string]:any}):any{
        // let type = node.type;
        const {type, value,  operator} = node;
        if(type == OpenCondExprTokenEnum.VARIABLE){//变量
            return scope[node.value];
        }else if (type === OpenCondExprTokenEnum.NUMBER || type === OpenCondExprTokenEnum.STRING) {//文字和数值 好像没有
            return value;
        }else if(type == OpenCondExprTokenEnum.LOGICAL_EXP){//逻辑类型
            const { left, right,} =  node as OpenCondExprToken;
            let leftValue = this.getNodeValue(left,scope);
            // 如果是逻辑运算的&&和||，那么可能不需要解析右边的值
            if (operator === '&&' && !leftValue) {
                return false;
            }
            if (operator === '||' && !!leftValue) {
                return true;
            }
            let rightValue = this.getNodeValue(right,scope);
            switch (operator) {
                case '&&':
                    return leftValue && rightValue;
                case '||':
                    return leftValue || rightValue;
                case '>':
                    return leftValue > rightValue;
                case '>=':
                    return leftValue >= rightValue;
                case '<':
                    return leftValue < rightValue;
                case '<=':
                    return leftValue <= rightValue;
                case '===':
                    return leftValue === rightValue;
                case '!==':
                    return leftValue !== rightValue;
                // case 'include':
                //     return leftValue.toString &&
                //         rightValue.toString &&
                //         leftValue.toString().indexOf(rightValue.toString()) !== -1;
                // skip default case
                default:
                    throw new Error("二元操作符不对的==="+operator)
            }
        }else if(type == OpenCondExprTokenEnum.BINARY_EXP){//二元操作符
            const { left, right,} =  node as OpenCondExprToken;
            let leftValue = this.getNodeValue(left,scope);
            let rightValue = this.getNodeValue(right,scope);
            switch (operator) {
                case '+':
                    return leftValue + rightValue;
                case '-':
                    return leftValue - rightValue;
                case '*':
                    return leftValue * rightValue;
                case '/':
                    return leftValue - rightValue;
                case '%':
                    return leftValue % rightValue;
            }
        }else if (type === OpenCondExprTokenEnum.UNARY_EXP) {
            let node1 = node as  OpenCondUnaryToken;
            switch (operator) {
                case '!':
                    return !this.getNodeValue(node1.argument, scope);
                case '+':
                    return +this.getNodeValue(node1.argument, scope);
                case '-':
                    return -this.getNodeValue(node1.argument, scope);
                // skip default case
            }
        }

    }
}

/**
 * token类型
 */
enum OpenCondExprTokenEnum {
    UNARY_EXP,//表达式
    VARIABLE,//变量
    NUMBER,//数字
    STRING,//字符串
    LOGICAL_EXP,//逻辑类型
    BINARY_EXP,//二元操作
}
class OpenCondOperatorInfo{
    //优先级
    precedence:number;//
    //值
    value:string;//
    constructor(precedence:number,value:string) {
        this.precedence = precedence;
        this.value = value;
    }
}

enum OpenCondExprOptEnum {
    OR = 1,//或
    AND = 2,//并
}

class OpenCondValueToken {
    type?: OpenCondExprTokenEnum | string;
    value?: any;
    raw?: any;
    operator?:string
}


class OpenCondUnaryToken extends OpenCondValueToken{
    argument!: OpenCondValueToken;
}
class OpenCondExprToken extends OpenCondValueToken {
    left!: OpenCondValueToken;
    right!: OpenCondValueToken;
}
