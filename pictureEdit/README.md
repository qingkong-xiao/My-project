pictureEdit-ui插件使用说明：
  在页面上引入pictureEdit-ui.js 和pictureEdit-ui.css样式文件，还有iconfont.css文件，
  注意pictureEdit-ui.js不要放在head标签中，要放到body标签的尾部。

然后将包含图片的容器添加一个类名 'pictureEdit-ui'即可调用。

此外暴露出了一个全局对象_parameter,通过修改该对象上的值，
可以控制插件内部功能的精细度；
该_parameter对象包含五个属性, 

1._parameter.setMosaicFilterSize，值为number，大小在20 - 5之间，
控制马赛克滤镜下马赛克块的大小；

2._parameter.setWaterMarkFontSize，值为number，大小在50 - 5之间，
控制水印字体大小；

3._parameter.setChromaticAberrationDegree，值为number，大小在
100 - 10之间，控制自动抠图功能色差的精细度；

4._parameter.setMosaicBlockSize，值为number，大小在10 -1之间，
控制打马赛克功能下，马赛克块的大小；

5._parameter.setMagnifierSize，值为number，大小在150 - 10之间，
控制图片放大器功能下放大镜的大小；

预览地址：https://qingkong-xiao.github.io/eleme/pictureEdit/picture.html
