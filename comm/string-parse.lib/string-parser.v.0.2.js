/**
 * Des String Parser
 * Author Maple Joe
 */

export default (tmpl, obj) => {
    console.log('parser');
    tmpl = `##if(obj.aaa) {
            <ul>
                ##for(obj) {
                <li>{{aaa}}</li>
                }##
            </ul>
            }##
            ##if(obj.bbb) {
            <ul>
                ##for(obj) {
                <li>{{aaa}}</li>
                }##
            </ul>
            }##
            `;
    obj = [
        {
            aaa: 'aaa'
        },
        {
            aaa: 'bbb'
        }
    ];
    if(!tmpl) return; 

    // 自执行解析对象
    var p = function() {return parser;}(), split, 
        pattern = /##(for|if)\((.+?)\)/g;
    
    // 根据匹配解析相应原则
    for(tmpl = p.removeTrim(tmpl); pattern.exec(tmpl); ) { 
        tmpl = p.method({
            base: 'parser',
            change: RegExp.$1,
            args: [tmpl, obj]
        });
        console.log('parserT', tmpl);
    }

    // if(/\#\#for/igm.test(tmpl)) {
    //     tmpl = p.parserFor(tmpl, obj);
    // } 
    // if(/\#\#if/igm.test(tmpl)) {
    //     tmpl = p.parseif(tmpl, obj);
    // }
    // if(/\#\#\-/igm.test(tmpl)) {
    //     tmpl = p.parseStatement(tmpl, obj);
    // } 
    // if(/\{\{/gm.test(tmpl)){
    //     tmpl = p.parseVar(tmpl, obj);
    // } 
    console.log('tmpl', tmpl);
    return tmpl;
};

const parser = {
    parserVar: function(tmpl, obj) {
        var temp = '';
        for(let i=0; i<obj.length; i++) {
            for(let j in obj[i]) {
                temp += tmpl.replace(new RegExp('\{\{' + j + '\}\}', 'igm'), obj[i][j]);
            }
        }
        return temp;
    },
    parserIf: function(tmpl, obj) {
        var patternS = /##if\((.*?)\)\{(.*?)\}/,
            patternE = /[\s\S]*?\}(?=.*#)/igm,
            //patternE = /^##if[\s\S]*?\}(?=.*#)/igm, 
            str = [], split, theStr, otherStr, arr, tmp, forStr = '';
        out: for(let i=1; split = patternE.exec(tmpl);) {
            str = split[0].match(/(##[-]?)/igm);
            patternE.lastIndex = 0;
            for(let j=str.length; patternE.exec(tmpl); j--) {
                if(1 === j) {
                    theStr = tmpl.substring(0, patternE.lastIndex + 2);
                    otherStr = tmpl.substring(patternE.lastIndex + 2);
                    break out;
                }
            } 
        }
        split = /^##if\((.*)\).*?{/igm.exec(theStr)
        // 变量解析
        if(/\./.test(split[1])) {    
            arr = split[1].split('.');
            if(/obj/i.test(arr[0])) {
                if(/object/.test(obj.toString())) {
                    for(let i in obj) {
                        if(obj[i][arr[1]]) {
                            forStr += theStr.match(/^##if.*\{([\s\S]*)\}##/)[1];
                        } else {
                            forStr += '';
                        }
                    }
                } else {
                    if(obj[arr[1]]) {
                        theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
                    } else {
                        theStr = '';
                    }
                }
            } else if(/window|global/i.test(arr[0])){
                if(window[arr[1]] || global[arr[1]]) {
                    theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
                } else {
                    thisStr = ''
                }
            } else {
                tmp = eval('(' + arr[0] + ')');
                if(tmp[arr[1]]) {
                    theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
                } else {
                    theStr = '';
                }
            }
        } else {
            if(obj[split[1]]) {
                theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
            } else {
                theStr = '';
            }
        }   
        if(forStr) return forStr + otherStr;
        return theStr + otherStr;
        // var split = pattern2.exec(tmpl);
        // for(let i=1; pattern.exec(tmpl); i++) {
        //     str = tmpl.substring(pattern2.lastIndex, pattern.lastIndex);
            
        // } 
    },
    parserFor: function(tmpl, obj) {
        var patternS = /##for\((.*)\)\{(.*?)\}/,
            patternE = /[\s\S]*\}(?=.*#)/igm,
            split, str, theStr, theOtherStr, arr = [], len, win;
        
        out: for(;split=patternE.exec(tmpl);) {
            str = split[0].match(/##/);
            patterE.lastIndex = 0;
            for(let j=str.length; patternE.exec(tmpl); j--) {
                if(1 === j) {
                    theStr = tmpl.substring(0, patternE.lastIndex + 2);
                    theOther = tmpl.substring(patternE.lastIndex + 2);
                    break out;
                }
            }
        }
        split = /^##for\((.*)\).*?\{/igm;
        // 变量解析
        if(/\./.test(split[1])) {
            arr = split[1].split('.');
            if(/window|global/.test(arr[0])) {
                win = !global.process ? window : global;
                if(/array/i.test(Object.prototype.toString.call(null, win[arr[1]]))) {
                    if(len = win[arr[1]].length !== 0) {
                        str = /^##for.*?\{([\s\S]*?)\}/.exec(theStr);
                        for(let i=0; i<len; i++) {
                            if(/\{\{/.test(theStr)) {
                                theStr += this.parserVar(str[1], win[arr[1]][i]);           
                            } else {
                                theStr += str[1];
                            }        
                        } 
                    }
                }
            } else if(/obj|this/.test(arr[0])) {
                if(/array/i.test(Object.prototype.toString.call(null, obj[arr[1]]))) {
                    if(len = obj[arr[1]].length !== 0) {
                        str = /^##for.*?\{([\s\S]*?)\}/.exec(theStr);
                        for(let i=0; i<len; i++) {
                            if(/\{\{/.test(theStr)) {
                                theStr += this.parseVar(str[1], obj[arr[1]][i]);
                            } else {
                                theStr += str[1];
                            }
                        }
                    } else {
                        theStr = str[1];
                    }
                }
            }
        } else {
            if(/array/i.test(Object.prototype.toString.call(null, obj[arr[1]]))) {
                if(len = obj[arr[1]].length !== 0) {
                    str = /^##for.*?\{([\s\S]*?)\}/.exec(theStr);
                    for(let i=0; i<len; i++) {
                        if(/\{\{/.test(theStr)) {
                            theStr += this.parseVar(str[1], obj[arr[1]][i]);
                        } else {
                            theStr += str[1];
                        }
                    }
                } else {
                    theStr = str[1];
                }
            }
        }
        return theStr + theOtherStr;

        // var str = [], temp = '',
        //     pattern = /(<.*>)?\s*##for.*\{\s*(.*)\s*\}##\s*(<.*>)?/igm,
        //     split;
        
        // split = pattern.exec(tmpl);
        // for(let i=1; i<split.length; i++) {
        //     if(i !== 1 && i !== split.length-1) { 
        //         temp += this.parserVar(split[i], obj);
        //         continue;
        //     }
        //     temp += split[i];
        // }
        return temp;
    },
    parseStatement: function(tmpl, obj) {

    },
    removeTrim: function(tmpl) {
        //return tmpl.replace(/^(\s+)|(\s+)$|(\s+(?=.*?>))/gm, 
            //(match, p) => '');
        return tmpl.replace(/^\s+|\s+$/gm, '');
        //return tmpl.replace(/^\s*|\s*$|>\s*?</gm, '');
    },
    getMethodFn: function(method, args) {
        return this[method](...args);
        //return this[method].apply(this, args);
        //return this[method](args);
    },
    method: function({base, change, type='camel', split='', args}) {
        return this.getMethodFn(this.getMethodName(base, change, type, split), args);
    },
    // method: function(base, change, type = 'camel', split = '', args = []) {
    //     return this.getMethodFn(this.getMethodName(base, change, type, split), args);
    // },
    getMethodName: function(base, change, type, s) {
        switch(type) {
            case 'camel':
                return [base, 
                        change.substring(0, 1).toUpperCase(),
                        change.substring(1)].join(s);
                break;
            case 'normal':
            default:
                return [base, change].join(s);
                break;
        }
    }
};





