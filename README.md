#drawboard 
parser - templateParser模块
string-parser.v.0.1 - string-parser.v.0.5规则

块语句以##开头，##结尾
语句变量以{{开头，}}结尾

块语句if基本格式
`##if(condition) {
    statement/for/var/if/tag
}##`,
`##if(condition) {
    statement/for/var/if/tag
} el {
    statement/for/var/if/tag
}##`,
`##if(condition) {
    statement/for/var/if/tag
} eif(condition) {
    statement/for/var/if/tag
} el {
    statement/for/var/if/tag
}##`
condition选值
参数对象/数组
对象中的一个属性，数组中的每个成员对象的属性 - 对对象中的一个属性做for
以下情况将解析为参数对象所属
obj.aaa / this.aaa / {{aaa}} / aaa
局部对象
对象中的一个属性， 数组中的每个成员对象的属性， 对象中的一个变量
以下情况将解析为局部对象所属，以p对象为例
p.aaa
全局对象
带有window/global的对象，将被解析为全局对象
以下情况将解析全局对象所属，{1，x}表示为一层或者n层
window.aaa / global.aaa / window.aaa{1, x} / global.aaa{1,x}
语句判断
详见语句解析规则
注 if条件中的{{}}模式只会被解析成参数对象，前缀将会被忽略。

块语句for基本格式
`##for(fors) {
    statement...
}##`,
`##for {
    statement...
}##`,
`##for() {
    statement...
}##`,
`##for(i in 10){
    statement...
}##`
fors选值
参数对象
以下情况将解析为参数对象所属
obj/this/{{obj}}/{{this}}/fors为空/fors加外括号全省略
局部对象
以下情况将解析为局部对象所属，以p对象为例
p/p.aaa
全局对象
window/global前缀的将解析为全局所属
window.p/window.p.aaa/global.p/global.p.aaa
定值
以上情况将解析为定值所属，i为任意名称，s为起始值，p为步长，
不定义起始值，则i从0计起；不定义步长，则i每次加1
##for([s=1;] i in 10[; p=2)
##for(i in 10)
注：fors中的{{}}模式将被解析为参数对象。

变量多用于for循环，if条件中
var基本格式
{{aaa}}
参数对象
{{this.aaa}} / {{obj.aaa}} / {{aaa}}
局部对象，以p对象为例
{{p.aaa.xxx{1, x}}}
全局对象
{{window|global.aaa}} / {{window|global.aaa.xxx{1, x}}} 

语句
语句基本格式
{{-aaa===bbb}}
语句模式举例，对象变量解析方式遵循以上所讲，根据实际情况而定
三目运算符{{-a ? b : c}}
赋值语句{{-obj.xxx = obj.bbb + 'x'}}
方法调用{{-p.aaa(ddd)}}
注：为性能考虑，对于复杂的语句建议通过方法调用间接调用相应方法。

v0.1x
实现模板解析基本流程
v0.2x
面条式实现for,if,var模板的解析
v0.3x
封装方式实现for,if,var,statement模板的解析
v0.4x
v0.5x








