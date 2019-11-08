import $ from 'jquery'
import Vues from '../main'

var token = sessionStorage.getItem('token');
function requestData(url,data,method){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: method,
            url: url,
            data: data,
            headers: {'Authorization': token},      //请求头加token验证
            dataType: "json",
            success: function(data){
                if(data.status==403){   //token过期
                    Vues.$message.error('token过期，请重新登录！');
                    sessionStorage.clear();
                    setTimeout(()=>{
                        Vues.$router.push({path:'/login'});
                    },200)
                }else{
                    resolve(data);
                }
            },
            error:function(data){
                reject(data);
            }
        });
    })
}

export default requestData