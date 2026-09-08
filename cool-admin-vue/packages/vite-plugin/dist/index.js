(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path'), require('prettier'), require('axios'), require('lodash'), require('@vue/compiler-sfc'), require('magic-string'), require('glob'), require('node:util'), require('svgo'), require('postcss-value-parser')) :
    typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path', 'prettier', 'axios', 'lodash', '@vue/compiler-sfc', 'magic-string', 'glob', 'node:util', 'svgo', 'postcss-value-parser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.index = {}, global.fs, global.path, global.prettier, global.axios, global.lodash, global.compilerSfc, global.magicString, global.glob, global.util, global.svgo, global.valueParser));
})(this, (function (exports, fs, path, prettier, axios, lodash, compilerSfc, magicString, glob, util, svgo, valueParser) { 'use strict';

    const config = {
        type: "admin",
        reqUrl: "",
        nameTag: true,
        eps: {
            enable: true,
            api: "",
            dist: "./build/cool",
            mapping: [
                {
                    // 自定义匹配
                    custom: ({ propertyName, type }) => {
                        // 如果没有，返回null或者不返回，则继续遍历其他匹配规则
                        return null;
                    },
                },
                {
                    type: "string",
                    test: ["varchar", "text", "simple-json"],
                },
                {
                    type: "string[]",
                    test: ["simple-array"],
                },
                {
                    type: "Date",
                    test: ["datetime", "date"],
                },
                {
                    type: "number",
                    test: ["tinyint", "int", "decimal"],
                },
                {
                    type: "BigInt",
                    test: ["bigint"],
                },
                {
                    type: "any",
                    test: ["json"],
                },
            ],
        },
        svg: {
            skipNames: ["base"],
        },
        tailwind: {
            enable: true,
            remUnit: 14,
            remPrecision: 6,
            rpxRatio: 2,
            darkTextClass: "dark:text-surface-50",
        },
        uniapp: {
            isPlugin: false,
        },
        clean: false,
        utsPlatform: "web",
    };

    // 根目录
    function rootDir(path$1) {
        switch (config.type) {
            case "app":
            case "uniapp-x":
                return path.join(process.env.UNI_INPUT_DIR, path$1);
            default:
                return path.join(process.cwd(), path$1);
        }
    }
    // 首字母大写
    function firstUpperCase(value) {
        return value.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
            return $1.toUpperCase() + $2;
        });
    }
    // 横杠转驼峰
    function toCamel(str) {
        return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
            return $1 + $2.toUpperCase();
        });
    }
    // 创建目录
    function createDir(path, recursive) {
        try {
            if (!fs.existsSync(path))
                fs.mkdirSync(path, { recursive });
        }
        catch (err) { }
    }
    // 读取文件
    function readFile(path, json) {
        try {
            const content = fs.readFileSync(path, "utf8");
            return json ? JSON.parse(removeJsonComments(content)) : content;
        }
        catch (err) { }
        return "";
    }
    // 安全地移除JSON中的注释
    function removeJsonComments(content) {
        let result = "";
        let inString = false;
        let stringChar = "";
        let escaped = false;
        let i = 0;
        while (i < content.length) {
            const char = content[i];
            const nextChar = content[i + 1];
            // 处理字符串状态
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                result += char;
            }
            else if (inString && char === stringChar && !escaped) {
                inString = false;
                stringChar = "";
                result += char;
            }
            else if (inString) {
                // 在字符串内，直接添加字符
                result += char;
                escaped = char === "\\" && !escaped;
            }
            else {
                // 不在字符串内，检查注释
                if (char === "/" && nextChar === "/") {
                    // 单行注释，跳过到行尾
                    while (i < content.length && content[i] !== "\n") {
                        i++;
                    }
                    if (i < content.length) {
                        result += content[i]; // 保留换行符
                    }
                }
                else if (char === "/" && nextChar === "*") {
                    // 多行注释，跳过到 */
                    i += 2;
                    while (i < content.length - 1) {
                        if (content[i] === "*" && content[i + 1] === "/") {
                            i += 2;
                            break;
                        }
                        i++;
                    }
                    continue;
                }
                else {
                    result += char;
                    escaped = false;
                }
            }
            i++;
        }
        return result;
    }
    // 写入文件
    function writeFile(path, data) {
        try {
            return fs.writeFileSync(path, data);
        }
        catch (err) { }
        return "";
    }
    // 解析body
    function parseJson(req) {
        return new Promise((resolve) => {
            let d = "";
            req.on("data", function (chunk) {
                d += chunk;
            });
            req.on("end", function () {
                try {
                    resolve(JSON.parse(d));
                }
                catch {
                    resolve({});
                }
            });
        });
    }
    // 格式化内容
    function formatContent(content, options) {
        return prettier.format(content, {
            parser: "typescript",
            useTabs: true,
            tabWidth: 4,
            endOfLine: "lf",
            semi: true,
            ...options,
        });
    }
    function error(message) {
        console.log("\x1B[31m%s\x1B[0m", message);
    }

    /**
     * 将模板字符串扁平化处理，转换为 Service 类型定义
     * @param template - 包含 Service 类型定义的模板字符串
     * @returns 处理后的 Service 类型定义字符串
     * @throws {Error} 当模板中找不到 Service 类型定义时抛出错误
     */
    function flatten(template) {
        // 查找 Service 类型定义的起始位置
        const startIndex = template.indexOf("export type Service = {");
        // 保留 Service 类型定义前的内容
        let header = template.substring(0, startIndex);
        // 获取 Service 类型定义及其内容，去除换行和制表符
        const serviceTemplateContent = template.substring(startIndex).replace(/\n|\t/g, "");
        // 找到 Service 的内容部分
        const serviceStartIndex = serviceTemplateContent.indexOf("{") + 1;
        const serviceEndIndex = findClosingBrace(serviceTemplateContent, serviceStartIndex);
        const serviceInnerContent = serviceTemplateContent
            .substring(serviceStartIndex, serviceEndIndex)
            .trim();
        // 存储所有接口定义
        const allInterfaces = new Map();
        // 处理 Service 内容，保持原有结构但替换嵌套对象为接口引用
        const serviceContent = buildCurrentLevelContent(serviceInnerContent);
        // 递归收集所有需要生成的接口
        flattenContent(serviceInnerContent, allInterfaces);
        // 生成所有接口定义
        let interfaces = "";
        allInterfaces.forEach((content, key) => {
            interfaces += `\nexport interface ${firstUpperCase(key)}Interface { ${content} }\n`;
        });
        return `${header}${interfaces}\nexport type Service = { ${serviceContent} }`;
    }
    /**
     * 查找匹配的右花括号位置
     * @param str - 要搜索的字符串
     * @param startIndex - 开始搜索的位置
     * @returns 匹配的右花括号位置
     * @throws {Error} 当找不到匹配的右花括号时抛出错误
     */
    function findClosingBrace(str, startIndex) {
        let braceCount = 1;
        let currentIndex = startIndex;
        while (currentIndex < str.length && braceCount > 0) {
            if (str[currentIndex] === "{")
                braceCount++;
            if (str[currentIndex] === "}")
                braceCount--;
            currentIndex++;
        }
        if (braceCount !== 0) {
            throw new Error("Unmatched braces in the template");
        }
        return currentIndex - 1;
    }
    /**
     * 递归收集所有需要生成的接口
     * @param content - 要处理的内容
     * @param allInterfaces - 存储所有接口定义的 Map
     * @param parentFields - 父级字段数组（暂未使用）
     */
    function flattenContent(content, allInterfaces, parentFields) {
        const interfacePattern = /(\w+)\s*:\s*\{/g;
        let match;
        while ((match = interfacePattern.exec(content)) !== null) {
            const key = match[1];
            const startIndex = match.index + match[0].length;
            const endIndex = findClosingBrace(content, startIndex);
            if (endIndex > startIndex) {
                const innerContent = content.substring(startIndex, endIndex).trim();
                // 构建当前接口的内容，将嵌套对象替换为接口引用
                const currentLevelContent = buildCurrentLevelContent(innerContent);
                allInterfaces.set(key, currentLevelContent);
                // 递归处理嵌套内容
                flattenContent(innerContent, allInterfaces);
            }
        }
    }
    /**
     * 构建当前级别的内容，将嵌套对象替换为接口引用
     * @param content - 内容字符串
     * @returns 处理后的内容
     */
    function buildCurrentLevelContent(content) {
        const interfacePattern = /(\w+)\s*:\s*\{/g;
        let result = content;
        let match;
        // 重置正则表达式的 lastIndex
        interfacePattern.lastIndex = 0;
        while ((match = interfacePattern.exec(content)) !== null) {
            const key = match[1];
            const startIndex = match.index + match[0].length;
            const endIndex = findClosingBrace(content, startIndex);
            if (endIndex > startIndex) {
                const fullMatch = content.substring(match.index, endIndex + 1);
                const replacement = `${key}: ${firstUpperCase(key)}Interface;`;
                result = result.replace(fullMatch, replacement);
            }
        }
        // 清理多余的分号和空格
        result = result.replace(/;+/g, ";").replace(/\s+/g, " ").trim();
        return result;
    }

    /**
     * 获取动态类名
     */
    const getDynamicClassNames = (value) => {
        const names = new Set();
        // 匹配函数调用中的对象参数（如 parseClass({'!bg-surface-50': hoverable})）
        const functionCallRegex = /\w+\s*\(\s*\{([^}]*)\}\s*\)/gs;
        let funcMatch;
        while ((funcMatch = functionCallRegex.exec(value)) !== null) {
            const objContent = funcMatch[1];
            // 提取对象中的键
            const keyRegex = /['"](.*?)['"]\s*:/gs;
            let keyMatch;
            while ((keyMatch = keyRegex.exec(objContent)) !== null) {
                keyMatch[1].trim() && names.add(keyMatch[1]);
            }
        }
        // 匹配对象键（如 { 'text-a': 1 }）- 优化版本，避免跨行错误匹配
        const objKeyRegex = /[{,]\s*['"](.*?)['"]\s*:/gs;
        let objKeyMatch;
        while ((objKeyMatch = objKeyRegex.exec(value)) !== null) {
            const className = objKeyMatch[1].trim();
            // 确保是有效的CSS类名，避免匹配到错误内容
            if (className && !className.includes("\n") && !className.includes("\t")) {
                names.add(className);
            }
        }
        // 匹配数组中的字符串元素（如 'text-center'）- 优化版本
        const arrayStringRegex = /(?:^|[,\[\s])\s*['"](.*?)['"]/gs;
        let arrayMatch;
        while ((arrayMatch = arrayStringRegex.exec(value)) !== null) {
            const className = arrayMatch[1].trim();
            // 确保是有效的CSS类名
            if (className && !className.includes("\n") && !className.includes("\t")) {
                names.add(className);
            }
        }
        // 匹配三元表达式中的字符串（如 'dark' 和 'light'）
        const ternaryRegex = /(\?|:)\s*['"](.*?)['"]/gs;
        let ternaryMatch;
        while ((ternaryMatch = ternaryRegex.exec(value)) !== null) {
            ternaryMatch[2].trim() && names.add(ternaryMatch[2]);
        }
        // 匹配反引号模板字符串 - 改进版本
        const templateRegex = /`([^`]*)`/gs;
        let templateMatch;
        while ((templateMatch = templateRegex.exec(value)) !== null) {
            const templateContent = templateMatch[1];
            // 提取模板字符串中的普通文本部分（排除 ${} 表达式）
            const textParts = templateContent.split(/\$\{[^}]*\}/);
            textParts.forEach((part) => {
                part.trim()
                    .split(/\s+/)
                    .forEach((className) => {
                    className.trim() && names.add(className.trim());
                });
            });
            // 提取模板字符串中 ${} 表达式内的字符串
            const expressionRegex = /\$\{([^}]*)\}/gs;
            let expressionMatch;
            while ((expressionMatch = expressionRegex.exec(templateContent)) !== null) {
                const expression = expressionMatch[1];
                // 递归处理表达式中的动态类名
                getDynamicClassNames(expression).forEach((name) => names.add(name));
            }
        }
        // 处理混合字符串（模板字符串 + 普通文本），如 "`text-red-900` text-red-1000"
        const mixedStringRegex = /`[^`]*`\s+([a-zA-Z0-9\-_\s]+)/g;
        let mixedMatch;
        while ((mixedMatch = mixedStringRegex.exec(value)) !== null) {
            const additionalClasses = mixedMatch[1].trim().split(/\s+/);
            additionalClasses.forEach((className) => {
                className.trim() && names.add(className.trim());
            });
        }
        // 处理普通字符串，多个类名用空格分割
        const stringRegex = /['"]([\w\s\-!:\/]+?)['"]/gs;
        let stringMatch;
        while ((stringMatch = stringRegex.exec(value)) !== null) {
            const classNames = stringMatch[1].trim().split(/\s+/);
            classNames.forEach((className) => {
                className.trim() && names.add(className.trim());
            });
        }
        return Array.from(names);
    };
    /**
     * 获取类名
     */
    function getClassNames(code) {
        // 修改正则表达式以支持多行匹配，避免内层引号冲突
        const classRegex = /(?:class|:class|:pt|:hover-class)\s*=\s*(['"`])((?:[^'"`\\]|\\.|`[^`]*`|'[^']*'|"[^"]*")*?)\1/gis;
        const classNames = new Set();
        let match;
        while ((match = classRegex.exec(code)) !== null) {
            const attribute = match[0].split("=")[0].trim();
            const isStaticClass = attribute === "class" || attribute === "hover-class";
            const isPtAttribute = attribute.includes("pt");
            const value = match[2].trim();
            if (isStaticClass) {
                // 处理静态 class 和 hover-class
                value.split(/\s+/).forEach((name) => name && classNames.add(name));
            }
            else if (isPtAttribute) {
                // 处理 :pt 属性中的 className
                parseClasNameFromPt(value, classNames);
            }
            else {
                // 处理动态 :class 和 :hover-class
                getDynamicClassNames(value).forEach((name) => classNames.add(name));
            }
        }
        return Array.from(classNames);
    }
    /**
     * 从 :pt 属性中解析 className
     */
    function parseClasNameFromPt(value, classNames) {
        // 递归查找所有 className 属性
        const classNameRegex = /className\s*:\s*/g;
        let match;
        while ((match = classNameRegex.exec(value)) !== null) {
            const startPos = match.index + match[0].length;
            const classNameValue = extractComplexValue(value, startPos);
            if (classNameValue) {
                // 如果是字符串字面量
                if (classNameValue.startsWith('"') ||
                    classNameValue.startsWith("'") ||
                    classNameValue.startsWith("`")) {
                    if (classNameValue.startsWith("`")) {
                        // 处理模板字符串
                        getDynamicClassNames(classNameValue).forEach((name) => classNames.add(name));
                    }
                    else {
                        // 处理普通字符串
                        const strMatch = classNameValue.match(/['"](.*?)['"]/);
                        if (strMatch) {
                            strMatch[1].split(/\s+/).forEach((name) => name && classNames.add(name));
                        }
                    }
                }
                else {
                    // 处理动态值（如函数调用、对象等）
                    getDynamicClassNames(classNameValue).forEach((name) => classNames.add(name));
                }
            }
        }
    }
    /**
     * 提取复杂值（支持嵌套引号和括号）
     */
    function extractComplexValue(text, startPos) {
        let pos = startPos;
        let depth = 0;
        let inString = false;
        let stringChar = "";
        let result = "";
        // 跳过开头的空白字符
        while (pos < text.length && /\s/.test(text[pos])) {
            pos++;
        }
        while (pos < text.length) {
            const char = text[pos];
            if (!inString) {
                if (char === '"' || char === "'" || char === "`") {
                    inString = true;
                    stringChar = char;
                    result += char;
                }
                else if (char === "{" || char === "(" || char === "[") {
                    depth++;
                    result += char;
                }
                else if (char === "}" || char === ")" || char === "]") {
                    if (depth === 0 && char === "}") {
                        // 遇到顶层的 } 时结束
                        break;
                    }
                    depth--;
                    result += char;
                }
                else if (char === "," && depth === 0) {
                    // 遇到顶层的逗号时结束
                    break;
                }
                else if (char === "\n" && depth === 0 && result.trim() !== "") {
                    // 如果遇到换行且不在嵌套结构中，且已有内容，则结束
                    break;
                }
                else {
                    result += char;
                }
            }
            else {
                result += char;
                if (char === stringChar && text[pos - 1] !== "\\") {
                    inString = false;
                    stringChar = "";
                    // 如果字符串结束且depth为0，检查是否应该结束
                    if (depth === 0) {
                        // 看看下一个非空白字符是什么
                        let nextPos = pos + 1;
                        while (nextPos < text.length && /\s/.test(text[nextPos])) {
                            nextPos++;
                        }
                        if (nextPos < text.length && (text[nextPos] === "," || text[nextPos] === "}")) {
                            // 如果下一个字符是逗号或右括号，则结束
                            break;
                        }
                    }
                }
            }
            pos++;
        }
        return result.trim() || null;
    }
    /**
     * 获取 class 内容
     */
    function getClassContent(code) {
        // 修改正则表达式以支持多行匹配，避免内层引号冲突
        const regex = /(?:class|:class|:pt|:hover-class)\s*=\s*(['"`])((?:[^'"`\\]|\\.|`[^`]*`|'[^']*'|"[^"]*")*?)\1/gis;
        const texts = [];
        let match;
        while ((match = regex.exec(code)) !== null) {
            const attribute = match[0].split("=")[0].trim();
            const isPtAttribute = attribute.includes("pt");
            const value = match[2];
            if (isPtAttribute) {
                // 手动解析 className 值
                const classNameRegex = /className\s*:\s*/g;
                let classNameMatchResult;
                while ((classNameMatchResult = classNameRegex.exec(value)) !== null) {
                    const startPos = classNameMatchResult.index + classNameMatchResult[0].length;
                    const classNameValue = extractComplexValue(value, startPos);
                    if (classNameValue) {
                        texts.push(classNameValue);
                    }
                }
            }
            else {
                texts.push(value);
            }
        }
        return texts;
    }
    /**
     * 获取节点
     */
    function getNodes(code) {
        const nodes = [];
        // 找到所有顶级template标签的完整内容
        function findTemplateContents(content) {
            const results = [];
            let index = 0;
            while (index < content.length) {
                const templateStart = content.indexOf("<template", index);
                if (templateStart === -1)
                    break;
                // 找到模板标签的结束位置
                const tagEnd = content.indexOf(">", templateStart);
                if (tagEnd === -1)
                    break;
                // 使用栈来匹配配对的template标签
                let stack = 1;
                let currentPos = tagEnd + 1;
                while (currentPos < content.length && stack > 0) {
                    const nextTemplateStart = content.indexOf("<template", currentPos);
                    const nextTemplateEnd = content.indexOf("</template>", currentPos);
                    if (nextTemplateEnd === -1)
                        break;
                    // 如果开始标签更近，说明有嵌套
                    if (nextTemplateStart !== -1 && nextTemplateStart < nextTemplateEnd) {
                        // 找到开始标签的完整结束
                        const nestedTagEnd = content.indexOf(">", nextTemplateStart);
                        if (nestedTagEnd !== -1) {
                            stack++;
                            currentPos = nestedTagEnd + 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        // 找到结束标签
                        stack--;
                        currentPos = nextTemplateEnd + 11; // '</template>'.length
                    }
                }
                if (stack === 0) {
                    // 提取template内容（不包括template标签本身）
                    const templateContent = content.substring(tagEnd + 1, currentPos - 11);
                    results.push(templateContent);
                    index = currentPos;
                }
                else {
                    // 如果没有找到匹配的结束标签，跳过这个开始标签
                    index = tagEnd + 1;
                }
            }
            return results;
        }
        // 递归提取所有template内容中的节点
        function extractNodesFromContent(content) {
            // 先提取当前内容中的所有标签
            const regex = /<([^>]+)>/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                if (!match[1].startsWith("/") && !match[1].startsWith("template")) {
                    nodes.push(match[1]);
                }
            }
            // 递归处理嵌套的template
            const nestedTemplates = findTemplateContents(content);
            nestedTemplates.forEach((templateContent) => {
                extractNodesFromContent(templateContent);
            });
        }
        // 获取所有顶级template内容
        const templateContents = findTemplateContents(code);
        // 处理每个template内容
        templateContents.forEach((templateContent) => {
            extractNodesFromContent(templateContent);
        });
        return nodes.map((e) => `<${e}>`);
    }
    /**
     * 添加 script 标签内容
     */
    function addScriptContent(code, content) {
        const scriptMatch = /<script\b[^>]*>([\s\S]*?)<\/script>/g.exec(code);
        if (!scriptMatch) {
            return code;
        }
        const scriptContent = scriptMatch[1];
        const scriptStartIndex = scriptMatch.index + scriptMatch[0].indexOf(">") + 1;
        const scriptEndIndex = scriptStartIndex + scriptContent.length;
        return (code.substring(0, scriptStartIndex) +
            "\n" +
            content +
            "\n" +
            scriptContent.trim() +
            code.substring(scriptEndIndex));
    }
    /**
     * 判断是否为 Tailwind 类名
     */
    function isTailwindClass(className) {
        const prefixes = [
            // 布局
            "container",
            "flex",
            "grid",
            "block",
            "inline",
            "hidden",
            "visible",
            // 间距
            "p-",
            "px-",
            "py-",
            "pt-",
            "pr-",
            "pb-",
            "pl-",
            "m-",
            "mx-",
            "my-",
            "mt-",
            "mr-",
            "mb-",
            "ml-",
            "space-",
            "gap-",
            // 尺寸
            "w-",
            "h-",
            "min-w-",
            "max-w-",
            "min-h-",
            "max-h-",
            // 颜色
            "bg-",
            "text-",
            "border-",
            "ring-",
            "shadow-",
            // 边框
            "border",
            "rounded",
            "ring",
            // 字体
            "font-",
            "text-",
            "leading-",
            "tracking-",
            "antialiased",
            // 定位
            "absolute",
            "relative",
            "fixed",
            "sticky",
            "static",
            "top-",
            "right-",
            "bottom-",
            "left-",
            "inset-",
            "z-",
            // 变换
            "transform",
            "translate-",
            "rotate-",
            "scale-",
            "skew-",
            // 过渡
            "transition",
            "duration-",
            "ease-",
            "delay-",
            // 交互
            "cursor-",
            "select-",
            "pointer-events-",
            // 溢出
            "overflow-",
            "truncate",
            // 滚动
            "scroll-",
            // 伪类和响应式
            "hover:",
            "focus:",
            "active:",
            "disabled:",
            "group-hover:",
        ];
        const statePrefixes = ["dark:", "dark:!", "light:", "sm:", "md:", "lg:", "xl:", "2xl:"];
        if (className.startsWith("!") && !className.includes("!=")) {
            return true;
        }
        for (const prefix of prefixes) {
            if (className.startsWith(prefix)) {
                return true;
            }
            for (const statePrefix of statePrefixes) {
                if (className.startsWith(statePrefix + prefix)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 将 interface 转换为 type
     */
    function interfaceToType(code) {
        // 匹配 interface 定义
        const interfaceRegex = /interface\s+(\w+)(\s*extends\s+\w+)?\s*\{([^}]*)\}/g;
        // 将 interface 转换为 type
        return code.replace(interfaceRegex, (match, name, extends_, content) => {
            // 处理可能存在的 extends
            const extendsStr = extends_ ? extends_ : "";
            // 返回转换后的 type 定义
            return `type ${name}${extendsStr} = {${content}}`;
        });
    }

    // 全局 service 对象，用于存储服务结构
    const service = {};
    // eps 实体列表
    let list = [];
    /**
     * 获取 eps 请求地址
     * @returns {string} eps url
     */
    function getEpsUrl() {
        let url = config.eps.api;
        if (!url) {
            url = config.type;
        }
        switch (url) {
            case "app":
            case "uniapp-x":
                url = "/app/base/comm/eps";
                break;
            case "admin":
                url = "/admin/base/open/eps";
                break;
        }
        return url;
    }
    /**
     * 获取 eps 路径
     * @param filename 文件名
     * @returns {string} 完整路径
     */
    function getEpsPath(filename) {
        return path.join(config.type == "admin" ? config.eps.dist : rootDir(config.eps.dist), filename || "");
    }
    /**
     * 获取对象方法名（排除 namespace、permission 字段）
     * @param v 对象
     * @returns {string[]} 方法名数组
     */
    function getNames(v) {
        return Object.keys(v).filter((e) => !["namespace", "permission"].includes(e));
    }
    /**
     * 获取字段类型
     */
    function getType({ propertyName, type }) {
        for (const map of config.eps.mapping) {
            if (map.custom) {
                const resType = map.custom({ propertyName, type });
                if (resType)
                    return resType;
            }
            if (map.test) {
                if (map.test.includes(type))
                    return map.type;
            }
        }
        return type;
    }
    /**
     * 格式化方法名，去除特殊字符
     */
    function formatName(name) {
        return (name || "").replace(/[:,\s,\/,-]/g, "");
    }
    /**
     * 检查方法名是否合法（不包含特殊字符）
     */
    function checkName(name) {
        return name && !["{", "}", ":"].some((e) => name.includes(e));
    }
    /**
     * 不支持 uniapp-x 平台显示
     */
    function noUniappX(text, defaultText = "") {
        if (config.type == "uniapp-x") {
            return defaultText;
        }
        else {
            return text;
        }
    }
    /**
     * 查找字段
     * @param sources 字段 source 数组
     * @param item eps 实体
     * @returns {Eps.Column[]} 字段数组
     */
    function findColumns(sources, item) {
        const columns = [item.columns, item.pageColumns].flat().filter(Boolean);
        return (sources || [])
            .map((e) => columns.find((c) => c.source == e))
            .filter(Boolean);
    }
    /**
     * 使用 prettier 格式化 TypeScript 代码
     * @param text 代码文本
     * @returns {Promise<string|null>} 格式化后的代码
     */
    async function formatCode(text) {
        return prettier
            .format(text, {
            parser: "typescript",
            useTabs: true,
            tabWidth: 4,
            endOfLine: "lf",
            semi: true,
            singleQuote: false,
            printWidth: 100,
            trailingComma: "none",
        })
            .catch((err) => {
            console.log(err);
            error(`[cool-eps] File format error, please try again`);
            return null;
        });
    }
    /**
     * 获取 eps 数据（本地优先，远程兜底）
     */
    async function getData() {
        // 读取本地 eps.json
        list = readFile(getEpsPath("eps.json"), true) || [];
        // 拼接请求地址
        const url = config.reqUrl + getEpsUrl();
        // 请求远程 eps 数据
        await axios
            .get(url, {
            timeout: 5000,
        })
            .then((res) => {
            const { code, data, message } = res.data;
            if (code === 1000) {
                if (!lodash.isEmpty(data) && data) {
                    list = lodash.values(data).flat();
                }
            }
            else {
                error(`[cool-eps] ${message || "Failed to fetch data"}`);
            }
        })
            .catch(() => {
            error(`[cool-eps] API service is not running → ${url}`);
        });
        // 初始化处理，补全缺省字段
        list.forEach((e) => {
            if (!e.namespace)
                e.namespace = "";
            if (!e.api)
                e.api = [];
            if (!e.columns)
                e.columns = [];
            if (!e.search) {
                e.search = {
                    fieldEq: findColumns(e.pageQueryOp?.fieldEq, e),
                    fieldLike: findColumns(e.pageQueryOp?.fieldLike, e),
                    keyWordLikeFields: findColumns(e.pageQueryOp?.keyWordLikeFields, e),
                };
            }
        });
        if (config.type == "uniapp-x" || config.type == "app") {
            list = list.filter((e) => e.prefix.startsWith("/app") || e.prefix.startsWith("/admin"));
        }
    }
    /**
     * 创建 eps.json 文件
     * @returns {boolean} 是否有更新
     */
    function createJson() {
        let data = [];
        if (config.type != "uniapp-x") {
            data = list.map((e) => {
                return {
                    prefix: e.prefix,
                    name: e.name || "",
                    api: e.api.map((apiItem) => ({
                        name: apiItem.name,
                        method: apiItem.method,
                        path: apiItem.path,
                    })),
                    search: e.search,
                };
            });
        }
        else {
            data = list;
        }
        const content = JSON.stringify(data);
        const local_content = readFile(getEpsPath("eps.json"));
        // 判断是否需要更新
        const isUpdate = content != local_content;
        if (isUpdate) {
            fs.createWriteStream(getEpsPath("eps.json"), {
                flags: "w",
            }).write(content);
        }
        return isUpdate;
    }
    /**
     * 创建 eps 类型描述文件（d.ts/ts）
     * @param param0 list: eps实体列表, service: service对象
     */
    async function createDescribe({ list, service }) {
        /**
         * 创建 Entity 接口定义
         */
        function createEntity() {
            const ignore = [];
            let t0 = "";
            for (const item of list) {
                if (!checkName(item.name))
                    continue;
                if (formatName(item.name) == "BusinessInterface") {
                    console.log(111);
                }
                let t = `interface ${formatName(item.name)} {`;
                // 合并 columns 和 pageColumns，去重
                const columns = lodash.uniqBy(lodash.compact([...(item.columns || []), ...(item.pageColumns || [])]), "source");
                for (const col of columns || []) {
                    t += `
					/**
					 * ${col.comment}
					 */
					${col.propertyName}?: ${getType({
                    propertyName: col.propertyName,
                    type: col.type,
                })};
				`;
                }
                t += `
				/**
				 * 任意键值
				 */
				[key: string]: any;
			}
			`;
                if (!ignore.includes(item.name)) {
                    ignore.push(item.name);
                    t0 += t + "\n\n";
                }
            }
            return t0;
        }
        /**
         * 创建 Controller 接口定义
         */
        async function createController() {
            let controller = "";
            let chain = "";
            let pageResponse = "";
            /**
             * 递归处理 service 树，生成接口定义
             * @param d 当前节点
             * @param k 前缀
             */
            function deep(d, k) {
                if (!k)
                    k = "";
                for (const i in d) {
                    const name = k + toCamel(firstUpperCase(formatName(i)));
                    // 检查方法名
                    if (!checkName(name))
                        continue;
                    if (d[i].namespace) {
                        // 查找配置
                        const item = list.find((e) => (e.prefix || "") === `/${d[i].namespace}`);
                        if (item) {
                            //
                            let t = `interface ${name} {`;
                            // 插入方法
                            if (item.api) {
                                // 权限列表
                                const permission = [];
                                item.api.forEach((a) => {
                                    // 方法名
                                    const n = toCamel(formatName(a.name || lodash.last(a.path.split("/"))));
                                    // 检查方法名
                                    if (!checkName(n))
                                        return;
                                    if (n) {
                                        // 参数类型
                                        let q = [];
                                        // 参数列表
                                        const { parameters = [] } = a.dts || {};
                                        parameters.forEach((p) => {
                                            if (p.description) {
                                                q.push(`\n/** ${p.description}  */\n`);
                                            }
                                            // 检查参数名
                                            if (!checkName(p.name)) {
                                                return false;
                                            }
                                            const a = `${p.name}${p.required ? "" : "?"}`;
                                            const b = `${p.schema.type || "string"}`;
                                            q.push(`${a}: ${b};`);
                                        });
                                        if (lodash.isEmpty(q)) {
                                            q = ["any"];
                                        }
                                        else {
                                            q.unshift("{");
                                            q.push("}");
                                        }
                                        // 返回类型
                                        let res = "";
                                        // 实体名
                                        const en = item.name || "any";
                                        switch (a.path) {
                                            case "/page":
                                                res = `${name}PageResponse`;
                                                pageResponse += `
												interface ${name}PageResponse {
													pagination: PagePagination;
													list: ${en}[];
												}
											`;
                                                break;
                                            case "/list":
                                                res = `${en} []`;
                                                break;
                                            case "/info":
                                                res = en;
                                                break;
                                            default:
                                                res = "any";
                                                break;
                                        }
                                        // 方法描述
                                        if (config.type == "uniapp-x") {
                                            t += `
											/**
											 * ${a.summary || n}
											 */
											${n}(data${q.length == 1 ? "?" : ""}: ${q.join("")}): Promise<any>;
										`;
                                        }
                                        else {
                                            t += `
											/**
											 * ${a.summary || n}
											 */
											${n}(data${q.length == 1 ? "?" : ""}: ${q.join("")}): Promise<${res}>;
										`;
                                        }
                                        if (!permission.includes(n)) {
                                            permission.push(n);
                                        }
                                    }
                                });
                                // 权限标识
                                t += noUniappX(`
								/**
								 * 权限标识
								 */
								permission: { ${permission.map((e) => `${e}: string;`).join("\n")} };
							`);
                                // 权限状态
                                t += noUniappX(`
								/**
								 * 权限状态
								 */
								_permission: { ${permission.map((e) => `${e}: boolean;`).join("\n")} };
							`);
                                // 请求
                                t += noUniappX(`
								request: Request;
							`);
                            }
                            t += "}\n\n";
                            controller += t;
                            chain += `${formatName(i)}: ${name};`;
                        }
                    }
                    else {
                        chain += `${formatName(i)}: {`;
                        deep(d[i], name);
                        chain += "};";
                    }
                }
            }
            // 遍历 service 树
            deep(service);
            return `
			type json = any;

			${await createDict()}

			interface PagePagination {
				size: number;
				page: number;
				total: number;
				[key: string]: any;
			};

			interface PageResponse<T> {
				pagination: PagePagination;
				list: T[];
				[key: string]: any;
			};

			${pageResponse}

			${controller}

			${noUniappX(`interface RequestOptions {
				url: string;
				method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
				data?: any;
				params?: any;
				headers?: any;
				timeout?: number;
				[key: string]: any;
			}`)}

			${noUniappX("type Request = (options: RequestOptions) => Promise<any>;")}

			type Service = {
				${noUniappX("request: Request;")}

				${chain}
			}
		`;
        }
        // 组装文件内容
        let text = `
		${createEntity()}
		${await createController()}
	`;
        // 文件名
        let name = "eps.d.ts";
        if (config.type == "uniapp-x") {
            name = "eps.ts";
            text = text
                .replaceAll("interface ", "export interface ")
                .replaceAll("type ", "export type ")
                .replaceAll("[key: string]: any;", "");
            text = flatten(text);
            text = interfaceToType(text);
        }
        else {
            text = `
			declare namespace Eps {
				${text}
			}
		`;
        }
        // 格式化文本内容
        const content = await formatCode(text);
        const local_content = readFile(getEpsPath(name));
        // 是否需要更新
        if (content && content != local_content && list.length > 0) {
            // 创建 eps 描述文件
            fs.createWriteStream(getEpsPath(name), {
                flags: "w",
            }).write(content);
        }
    }
    /**
     * 构建 service 对象树
     */
    function createService() {
        // 路径第一层作为 id 标识
        const id = getEpsUrl().split("/")[1];
        list.forEach((e) => {
            // 请求地址
            const path = e.prefix[0] == "/" ? e.prefix.substring(1, e.prefix.length) : e.prefix;
            // 分隔路径，去除 id，转驼峰
            const arr = path.replace(id, "").split("/").filter(Boolean).map(toCamel);
            /**
             * 递归构建 service 树
             * @param d 当前节点
             * @param i 当前索引
             */
            function deep(d, i) {
                const k = arr[i];
                if (k) {
                    // 是否最后一个
                    if (arr[i + 1]) {
                        if (!d[k]) {
                            d[k] = {};
                        }
                        deep(d[k], i + 1);
                    }
                    else {
                        // 不存在则创建
                        if (!d[k]) {
                            d[k] = {
                                permission: {},
                            };
                        }
                        if (!d[k].namespace) {
                            d[k].namespace = path;
                        }
                        // 创建权限
                        if (d[k].namespace) {
                            getNames(d[k]).forEach((i) => {
                                d[k].permission[i] =
                                    `${d[k].namespace.replace(`${id}/`, "")}/${i}`.replace(/\//g, ":");
                            });
                        }
                        // 创建搜索
                        d[k].search = e.search;
                        // 创建方法
                        e.api.forEach((a) => {
                            // 方法名
                            const n = a.path.replace("/", "");
                            if (n && !/[-:]/g.test(n)) {
                                d[k][n] = a;
                            }
                        });
                    }
                }
            }
            deep(service, 0);
        });
    }
    /**
     * 创建 service 代码
     * @returns {string} service 代码
     */
    function createServiceCode() {
        const types = [];
        let chain = "";
        /**
         * 递归处理 service 树，生成接口代码
         * @param d 当前节点
         * @param k 前缀
         */
        function deep(d, k) {
            if (!k)
                k = "";
            for (const i in d) {
                if (["swagger"].includes(i)) {
                    continue;
                }
                const name = k + toCamel(firstUpperCase(formatName(i)));
                // 检查方法名
                if (!checkName(name))
                    continue;
                if (d[i].namespace) {
                    // 查找配置
                    const item = list.find((e) => (e.prefix || "") === `/${d[i].namespace}`);
                    if (item) {
                        //
                        let t = `{`;
                        // 插入方法
                        if (item.api) {
                            item.api.forEach((a) => {
                                // 方法名
                                const n = toCamel(formatName(a.name || lodash.last(a.path.split("/"))));
                                // 检查方法名
                                if (!checkName(n))
                                    return;
                                if (n) {
                                    // 参数类型
                                    let q = [];
                                    // 参数列表
                                    const { parameters = [] } = a.dts || {};
                                    parameters.forEach((p) => {
                                        if (p.description) {
                                            q.push(`\n/** ${p.description}  */\n`);
                                        }
                                        // 检查参数名
                                        if (!checkName(p.name)) {
                                            return false;
                                        }
                                        const a = `${p.name}${p.required ? "" : "?"}`;
                                        const b = `${p.schema.type || "string"}`;
                                        q.push(`${a}: ${b}, `);
                                    });
                                    if (lodash.isEmpty(q)) {
                                        q = ["any"];
                                    }
                                    else {
                                        q.unshift("{");
                                        q.push("}");
                                    }
                                    if (item.name) {
                                        types.push(item.name);
                                    }
                                    // 方法描述
                                    t += `
									/**
									 * ${a.summary || n}
									 */
									${n}(data?: any): Promise<any> {
										return request({
											url: "/${d[i].namespace}${a.path}",
											method: "${(a.method || "get").toLocaleUpperCase()}",
											data,
										});
									},
								`;
                                }
                            });
                        }
                        t += `} as ${name}\n`;
                        types.push(name);
                        chain += `${formatName(i)}: ${t},\n`;
                    }
                }
                else {
                    chain += `${formatName(i)}: {`;
                    deep(d[i], name);
                    chain += `} as ${firstUpperCase(i)}Interface,`;
                    types.push(`${firstUpperCase(i)}Interface`);
                }
            }
        }
        // 遍历 service 树
        deep(service);
        return {
            content: `{ ${chain} }`,
            types,
        };
    }
    /**
     * 获取字典类型定义
     * @returns {Promise<string>} 字典类型 type 定义
     */
    async function createDict() {
        let p = "";
        switch (config.type) {
            case "app":
            case "uniapp-x":
                p = "/app";
                break;
            case "admin":
                p = "/admin";
                break;
        }
        const url = config.reqUrl + p + "/dict/info/types";
        const text = await axios
            .get(url)
            .then((res) => {
            const { code, data } = res.data;
            if (code === 1000) {
                let v = "string";
                if (!lodash.isEmpty(data)) {
                    v = data.map((e) => `"${e.key}"`).join(" | ");
                }
                return `type DictKey = ${v}`;
            }
        })
            .catch(() => {
            error(`[cool-eps] Error：${url}`);
        });
        return text || "";
    }
    /**
     * 主入口：创建 eps 相关文件和 service
     */
    async function createEps() {
        if (config.eps.enable) {
            // 获取 eps 数据
            await getData();
            // 构建 service 对象
            createService();
            const serviceCode = createServiceCode();
            // 创建 eps 目录
            createDir(getEpsPath(), true);
            // 创建 eps.json 文件
            const isUpdate = createJson();
            // 创建类型描述文件
            createDescribe({ service, list });
            return {
                service,
                serviceCode,
                list,
                isUpdate,
            };
        }
        else {
            return {
                service: {},
                list: [],
            };
        }
    }

    function getPlugin(name) {
        let code = readFile(rootDir(`./src/plugins/${name}/config.ts`));
        // 设置插件配置
        const set = (key, value) => {
            const regex = new RegExp(`(return\\s*{[^}]*?\\b${key}\\b\\s*:\\s*)([^,}]+)`);
            if (regex.test(code)) {
                code = code.replace(regex, `$1${JSON.stringify(value)}`);
            }
            else {
                const insertPos = code.indexOf("return {") + 8;
                code =
                    code.slice(0, insertPos) +
                        `\n  ${key}: ${JSON.stringify(value)},` +
                        code.slice(insertPos);
            }
        };
        // 保存插件配置
        const save = async () => {
            const content = await formatContent(code);
            writeFile(rootDir(`./src/plugins/${name}/config.ts`), content);
        };
        return {
            set,
            save,
        };
    }
    // 修改插件
    async function updatePlugin(options) {
        const plugin = getPlugin(options.name);
        if (options.enable !== undefined) {
            plugin.set("enable", options.enable);
        }
        await plugin.save();
    }

    function getPath() {
        return rootDir(`.${config.type == "admin" ? "/src" : ""}/config/proxy.ts`);
    }
    async function updateProxy(data) {
        let code = readFile(getPath());
        const regex = /const\s+value\s*=\s*['"]([^'"]+)['"]/;
        if (regex.test(code)) {
            code = code.replace(regex, `const value = '${data.name}'`);
        }
        writeFile(getPath(), code);
    }
    function getProxyTarget(proxy) {
        const code = readFile(getPath());
        const regex = /const\s+value\s*=\s*['"]([^'"]+)['"]/;
        const match = code.match(regex);
        if (match) {
            const value = match[1];
            try {
                const { target, rewrite } = proxy[`/${value}/`];
                return target + rewrite(`/${value}`);
            }
            catch (err) {
                error(`[cool-proxy] Error：${value} → ` + getPath());
                return "";
            }
        }
    }

    // 创建文件
    async function createFile(data) {
        const list = lodash.isArray(data) ? data : [data];
        for (const item of list) {
            const { path: path$1, code } = item;
            // 格式化内容
            const content = await formatContent(code, {
                parser: "vue",
            });
            // 目录路径
            const dir = (path$1 || "").split("/");
            // 文件名
            const fname = dir.pop();
            // 源码路径
            const srcPath = `./src/${dir.join("/")}`;
            // 创建目录
            createDir(srcPath, true);
            // 创建文件
            fs.createWriteStream(path.join(srcPath, fname), {
                flags: "w",
            }).write(content);
        }
    }

    function createTag(code, id) {
        if (/\.vue$/.test(id)) {
            let s;
            const str = () => s || (s = new magicString(code));
            const { descriptor } = compilerSfc.parse(code);
            if (!descriptor.script && descriptor.scriptSetup) {
                const res = compilerSfc.compileScript(descriptor, { id });
                const { name, lang } = res.attrs;
                str().appendLeft(0, `<script lang="${lang}">
					import { defineComponent } from 'vue'
					export default defineComponent({
						name: "${name}"
					})
				<\/script>`);
                return {
                    map: str().generateMap(),
                    code: str().toString(),
                };
            }
        }
        return null;
    }

    function base() {
        return {
            name: "vite-cool-base",
            enforce: "pre",
            configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                    function done(data) {
                        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                        res.end(JSON.stringify(data));
                    }
                    if (req.originalUrl?.includes("__cool")) {
                        const body = await parseJson(req);
                        switch (req.url) {
                            // 创建文件
                            case "/__cool_createFile":
                                await createFile(body);
                                break;
                            // 创建 eps 文件
                            case "/__cool_eps":
                                await createEps();
                                break;
                            // 更新插件
                            case "/__cool_updatePlugin":
                                await updatePlugin(body);
                                break;
                            // 设置代理
                            case "/__cool_updateProxy":
                                await updateProxy(body);
                                break;
                            default:
                                return done({
                                    code: 1001,
                                    message: "Unknown request",
                                });
                        }
                        done({
                            code: 1000,
                        });
                    }
                    else {
                        next();
                    }
                });
            },
            transform(code, id) {
                if (config.nameTag) {
                    return createTag(code, id);
                }
                return code;
            },
        };
    }

    function demo(enable) {
        const virtualModuleIds = ["virtual:demo"];
        return {
            name: "vite-cool-demo",
            enforce: "pre",
            resolveId(id) {
                if (virtualModuleIds.includes(id)) {
                    return "\0" + id;
                }
            },
            async load(id) {
                if (id === "\0virtual:demo") {
                    const demo = {};
                    if (enable) {
                        const files = await glob.glob(rootDir("./src/modules/demo/views/crud/components") + "/**", {
                            stat: true,
                            withFileTypes: true,
                        });
                        for (const file of files) {
                            if (file.isFile()) {
                                const p = path.join(file.path, file.name);
                                demo[p
                                    .replace(/\\/g, "/")
                                    .split("src/modules/demo/views/crud/components/")[1]] = fs.readFileSync(p, "utf-8");
                            }
                        }
                    }
                    return `
					export const demo = ${JSON.stringify(demo)};
				`;
                }
            },
        };
    }

    async function createCtx() {
        let ctx = {
            serviceLang: "Node",
        };
        if (config.type == "app" || config.type == "uniapp-x") {
            const manifest = readFile(rootDir("manifest.json"), true);
            // 文件路径
            const ctxPath = rootDir("pages.json");
            // 页面配置
            ctx = readFile(ctxPath, true);
            // 原数据，做更新比较用
            const ctxData = lodash.cloneDeep(ctx);
            // 删除临时页面
            ctx.pages = ctx.pages?.filter((e) => !e.isTemp);
            ctx.subPackages = ctx.subPackages?.filter((e) => !e.isTemp);
            // 删除不需要的数据
            for (const i in ctx) {
                if (!["pages", "subPackages", "tabBar", "globalStyle", "uniIdRouter"].includes(i)) {
                    delete ctx[i];
                }
            }
            // 加载 uni_modules 配置文件
            const files = await glob.glob(rootDir("uni_modules") + "/**/pages_init.json", {
                stat: true,
                withFileTypes: true,
            });
            for (const file of files) {
                if (file.isFile()) {
                    const { pages = [], subPackages = [] } = readFile(path.join(file.path, file.name), true);
                    // 合并到 pages 中
                    [...pages, ...subPackages].forEach((e) => {
                        e.isTemp = true;
                        const isSub = !!e.root;
                        const d = isSub
                            ? ctx.subPackages?.find((a) => a.root == e.root)
                            : ctx.pages?.find((a) => a.path == e.path);
                        if (d) {
                            lodash.assign(d, e);
                        }
                        else {
                            if (isSub) {
                                ctx.subPackages?.unshift(e);
                            }
                            else {
                                ctx.pages?.unshift(e);
                            }
                        }
                    });
                }
            }
            // 排序后检测，避免加载顺序问题
            function order(d) {
                return {
                    pages: lodash.orderBy(d.pages, "path"),
                    subPackages: lodash.orderBy(d.subPackages, "root"),
                };
            }
            // 是否需要更新 pages.json
            if (!util.isDeepStrictEqual(order(ctxData), order(ctx))) {
                console.log("[cool-ctx] pages updated");
                writeFile(ctxPath, JSON.stringify(ctx, null, 4));
            }
            // appid
            ctx.appid = manifest.appid;
        }
        if (config.type == "admin") {
            const list = fs.readdirSync(rootDir("./src/modules"));
            ctx.modules = list.filter((e) => !e.includes("."));
            await axios
                .get(config.reqUrl + "/admin/base/comm/program", {
                timeout: 5000,
            })
                .then((res) => {
                const { code, data, message } = res.data;
                if (code === 1000) {
                    ctx.serviceLang = data || "Node";
                }
                else {
                    error(`[cool-ctx] ${message}`);
                }
            })
                .catch((err) => {
                // console.error(['[cool-ctx] ', err.message])
            });
        }
        return ctx;
    }

    let svgIcons = [];
    function findSvg(dir) {
        const arr = [];
        const dirs = fs.readdirSync(dir, {
            withFileTypes: true,
        });
        // 获取当前目录的模块名
        const moduleName = dir.match(/[/\\](?:src[/\\](?:plugins|modules)[/\\])([^/\\]+)/)?.[1] || "";
        for (const d of dirs) {
            if (d.isDirectory()) {
                arr.push(...findSvg(dir + d.name + "/"));
            }
            else {
                if (path.extname(d.name) == ".svg") {
                    const baseName = path.basename(d.name, ".svg");
                    // 判断是否需要跳过拼接模块名
                    let shouldSkip = config.svg.skipNames?.includes(moduleName);
                    // 跳过包含icon-
                    if (baseName.includes("icon-")) {
                        shouldSkip = true;
                    }
                    const iconName = shouldSkip ? baseName : `${moduleName}-${baseName}`;
                    svgIcons.push(iconName);
                    const svg = fs.readFileSync(dir + d.name)
                        .toString()
                        .replace(/(\r)|(\n)/g, "")
                        .replace(/<svg([^>+].*?)>/, (_, $2) => {
                        let width = 0;
                        let height = 0;
                        let content = $2.replace(/(width|height)="([^>+].*?)"/g, (_, s2, s3) => {
                            if (s2 === "width") {
                                width = s3;
                            }
                            else if (s2 === "height") {
                                height = s3;
                            }
                            return "";
                        });
                        if (!/(viewBox="[^>+].*?")/g.test($2)) {
                            content += `viewBox="0 0 ${width} ${height}"`;
                        }
                        return `<symbol id="icon-${iconName}" ${content}>`;
                    })
                        .replace("</svg>", "</symbol>");
                    arr.push(svg);
                }
            }
        }
        return arr;
    }
    function compilerSvg() {
        svgIcons = [];
        return findSvg(rootDir("./src/"))
            .map((e) => {
            return svgo.optimize(e)?.data || e;
        })
            .join("");
    }
    async function createSvg() {
        const html = compilerSvg();
        const code = `
if (typeof window !== 'undefined') {
	function loadSvg() {
		const svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgDom.style.position = 'absolute';
		svgDom.style.width = '0';
		svgDom.style.height = '0';
		svgDom.setAttribute('xmlns','http://www.w3.org/2000/svg');
		svgDom.setAttribute('xmlns:link','http://www.w3.org/1999/xlink');
		svgDom.innerHTML = '${html}';
		document.body.insertBefore(svgDom, document.body.firstChild);
	}

	loadSvg();
}
		`;
        return { code, svgIcons };
    }

    async function virtual() {
        const virtualModuleIds = [
            "virtual:eps",
            "virtual:ctx",
            "virtual:svg-register",
            "virtual:svg-icons",
        ];
        createEps();
        return {
            name: "vite-cool-virtual",
            enforce: "pre",
            configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                    // 页面刷新时触发
                    if (req.url == "/@vite/client") {
                        // 重新加载虚拟模块
                        virtualModuleIds.forEach((vm) => {
                            const mod = server.moduleGraph.getModuleById(`\0${vm}`);
                            if (mod) {
                                server.moduleGraph.invalidateModule(mod);
                            }
                        });
                    }
                    next();
                });
            },
            handleHotUpdate({ file, server }) {
                // 文件修改时触发
                if (!["pages.json", "dist", "build/cool", "eps.json", "eps.d.ts"].some((e) => file.includes(e))) {
                    createCtx();
                    createEps().then((data) => {
                        if (data.isUpdate) {
                            // 通知客户端刷新
                            (server.hot || server.ws).send({
                                type: "custom",
                                event: "eps-update",
                                data,
                            });
                        }
                    });
                }
            },
            resolveId(id) {
                if (virtualModuleIds.includes(id)) {
                    return "\0" + id;
                }
            },
            async load(id) {
                if (id === "\0virtual:eps") {
                    const eps = await createEps();
                    return `
					export const eps = ${JSON.stringify(eps)}
				`;
                }
                if (id === "\0virtual:ctx") {
                    const ctx = await createCtx();
                    return `
					export const ctx = ${JSON.stringify(ctx)}
				`;
                }
                if (id == "\0virtual:svg-register") {
                    const { code } = await createSvg();
                    return code;
                }
                if (id == "\0virtual:svg-icons") {
                    const { svgIcons } = await createSvg();
                    return `
					export const svgIcons = ${JSON.stringify(svgIcons)}
				`;
                }
            },
        };
    }

    /**
     * 特殊字符映射表
     */
    const SAFE_CHAR_MAP = {
        "[": "-bracket-start-",
        "]": "-bracket-end-",
        "(": "-paren-start-",
        ")": "-paren-end-",
        "{": "-brace-start-",
        "}": "-brace-end-",
        $: "-dollar-",
        "#": "-hash-",
        "!": "-important-",
        "/": "-slash-",
        ":": "-colon-",
    };
    /**
     * 特殊字符映射表（国际化）
     */
    const SAFE_CHAR_MAP_LOCALE = {
        "[": "-bracket-start-",
        "]": "-bracket-end-",
        "(": "-paren-start-",
        ")": "-paren-end-",
        "{": "-brace-start-",
        "}": "-brace-end-",
        $: "-dollar-",
        "#": "-hash-",
        "!": "-important-",
        "/": "-slash-",
        ":": "-colon-",
        " ": "-space-",
        "<": "-lt-",
        ">": "-gt-",
        "&": "-amp-",
        "|": "-pipe-",
        "^": "-caret-",
        "~": "-tilde-",
        "`": "-backtick-",
        "'": "-single-quote-",
        ".": "-dot-",
        "?": "-question-",
        "*": "-star-",
        "+": "-plus-",
        "-": "-dash-",
        _: "-underscore-",
        "=": "-equal-",
        "%": "-percent-",
        "@": "-at-",
    };

    // @ts-ignore
    /**
     * 转换类名中的特殊字符为安全字符
     */
    function toSafeClass(className) {
        if (config.utsPlatform == "web") {
            return className;
        }
        if (className.includes(":host")) {
            return className;
        }
        // 如果是表达式,则不进行转换
        if (["!=", "!==", "?", ":", "="].includes(className)) {
            return className;
        }
        let safeClassName = className;
        // 移除转义字符
        if (safeClassName.includes("\\")) {
            safeClassName = safeClassName.replace(/\\/g, "");
        }
        // 处理暗黑模式
        if (safeClassName.includes(":is")) {
            if (safeClassName.includes(":is(.dark *)")) {
                safeClassName = safeClassName.replace(/:is\(.dark \*\)/g, "");
                if (safeClassName.startsWith(".dark:")) {
                    const className = safeClassName.replace(/^\.dark:/, ".dark:");
                    safeClassName = `${className}`;
                }
            }
        }
        // 替换特殊字符
        for (const [char, replacement] of Object.entries(SAFE_CHAR_MAP)) {
            const regex = new RegExp("\\" + char, "g");
            if (regex.test(safeClassName)) {
                safeClassName = safeClassName.replace(regex, replacement);
            }
        }
        return safeClassName;
    }
    /**
     * 转换 RGB 为 RGBA 格式
     */
    function rgbToRgba(rgbValue) {
        const match = rgbValue.match(/rgb\(([\d\s]+)\/\s*([\d.]+)\)/);
        if (!match)
            return rgbValue;
        const [, rgb, alpha] = match;
        const [r, g, b] = rgb.split(/\s+/);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    function remToRpx(remValue) {
        const { remUnit = 14, remPrecision = 6, rpxRatio = 2 } = config.tailwind;
        const conversionFactor = remUnit * rpxRatio;
        const precision = (remValue.split(".")[1] || "").length;
        const rpxValue = (parseFloat(remValue) * conversionFactor)
            .toFixed(precision || remPrecision)
            .replace(/\.?0+$/, "");
        return `${rpxValue}rpx`;
    }
    /**
     * PostCSS 插件
     * 处理类名和单位转换
     */
    function postcssPlugin() {
        return {
            name: "vite-cool-uniappx-postcss",
            enforce: "pre",
            config() {
                return {
                    css: {
                        postcss: {
                            plugins: [
                                {
                                    postcssPlugin: "vite-cool-uniappx-class-mapping",
                                    prepare() {
                                        return {
                                            // 处理选择器规则
                                            Rule(rule) {
                                                if ([
                                                    ".button-hover",
                                                    ":deep(",
                                                    "&::",
                                                    "uni-",
                                                    ".uni-",
                                                ].some((e) => rule.selector.includes(e))) {
                                                    return;
                                                }
                                                // 转换选择器为安全的类名格式
                                                rule.selector = toSafeClass(rule.selector);
                                            },
                                            // 处理声明规则
                                            Declaration(decl) {
                                                const className = decl.parent.selector || "";
                                                if (!decl.parent._twValues) {
                                                    decl.parent._twValues = {};
                                                }
                                                // 处理 Tailwind 自定义属性
                                                if (decl.prop.includes("--tw-")) {
                                                    decl.parent._twValues[decl.prop] =
                                                        decl.value.includes("rem")
                                                            ? remToRpx(decl.value)
                                                            : decl.value;
                                                    decl.remove();
                                                    return;
                                                }
                                                // 转换 RGB 颜色为 RGBA 格式
                                                if (decl.value.includes("rgb(") &&
                                                    decl.value.includes("/")) {
                                                    decl.value = rgbToRgba(decl.value);
                                                }
                                                // 处理文本大小相关样式
                                                if (decl.value.includes("rpx") &&
                                                    decl.prop == "color" &&
                                                    className.includes("text-")) {
                                                    decl.prop = "font-size";
                                                }
                                                // 删除不支持的属性
                                                if (["filter"].includes(decl.prop)) {
                                                    decl.remove();
                                                    return;
                                                }
                                                // 处理 flex-1
                                                if (decl.prop == "flex") {
                                                    if (decl.value.startsWith("1")) {
                                                        decl.value = "1";
                                                    }
                                                }
                                                // 处理 vertical-align 属性
                                                if (decl.prop == "vertical-align") {
                                                    decl.remove();
                                                }
                                                // 处理 visibility 属性
                                                if (decl.prop == "visibility") {
                                                    decl.remove();
                                                }
                                                // 处理 sticky 属性
                                                if (className == ".sticky") {
                                                    if (decl.prop == "position" ||
                                                        decl.value == "sticky") {
                                                        decl.remove();
                                                    }
                                                }
                                                // 解析声明值
                                                const parsed = valueParser(decl.value);
                                                let hasChanges = false;
                                                // 遍历并处理声明值中的节点
                                                parsed.walk((node) => {
                                                    // 处理单位转换(rem -> rpx)
                                                    if (node.type === "word") {
                                                        const unit = valueParser.unit(node.value);
                                                        if (typeof unit != "boolean") {
                                                            if (unit?.unit === "rem") {
                                                                node.value = remToRpx(unit.number);
                                                                hasChanges = true;
                                                            }
                                                        }
                                                    }
                                                    // 处理 CSS 变量
                                                    if (node.type === "function" &&
                                                        node.value === "var") {
                                                        const twKey = node.nodes[0]?.value;
                                                        // 替换 Tailwind 变量为实际值
                                                        if (twKey?.startsWith("--tw-")) {
                                                            if (decl.parent._twValues) {
                                                                node.type = "word";
                                                                node.value =
                                                                    decl.parent._twValues[twKey] ||
                                                                        "none";
                                                                hasChanges = true;
                                                            }
                                                        }
                                                    }
                                                });
                                                // 更新声明值
                                                if (hasChanges) {
                                                    decl.value = parsed.toString();
                                                }
                                                // 移除 Tailwind 生成的无效 none 变换
                                                const nones = [
                                                    "translate(none, none)",
                                                    "rotate(none)",
                                                    "skewX(none)",
                                                    "skewY(none)",
                                                    "scaleX(none)",
                                                    "scaleY(none)",
                                                ];
                                                if (decl.value) {
                                                    nones.forEach((noneStr) => {
                                                        decl.value = decl.value.replace(noneStr, "");
                                                        if (!decl.value || !decl.value.trim()) {
                                                            decl.value = "none";
                                                        }
                                                    });
                                                }
                                            },
                                        };
                                    },
                                },
                            ],
                        },
                    },
                };
            },
        };
    }
    /**
     * uvue class 转换插件
     */
    function transformPlugin() {
        return {
            name: "vite-cool-uniappx-transform",
            enforce: "pre",
            async transform(code, id) {
                const { darkTextClass } = config.tailwind;
                // 判断是否为 uvue 文件
                if (id.endsWith(".uvue") || id.includes(".uvue?type=page")) {
                    // 避免影响到其他模块/插件
                    if (id.includes("uni_modules/") && !id.includes("uni_modules/cool-")) {
                        return null;
                    }
                    let modifiedCode = code;
                    // 获取所有节点
                    const nodes = getNodes(code);
                    // 遍历处理每个节点
                    nodes.forEach((node) => {
                        if (node.startsWith("<!--")) {
                            return;
                        }
                        let _node = node;
                        // uniappx 插件模式
                        if (!config.uniapp.isPlugin) {
                            // 为 text 节点添加暗黑模式文本颜色
                            if (!_node.includes(darkTextClass) && _node.startsWith("<text")) {
                                let classIndex = _node.indexOf("class=");
                                // 处理动态 class
                                if (classIndex >= 0) {
                                    if (_node[classIndex - 1] == ":") {
                                        classIndex = _node.lastIndexOf("class=");
                                    }
                                }
                                // 添加暗黑模式类名
                                if (classIndex >= 0) {
                                    _node =
                                        _node.substring(0, classIndex + 7) +
                                            `${darkTextClass} ` +
                                            _node.substring(classIndex + 7, _node.length);
                                }
                                else {
                                    _node =
                                        _node.substring(0, 5) +
                                            ` class="${darkTextClass}" ` +
                                            _node.substring(5, _node.length);
                                }
                            }
                        }
                        // 获取所有类名
                        const classNames = getClassNames(_node);
                        // 转换 Tailwind 类名为安全类名
                        classNames.forEach((name, index) => {
                            if (isTailwindClass(name)) {
                                const safeName = toSafeClass(name);
                                _node = _node.replaceAll(name, safeName);
                                classNames[index] = safeName;
                            }
                        });
                        // 检查是否存在动态类名
                        const hasDynamicClass = _node.includes(":class=");
                        // 如果没有动态类名,添加空的动态类名绑定
                        if (!hasDynamicClass) {
                            // 优化写法，避免重复字符串拼接
                            const insertIndex = _node.length - (_node.endsWith("/>") ? 2 : 1);
                            _node =
                                _node.slice(0, insertIndex) + ` :class="{}"` + _node.slice(insertIndex);
                        }
                        // 获取暗黑模式类名
                        let darkClassNames = classNames.filter((name) => name.startsWith("dark-colon-") || name.startsWith("dark:"));
                        // 插件模式，不支持 dark:
                        if (config.uniapp.isPlugin) {
                            darkClassNames = [];
                        }
                        // 生成暗黑模式类名的动态绑定
                        const darkClassContent = darkClassNames
                            .map((name) => {
                            _node = _node.replaceAll(name, "");
                            return `'${name}': __isDark`;
                        })
                            .join(",");
                        // 获取所有 class 内容
                        const classContents = getClassContent(_node);
                        // 处理对象形式的动态类名
                        const dynamicClassContent_1 = classContents.find((content) => content.startsWith("{") && content.endsWith("}"));
                        if (dynamicClassContent_1) {
                            const v = dynamicClassContent_1[0] +
                                (darkClassContent ? `${darkClassContent},` : "") +
                                dynamicClassContent_1.substring(1);
                            _node = _node.replaceAll(dynamicClassContent_1, v);
                        }
                        // 处理数组形式的动态类名
                        const dynamicClassContent_2 = classContents.find((content) => content.startsWith("[") && content.endsWith("]"));
                        if (dynamicClassContent_2) {
                            const v = dynamicClassContent_2[0] +
                                `{${darkClassContent}},` +
                                dynamicClassContent_2.substring(1);
                            _node = _node.replaceAll(dynamicClassContent_2, v);
                        }
                        // 更新节点内容
                        modifiedCode = modifiedCode.replace(node, _node);
                    });
                    // 如果代码有修改
                    if (modifiedCode !== code) {
                        // 添加暗黑模式依赖
                        if (modifiedCode.includes("__isDark")) {
                            if (!modifiedCode.includes("<script")) {
                                modifiedCode += '<script lang="ts" setup></script>';
                            }
                            if (!config.uniapp.isPlugin) {
                                modifiedCode = addScriptContent(modifiedCode, "\nimport { isDark as __isDark } from '@/cool';");
                            }
                        }
                        // 清理空的类名绑定
                        modifiedCode = modifiedCode
                            .replaceAll(':class="{}"', "")
                            .replaceAll('class=""', "")
                            .replaceAll('class=" "', "");
                        return {
                            code: modifiedCode,
                            map: { mappings: "" },
                        };
                    }
                    return null;
                }
                else {
                    return null;
                }
            },
        };
    }
    /**
     * Tailwind 类名转换插件
     */
    function tailwindPlugin() {
        return [postcssPlugin(), transformPlugin()];
    }

    // 获取 tailwind.config.ts 中的颜色
    function getTailwindColor() {
        const config = readFile(rootDir("tailwind.config.ts"));
        if (!config) {
            return null;
        }
        try {
            // 从配置文件中动态提取主色和表面色
            const colorResult = {};
            // 提取 getPrimary 调用中的颜色名称
            const primaryMatch = config.match(/getPrimary\(["']([^"']+)["']\)/);
            const primaryColorName = primaryMatch?.[1];
            // 提取 getSurface 调用中的颜色名称
            const surfaceMatch = config.match(/getSurface\(["']([^"']+)["']\)/);
            const surfaceColorName = surfaceMatch?.[1];
            if (primaryColorName) {
                // 提取 PRIMARY_COLOR_PALETTES 中对应的调色板
                const primaryPaletteMatch = config.match(new RegExp(`{\\s*name:\\s*["']${primaryColorName}["'],\\s*palette:\\s*({[^}]+})`, "s"));
                if (primaryPaletteMatch) {
                    // 解析调色板对象
                    const paletteStr = primaryPaletteMatch[1];
                    const paletteEntries = paletteStr.match(/(\d+):\s*["']([^"']+)["']/g);
                    if (paletteEntries) {
                        paletteEntries.forEach((entry) => {
                            const match = entry.match(/(\d+):\s*["']([^"']+)["']/);
                            if (match) {
                                const [, key, value] = match;
                                colorResult[`primary-${key}`] = value;
                            }
                        });
                    }
                }
            }
            if (surfaceColorName) {
                // 提取 SURFACE_PALETTES 中对应的调色板
                const surfacePaletteMatch = config.match(new RegExp(`{\\s*name:\\s*["']${surfaceColorName}["'],\\s*palette:\\s*({[^}]+})`, "s"));
                if (surfacePaletteMatch) {
                    // 解析调色板对象
                    const paletteStr = surfacePaletteMatch[1];
                    const paletteEntries = paletteStr.match(/(\d+):\s*["']([^"']+)["']/g);
                    if (paletteEntries) {
                        paletteEntries.forEach((entry) => {
                            const match = entry.match(/(\d+):\s*["']([^"']+)["']/);
                            if (match) {
                                const [, key, value] = match;
                                // 0 对应 surface，其他对应 surface-*
                                const colorKey = key === "0" ? "surface" : `surface-${key}`;
                                colorResult[colorKey] = value;
                            }
                        });
                    }
                }
            }
            return colorResult;
        }
        catch (error) {
            return null;
        }
    }
    function codePlugin() {
        return [
            {
                name: "vite-cool-uniappx-code-pre",
                enforce: "pre",
                async transform(code, id) {
                    if (id.includes("/cool/ctx/index.ts")) {
                        const ctx = await createCtx();
                        // 主题配置
                        const theme = readFile(rootDir("theme.json"), true);
                        // 主题配置
                        ctx["theme"] = theme || {};
                        // 颜色值
                        ctx["color"] = getTailwindColor();
                        if (!ctx.subPackages) {
                            ctx.subPackages = [];
                        }
                        if (!ctx.tabBar) {
                            ctx.tabBar = {};
                        }
                        if (!ctx.uniIdRouter) {
                            ctx.uniIdRouter = {};
                        }
                        // 安全字符映射
                        ctx["SAFE_CHAR_MAP_LOCALE"] = [];
                        for (const i in SAFE_CHAR_MAP_LOCALE) {
                            ctx["SAFE_CHAR_MAP_LOCALE"].push([i, SAFE_CHAR_MAP_LOCALE[i]]);
                        }
                        let ctxCode = JSON.stringify(ctx, null, 4);
                        ctxCode = ctxCode.replace(`"tabBar": {}`, `"tabBar": {} as TabBar`);
                        ctxCode = ctxCode.replace(`"subPackages": []`, `"subPackages": [] as SubPackage[]`);
                        code = code.replace("const ctx = {}", `const ctx = ${ctxCode}`);
                        code = code.replace("const ctx = parse<Ctx>({})!", `const ctx = parse<Ctx>(${ctxCode})!`);
                    }
                    // if (id.includes("/cool/service/index.ts")) {
                    // 	const eps = await createEps();
                    // 	if (eps.serviceCode) {
                    // 		const { content, types } = eps.serviceCode;
                    // 		const typeCode = `import type { ${uniq(types).join(", ")} } from '../types';`;
                    // 		code =
                    // 			typeCode +
                    // 			"\n\n" +
                    // 			code.replace("const service = {}", `const service = ${content}`);
                    // 	}
                    // }
                    if (id.endsWith(".json")) {
                        const d = JSON.parse(code);
                        for (let i in d) {
                            let k = i;
                            for (let j in SAFE_CHAR_MAP_LOCALE) {
                                k = k.replaceAll(j, SAFE_CHAR_MAP_LOCALE[j]);
                            }
                            if (k != i) {
                                d[k] = d[i];
                                delete d[i];
                            }
                        }
                        // 转字符串，不然会报错：Method too large
                        if (id.includes("/locale/")) {
                            let t = [];
                            d.forEach(([a, b]) => {
                                t.push(`${a}<__=__>${b}`);
                            });
                            code = JSON.stringify([[t.join("<__&__>")]]);
                        }
                        else {
                            code = JSON.stringify(d);
                        }
                    }
                    return {
                        code,
                        map: { mappings: "" },
                    };
                },
            },
            {
                name: "vite-cool-uniappx-code",
                transform(code, id) {
                    if (id.endsWith(".json")) {
                        return {
                            code: code.replace("new UTSJSONObject", ""),
                            map: { mappings: "" },
                        };
                    }
                },
            },
        ];
    }

    /**
     * uniappX 入口，自动注入 Tailwind 类名转换插件
     * @param options 配置项
     * @returns Vite 插件数组
     */
    async function uniappX() {
        const plugins = [];
        if (config.type == "uniapp-x") {
            plugins.push(...codePlugin());
            if (config.tailwind.enable) {
                plugins.push(...tailwindPlugin());
            }
        }
        return plugins;
    }

    function cool(options) {
        // 应用类型，admin | app
        config.type = options.type;
        // 请求地址
        config.reqUrl = getProxyTarget(options.proxy);
        if (config.type == "uniapp-x") {
            // 编译平台
            config.utsPlatform = process.env.UNI_UTS_PLATFORM ?? "web";
            // 是否纯净版
            config.clean = options.clean ?? true;
            if (config.clean) {
                // 默认设置为测试地址
                config.reqUrl = "https://show.cool-admin.com/api";
            }
        }
        // 是否开启名称标签
        config.nameTag = options.nameTag ?? true;
        // svg
        if (options.svg) {
            lodash.assign(config.svg, options.svg);
        }
        // Eps
        if (options.eps) {
            const { dist, mapping, api, enable = true } = options.eps;
            // 是否开启
            config.eps.enable = enable;
            // 类型
            if (api) {
                config.eps.api = api;
            }
            // 输出目录
            if (dist) {
                config.eps.dist = dist;
            }
            // 匹配规则
            if (mapping) {
                lodash.merge(config.eps.mapping, mapping);
            }
        }
        // 如果类型为 uniapp-x，则关闭 eps
        if (config.type == "uniapp-x") {
            config.eps.enable = false;
        }
        // uniapp
        if (options.uniapp) {
            lodash.assign(config.uniapp, options.uniapp);
        }
        // tailwind
        if (options.tailwind) {
            lodash.assign(config.tailwind, options.tailwind);
        }
        return [base(), virtual(), uniappX(), demo(options.demo)];
    }

    exports.cool = cool;

}));
