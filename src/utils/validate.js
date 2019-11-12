import { callbackify } from "util";

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 */

 var obj_mobile = { 
      validMoblie : function (rules,value,callback){
          var reg=/^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
              callback(new Error('电话号码输入格式有误！'))
          } else {
              callback()
          }
      }
}
export default obj_mobile