import $ from 'jquery'

function requestData(url,data,method){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: method,
            url: url,
            data: data,
            dataType: "json",
            success: function(data){
                resolve(data);
            },
            error:function(data){
                reject(data);
            }
        });
    })
}

export default requestData