# wechat-ssjUploadPhotos
微信小程序.自定义组件.照片选择器，可以调用控件，选择完照片后直接展示出来


可能是因为之前开发的习惯，让我在学习一门新语言的时候，不得不去想如何自定义一个组件，以应付常用情况，于是有了这样一个组件的封装。

<img src="https://github.com/SSJStar/wechat-ssjUploadPhotos/blob/master/效果图1.png" width="375"></img>
<img src="https://github.com/SSJStar/wechat-ssjUploadPhotos/blob/master/效果图2.png" width="375"></img>
<img src="https://github.com/SSJStar/wechat-ssjUploadPhotos/blob/master/效果图3.png" width="375"></img>
>  使用步骤：

1. 将ssjUploadPhotos文件夹拉到miniprogram/components下，没有components文件夹就新建它

2. 在app.json文件配置如下：

```
{
"usingComponents": {
"ssjUploadPhotos":"/components/ssjUploadPhotos/ssjUploadPhotos"
},
}
```
```
如果没有usingComponents这个节点，就新建这个节点，有的话就加入    ""ssjUploadPhotos":"/components/ssjUploadPhotos/ssjUploadPhotos"
”，记住：节点{}内每一行之间用逗号隔开，最后一行不需要逗号，否则报错
```
3. 在需要调用的xml文件加上：

>title：表示标题 /  非必填
maxSelectCount：表示最大选择张数 / 非必填

```
<ssjUploadPhotos  bind:gainImageFilePaths= 'gainImageFilePathsPage' title='请选择照片' maxSelectCount='5'></ssjUploadPhotos>

```
4. 在调用page的js文件内，实现方法：

```
//当选择好照片的时候，会调用这个方法
gainImageFilePathsPage: function(imageFilePaths) {
console.log('得到的json数据：' + JSON.stringify(imageFilePaths))
}
```

>这里解释一下方法的传递，
```
bind:gainImageFilePaths='你需要实现的方法名'；
为绑定图片获取方法事件，即当图片选择器每次选择完照片后，会得到最新的照片路径数组

```
完毕！O(∩_∩)O~~
