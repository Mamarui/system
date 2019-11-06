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
      validMoblie : function (str,callback){
          var reg=/^[1][3,4,5,7,8][0-9]{9}$/;
          // return reg.test(str)
          if (!reg.test(str)) {
              callback('电话号码输入格式有误！')
          } else {
              callback()
          }
      }
}
export default obj_mobile