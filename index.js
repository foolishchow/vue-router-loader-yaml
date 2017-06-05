const yaml = require('js-yaml');

const evalName = function (keys,Name) {
    if(keys.indexOf(Name) == -1){
        keys.push(Name);
        return Name;
    }else{
        var index = 1;
        while(keys.indexOf(Name+'$'+index) > -1){
            index ++;
        }
        keys.push(Name+'$'+index);
        return Name+'$'+index;
    }
};

const evalRouter = function (json,Lazy,keys) {
    keys = keys||[];
    var result = {header:'',body:''};
    Object.keys(json).forEach((item)=>{
        var Name = item,
            obj = json[item],
            lazy = Lazy,
            chunkName = Lazy,
            component = obj.component,
            path = obj.path;
        Name = evalName(keys,Name);
        if(obj.lazy != undefined ) {
            lazy = obj.lazy;
            chunkName = obj.lazy;
        }
        if(obj.children){
            children = evalRouter(obj.children,lazy,keys);
            result.header += children.header;
            result.body += `\n{\n    path: '${path}',\n${obj.meta != undefined ? 'meta:'+JSON.stringify(obj.meta)+',' : ''}\n    component: ${Name},\n    children:[${children.body}]},`;
        }else{
            result.body += `\n{\n    path: '${path}',\n${obj.meta != undefined ? 'meta:'+JSON.stringify(obj.meta)+',' : ''}\n    component: ${Name}\n},`;
        }
        if(!lazy){
            result.header += `\nimport ${Name} from '${component}';`;
        }else{
            result.header += `\nconst ${Name} = r=>require.ensure([],()=>r(require('${component}')),'${chunkName}');`;
        }

    });
    result.body = result.body.replace(/,$/gi,'')
    return result;
}

module.exports = function(source) {
    this.cacheable && this.cacheable();
    var res = yaml.safeLoad(source);
    var result = evalRouter(res);
    return `
${result.header}

export default [${result.body}];

`
};