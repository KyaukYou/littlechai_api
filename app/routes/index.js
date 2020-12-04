/*
 * @Author: LittleChai
 * @Date: 2020-12-04 16:25:26
 * @LastEditTime: 2020-12-04 16:35:53
 */
 
 const fs = require('fs');

 module.exports = (app) => {
     fs.readdirSync(__dirname).forEach(file => {
         if(file === 'index.js') {
            return;
         }
         else {
             const route = require(`./${file}`);
             app.use(route.routes()).use(route.allowedMethods())
         }
     })
 }