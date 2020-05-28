/**

 @Name：layui 移动模块入口 | 构建后则为移动模块集合
 @Author：贤心
 @License：MIT
    
 */

 
if(!layui['layui.mobile']){
  layui.config({
    base: layui.cache.dir 
  }).extend({
    'layer-mobile': 'lay/modules/mobile/layer-mobile'
    ,'zepto': 'lay/modules/mobile/zepto'
    ,'upload-mobile': 'lay/modules/mobile/upload-mobile'
    ,'layim-mobile': 'lay/modules/mobile/layim-mobile'
	,'laytpl':'lay/modules/laytpl'
	,'upload':'lay/modules/upload'
	,'layer':'lay/modules/layer'
	,'jquery':'lay/modules/jquery'
  });
}  

layui.define([
  'layer-mobile'
  ,'zepto'
  ,'layim-mobile'
], function(exports){
  exports('mobile', {
    layer: layui['layer-mobile'] //弹层
    ,layim: layui['layim-mobile'] //WebIM
  });
});