layui.define(["crypto","layer"],function(exports){ 

var CryptoJS = layui.crypto;
var msgkey = "qq123456";
//var mobile = layui.mobile;

var obj = {
  //加密
  encryptByDES: function(message){
    var keyHex = CryptoJS.enc.Utf8.parse(msgkey);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
  },
  decryptByDES : function(ciphertext,key){
    if (key == undefined){
        key = msgkey
    }
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
  layer : layui.layer,
  heartflag :false,
  tryTime : 0,
  websocket : null,
  layim : null,
  logout : false,   //注销标记
  webSocketURL:"",
  WebSocketInit: function(layim,websocketurl,l,crypto){

    if(l!=undefined){
      //  console.log("layer!=undefined");
        layer = l;
    }else{
      //  console.log("layer==undefined");
        layer = layui.layer;
    }

    if (crypto!=undefined){
        CryptoJS = crypto;
    }

   
    obj.layim = layim;
    obj.webSocketURL = websocketurl;
   // console.log("WebSocketInit: " + url);
    //var url = "ws://";
    if (!window.WebSocket) {
        layer.msg("您的浏览器不支持ws");
        return false;
    }



    //return 
    obj.webSocket = new WebSocket(obj.webSocketURL);


    obj.webSocket.onmessage = function (res) {
        //console.log("接收到消息类型: " + res.type)
        if (res.type != "message") {
            return
        }

        // console.log(res.data);

        //对消息解密
      //  console.log("消息内容 解密前长度: " + res.data.length)
        var msgdata = obj.decryptByDES(res.data, msgkey);

         //console.log("消息内容 解密后: " + msgdata)

        res = JSON.parse(msgdata);
        //res = JSON.parse(res);
        //   res = res.data;
        // console.log("消息类型:" + res.type);

        switch (res.type) {
            case "chatMessage":
                layim.getMessage(res.data);

                break;
            case "logout":
                console.log("在其他地方登录或登录失效")
                obj.heartflag = false;
                obj.webSocket = null;
                obj.logout = true;

                var loginURL = document.location.protocol  +"//"+ window.location.host+"/u"
                //console.log("Ag Params"+getCookie("litechat_v2_agent"))
                //console.log("登录地址:"+loginURL);

                

                layer.msg("在其他地方登录或登录失效", {
                    icon: 1,
                    time: 500
                }, function() {
                    window.location.href=loginURL
                });
                break;
            case "flush":


                //console.log("刷新请求")
                parent.location.reload(); //强制刷新
                break;
            default:
                console.log("未知消息类型:" + res.Type)
        }

    };


    

    // 异常
    obj.webSocket.onerror = function (event) {
        console.log("ws 连接异常");
        //console.log(JSON.stringify(event));
        layer.msg("服务器连接异常")
    };

    // 建立连接
    obj.webSocket.onopen = function (event) {
        obj.heartflag = true;
        // websocketHeart();
        obj.tryTime = 0;
        console.log("ws 连接成功");
        layer.msg("服务器通讯连接成功")
        obj.logout = false;
    };

    // 断线重连
    obj.webSocket.onclose = function () {
        obj.heartflag = false;
        // 重试3次，每次之间间隔3秒
        if (obj.tryTime < 3 ) {
            if (obj.logout == false){
                setTimeout(function () {
                    obj.webSocket = null;
                    obj.tryTime++;
                    obj.WebSocketInit(obj.layim,obj.webSocketURL);
                    //$("#connectStatu").append( getNowFormatDate()+"  第"+tryTime+"次重连<br/>");
                    console.log("第 " + obj.tryTime + " 次重连...");
                    layer.msg("第 " + obj.tryTime + " 次重连...");
                }, 3 * 1000);
            }
            
        } else {
            console.log("ws 重连失败");
            layer.msg("服务器重新连接失败!")
            document.write("服务器连接失败,请重新获取链接");
        }
    };

  }
  
};


//console.log("wsutil init");

//输出test接口
exports('wsutil', obj);
});    


