# vue-router-loader-yaml
load vue-router config via yaml
> `0.0.3` meta can config in yaml 


> useage   
```shell
 npm install vue-router-loader-yaml --save-dev
```
in your webpack.config.js
```js
rules: [
    {
        test: /router\.yaml$/,
        loader: 'babel-loader!vue-router-loader-yaml'
    },
    // ...
],
//...

```

> common useage   

 your yaml file:
```yaml
index:
    path: /
    component: ./platform/system/index/index.vue
    meta:
        nav: none
```
output:   

```js
import index from './platform/system/index/index.vue';

export default [
{
    path: '/',
    component: index.
    meta:{nav:'none'}
}];

```

> lazyload    
```yaml
userList:
    path: /users
    component: ./platform/system/users/user.vue
    lazy:  system
```
output:   

```js
const userList = r=>require.ensure([],()=>r(require('./platform/system/users/user.vue')),'system');

export default [
{
    path: '/users',
    component: userList
}];

```

> Nested router   

```yaml
index:
    path: /
    component: ./platform/system/index/index.vue
    children:
        userList:
            path: /users
            component: ./platform/system/users/index.vue
            lazy:  system
        testList:
            path: /test
            component: ./platform/system/test/index.vue
            lazy:  system
```
output:   

```js
const userList = r=>require.ensure([],()=>r(require('./platform/system/users/index.vue')),'system');
const testList = r=>require.ensure([],()=>r(require('./platform/system/test/index.vue')),'system');
import index from './platform/system/index/index.vue';

export default [
{
    path: '/',
    component: index,
    children:[
{
    path: '/users',
    component: userList
},
{
    path: '/test',
    component: testList
}]}];

```

> lazyload extends and overwrited      
```yaml
index:
    path: /
    component: ./platform/system/index/index.vue
    lazy: base
    children:
        users:
            path: /users
            component: ./platform/system/users/index.vue
            lazy:  False
        testList:
            path: /test
            component: ./platform/system/test/index.vue
            lazy:  system
        mainList:
            path: /main
            component: ./platform/system/main/index.vue
````
- outout:
```js
import users from './platform/system/users/index.vue';
const testList = r=>require.ensure([],()=>r(require('./platform/system/test/index.vue')),'system');
const mainList = r=>require.ensure([],()=>r(require('./platform/system/main/index.vue')),'base');
const index = r=>require.ensure([],()=>r(require('./platform/system/index/index.vue')),'base');

export default [
{
    path: '/',
    component: index,
    children:[
{
    path: '/users',
    component: users
},
{
    path: '/test',
    component: testList
},
{
    path: '/main',
    component: mainList
}]}];
```