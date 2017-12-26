/**
 * Des String Parser
 * Author Maple Joe
 */

export default (tmpl, obj) => {
    console.log('parser');
    // for语句
    tmpl = `<ul>
                ##for(obj) {
                <li>{{aaa}}</li>
                }##
            </ul>`;
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
    var p = function() {return parser;}();
    
    // 根据匹配解析相应原则
    if(/\#\#for/igm.test(tmpl)) {
        tmpl = p.parserFor(tmpl, obj);
    } else if(/\#\#if/igm.test(tmpl)) {
        tmpl = p.parseif(tmpl, obj);
    } else if(/\#\#\-/igm.test(tmpl)) {
        tmpl = p.parseStatement(tmpl, obj);
    } else if(/\{\{/gm.test(tmpl)){
        tmpl = p.parseVar(tmpl, obj);
    } 
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
    
    },
    parserFor: function(tmpl, obj) {
        var str = [], temp = '',
            pattern = /(<.*>)?\s*##for.*\{\s*(.*)\s*\}##\s*(<.*>)?/igm,
            split;
        
        split = pattern.exec(tmpl);
        for(let i=1; i<split.length; i++) {
            if(i !== 1 && i !== split.length-1) { 
                temp += this.parserVar(split[i], obj);
                continue;
            }
            temp += split[i];
        }
        return temp;
    },
    parseStatement: function(tmpl, obj) {

    }
};





