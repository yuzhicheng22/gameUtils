const OPEN_PAREN_CODE = 40; // (
const CLOSE_PAREN_CODE = 41; // )
const VARIABLE_BEGIN_CODE = 64; // @，变量开头
const PERIOD_CODE = 46; // '.'
const SINGLE_QUOTE_CODE = 39; //' single quote
const DOUBLE_QUOTE_CODE = 34; //" double quotes
const SPACE_CODES = [32, 9, 10, 13]; // space
// 一元运算符
const UNARY_OPERATORS = {'-': true, '!': true, '+': true};
// 二元逻辑
const LOGICAL_OPERATORS = ['||', '&&', '===', '!==', '>', '<', '>=', '<=', 'include'];
//二元运算符
const BINARY_OPERATORS:{[key:string]:number} = {
    '||': 1,
    '&&': 2,
    '===': 6, '!==': 6,
    '<': 7, '>': 7, '<=': 7, '>=': 7,
    '+': 9, '-': 9,
    '*': 10, '/': 10, '%': 10,
    include: 11,
};
// 获取对象键的最大长度
const getMaxKeyLen = function getMaxKeyLen(obj:any) {
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
export class ExpressionParser{
    public expr:string ;
    public index:number = 0;
    constructor(expr:string|number) {
        if (typeof expr !== 'string') {
            throw new Error(`[expression-parser] constructor need a string parameter, but get [${typeof expr}]`);
        }
        this.expr = expr;
    }

    parse() {
        this.index = 0;
        try {
            this.tokens = this.eatExpression();
            if (this.index < this.expr.length) {
                throw new Error(`非法字符"${this.charAt()}"`);
            }
        } catch (error:any) {
            this.tokens = undefined;
            if (typeof this.onErrorCallback === 'function') {
                this.onErrorCallback(error.message, this.index, this.charAt());
            } else {
                throw new Error(error.message);
            }
        }
        return this;
    }
    eatExpression() {
        let left = this.eatToken();
        let operator = this.eatBinaryOperator();
        // 说明这个运算树只有左侧
        if (!operator) {
            return left;
        }
        let operatorInfo = {
            precedence: this.getOperatorPrecedence(operator), // 获取运算符优先级
            value: operator,
        };
        let right = this.eatToken();
        if (!right) {
            throw new Error(`"${operator}"运算符后应该为表达式`);
        }
        const stack = [left, operatorInfo, right];
        // 获取下一个运算符
        while (operator = this.eatBinaryOperator()) {
            const precedence = this.getOperatorPrecedence(operator);
            // 如果遇到了非法的yuan fa
            if (precedence === 0) {
                break;
            }
            operatorInfo = {
                precedence,
                value: operator,
            };
            while (stack.length > 2 && precedence < stack[stack.length - 2].precedence) {
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
        let i = stack.length - 1;
        let node = stack[i];
        while (i > 1) {
            node = this.createNode(stack[i - 1].value, stack[i - 2], node);
            i -= 2;
        }
        return node;
    }

    eatToken():any {
        this.eatSpaces();
        const ch = this.charCodeAt();
        if (ch === VARIABLE_BEGIN_CODE) {
            // 变量
            return this.eatVariable();
        } else if (this.isDigit(ch) || ch === PERIOD_CODE) {
            // 数字
            return this.eatNumber();
        } else if (ch === SINGLE_QUOTE_CODE || ch === DOUBLE_QUOTE_CODE) {
            // 字符串
            return this.eatString();
        } else if (ch === OPEN_PAREN_CODE) {
            // 括号
            return this.eatGroup();
        } else {
            // 检查单操作符 ！+ -
            let toCheck = this.expr.slice(this.index, maxUnaryOperatorLength);
            let toCheckMaxLen = toCheck.length;
            // let toCheck = this.expr.substr(this.index, maxUnaryOperatorLength);
            let toCheckLength;
            while (toCheckLength = toCheckMaxLen) {
                if (
                    UNARY_OPERATORS.hasOwnProperty(toCheck) &&
                    this.index + toCheckLength <= this.expr.length
                ) {
                    this.index += toCheckLength;
                    return {
                        type: 'UNARY_EXP',
                        operator: toCheck,
                        argument: this.eatToken(),
                    };
                }
                // toCheck = toCheck.substr(0, --toCheckLength);
                toCheck = toCheck.slice(0, --toCheckLength);
            }
        }
    }
    eatGroup() {
        this.index++; // eat "("
        const node = this.eatExpression();
        this.eatSpaces();
        const ch = this.charCodeAt();
        if (ch !== CLOSE_PAREN_CODE) {
            throw new Error('括号没有闭合');
        } else {
            this.index++; // eat ")"
            return node;
        }
    }
    //查询变量
    eatVariable() {
        const ch = this.charAt();
        this.index++; // eat "@"
        const start = this.index;
        while (this.index < this.expr.length) {
            const ch = this.charCodeAt();
            if (this.isVariablePart(ch)) {
                this.index++;
            } else {
                break;
            }
        }
        const identifier = this.expr.slice(start, this.index);
        return {
            type: 'VARIABLE',
            value: identifier,
            raw: ch + identifier,
        };
    }
    //查询数值
    eatNumber() {
        let number = '';
        // 数字开头
        while (this.isDigit(this.charCodeAt())) {
            number += this.charAt(this.index++);
        }
        // '.'开头
        if (this.charCodeAt() === PERIOD_CODE) {
            number += this.charAt(this.index++);
            while (this.isDigit(this.charCodeAt())) {
                number += this.charAt(this.index++);
            }
        }
        // 科学计数法
        let ch = this.charAt();
        if (ch === 'e' || ch === 'E') {
            number += this.charAt(this.index++);
            ch = this.charAt();
            if (ch === '+' || ch === '-') {
                number += this.charAt(this.index++);
            }
            while (this.isDigit(this.charCodeAt())) {
                number += this.charAt(this.index++);
            }
            // 如果e + - 后无数字，报错
            if (!this.isDigit(this.charCodeAt(this.index - 1))) {
                throw new Error(`非法数字(${number}${this.charAt()})，缺少指数`);
            }
        }

        return {
            type: 'NUMBER',
            value: parseFloat(number),
            raw: number,
        };
    }
    eatString() {
        let str = '';
        const quote = this.charAt(this.index++);
        let closed = false;
        while (this.index < this.expr.length) {
            let ch = this.charAt(this.index++);
            if (ch === quote) {
                closed = true;
                break;
            } else if (ch === '\\') {
                // Check for all of the common escape codes
                ch = this.charAt(this.index++);
                switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;
                    default:
                        str += ch;
                }
            } else {
                str += ch;
            }
        }

        if (!closed) {
            throw new Error(`字符"${str}"缺少闭合括号`);
        }

        return {
            type: 'STRING',
            value: str,
            raw: quote + str + quote,
        };
    }


    /**
     * 判断二元操作符
     */
    eatBinaryOperator() {
        this.eatSpaces();
        let toCheck = this.expr.slice(this.index, maxBinaryOperatorLength);
        // let toCheck = this.expr.substr(this.index, maxBinaryOperatorLength);
        let toCheckLength = toCheck.length;
        while (toCheckLength) {
            if (
                BINARY_OPERATORS.hasOwnProperty(toCheck) &&
                this.index + toCheckLength <= this.expr.length
            ) {
                this.index += toCheckLength;
                return toCheck;
            }
            toCheck = toCheck.slice(0, --toCheckLength);
            // toCheck = toCheck.substr(0, --toCheckLength);
        }
        return false;
    }

    /**
     *
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
    createNode(operator:string, left:any, right:any) {
        const type = LOGICAL_OPERATORS.indexOf(operator) !== -1
            ? 'LOGICAL_EXP'
            : 'BINARY_EXP';
        return {
            type,
            operator,
            left,
            right,
        };
    }

    public onErrorCallback?:Function;
    onError(callback:Function) {
        this.onErrorCallback = callback;
        return this;
    }

    /**
     * 是否变量值部分
     * @param ch
     */
    isVariablePart(ch:number) {
        return (ch >= 65 && ch <= 90) || // A...Z
            (ch >= 97 && ch <= 122) || // a...z
            (ch >= 48 && ch <= 57); // 0...9
    }

    /**
     * 是否数字
     * @param ch
     */
    isDigit(ch:number) {
        return ch >= 48 && ch <= 57; // 0...9
    }


    //判断是否空格
    eatSpaces() {
        let ch = this.charCodeAt();
        while (SPACE_CODES.indexOf(ch) !== -1) {
            ch = this.charCodeAt(++this.index);
        }
    }
    charAt(index = this.index) {
        return this.expr.charAt(index);
    }

    charCodeAt(index = this.index) {
        return this.expr.charCodeAt(index);
    }

    public tokens:any = null;
    valueOf(scope = {}) {
        if (this.tokens == null) {
            return undefined;
        }
        const value = this.getNodeValue(this.tokens, scope);
        return !!value;
    }
    valueOf1(scope = {}) {
        if (this.tokens == null) {
            return undefined;
        }
        const value = this.getNodeValue(this.tokens, scope);
        return value;
    }
    getNodeValue(node:any, scope:any = {}):any {
        const {type, value, left, right, operator} = node;
        if (type === 'VARIABLE') {
            return scope[value];
        } else if (type === 'NUMBER' || type === 'STRING') {
            return value;
        }
        else if (type === 'LOGICAL_EXP') {
            const leftValue = this.getNodeValue(left, scope);
            // 如果是逻辑运算的&&和||，那么可能不需要解析右边的值
            if (operator === '&&' && !leftValue) {
                return false;
            }
            if (operator === '||' && !!leftValue) {
                return true;
            }
            const rightValue = this.getNodeValue(right, scope);
            switch (node.operator) {
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
                case 'include':
                    return leftValue.toString &&
                        rightValue.toString &&
                        leftValue.toString().indexOf(rightValue.toString()) !== -1;
                // skip default case
            }
        } else if (type === 'BINARY_EXP') {
            const leftValue = this.getNodeValue(left, scope);
            const rightValue = this.getNodeValue(right, scope);
            switch (node.operator) {
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
                // skip default case
            }
        } else if (type === 'UNARY_EXP') {
            switch (node.operator) {
                case '!':
                    return !this.getNodeValue(node.argument, scope);
                case '+':
                    return +this.getNodeValue(node.argument, scope);
                case '-':
                    return -this.getNodeValue(node.argument, scope);
                // skip default case
            }
        }
    }
}
