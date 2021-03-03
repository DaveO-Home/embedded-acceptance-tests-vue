var fs = require('fs');
var template = fs.readFileSync('appl/components/HelloWorld.vue', 'utf8');
const compiler = require('vue-template-compiler');
//const template = require('appl/App.vue');
//console.log(compiler.compile(template)); // , [options])
const component = compiler.parseComponent(template);
console.log(compiler.compile(component.template));
//console.log(compiler.parseComponent(template)); // , [options])
