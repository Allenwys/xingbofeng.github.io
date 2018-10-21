# Service Worker学习与实践（二）————PWA与Web Push
> 这周，`Chrome 70`正式版本发布，`Progressive Web Apps（PWA）`已经正式支持到`Windows 10`平台，然而，早在前几个版本之前，`Chrome`就已经通过`chrome://flags`支持开启实验性的功能，早就支持在`Windows 10`平台上安装`Progressive Web Apps（PWA）`。谷歌表示安装在桌面的网页应用使用体验非常接近于本地应用，并且应用的服务商可以缓存所有资源因此这些PWA应用有很好的兼容性和可靠性。

在上一篇文章[Service Worker学习与实践（一）——离线缓存](https://github.com/xingbofeng/xingbofeng.github.io/issues/37)中，已经讲到`Service Worker`的生命周期、如何创建、激活、更新`Web`应用程序的`Service Worker`，并且给出了一个简单的示例来说明使用`Service Worker`来实现离线缓存的原理，在这篇文章里，主要是对`Service Worker`实现原生应用程序的能力做出一定解析，并通过一个例子阐述如何使用`Service Worker`实现消息推送功能。

## Progressive Web Apps（PWA）
`Progressive Web App`, 简称 PWA，是提升`Web App`的体验的一种新方法，能给用户原生应用的体验。

`PWA`能做到原生应用的体验不是靠特指某一项技术，而是经过应用一些新技术进行改进，在安全、性能和体验三个方面都有很大提升，`PWA`本质上是`Web App`，借助一些新技术也具备了`Native App`的一些特性，兼具`Web App`和`Native App`的优点。

`PWA`的主要特点包括下面三点：

可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现
体验 - 快速响应，并且有平滑的动画响应用户的操作
粘性 - 像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面
`PWA`本身强调渐进式，并不要求一次性达到安全、性能和体验上的所有要求，开发者可以通过[PWA Checklist](https://developers.google.cn/web/progressive-web-apps/checklist)查看现有的特征。

通过上面的`PWA Checklist`，总结起来，`PWA`大致有以下的优势：

* 体验：通过`Service Worker`配合`Cache Storage API`，保证了`PWA`首屏的加载效率，甚至配合本地存储可以支持离线应用；
* 粘性：`PWA`是可以安装的，用户点击安装到桌面后，会在桌面创建一个 PWA 应用，并且不需要从应用商店下载，可以借助`Web App Manifest`提供给用户和`Native App`一样的沉浸式体验，可以通过给用户发送离线通知，让用户回流；
* 渐进式：适用于大多数现代浏览器，随着浏览器版本的迭代，其功能是渐进增强的；
* 无版本问题：如`Web`应用的优势，更新版本只需要更新应用程序对应的静态文件即可，`Service Worker`会帮助我们进行更新；
* 跨平台：`Windows`、`Mac OSX`、`Android`、`IOS`，一套代码，多处使用；
* 消息推送：即使用户已经关闭应用程序，仍然可以对用户进行消息推送；

总的说来，只要`Web`应用支持的功能，对于`PWA`而言，基本都支持，此外，还提供了原生能力。

### 使用`PWA manifest`添加桌面入口

注意这里说的`manifest`不是指的`manifest`缓存，这个`manifest`是一个`JSON`文件，开发者可以利用它控制在用户想要看到应用的区域（例如移动设备主屏幕）中如何向用户显示网络应用或网站，指示用户可以启动哪些功能，以及定义其在启动时的外观。

`manifest`提供了将网站书签保存到设备主屏幕的功能。当网站以这种方式启动时：

* 它具有唯一的图标和名称，以便用户将其与其他网站区分开来。
* 它会在下载资源或从缓存恢复资源时向用户显示某些信息。
* 它会向浏览器提供默认显示特性，以避免网站资源可用时的过渡过于生硬。

下面是我的博客网站的`manifest.json`文件，作为桌面入口配置文件的示例：

```json
{
  "name": "Counterxing",
  "short_name": "Counterxing",
  "description": "Why did you encounter me?",
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ACE",
  "theme_color": "#ACE",
  "icons": [{
    "src": "/images/logo/logo072.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo152.png",
    "sizes": "152x152",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo192.png",
    "sizes": "192x192",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo256.png",
    "sizes": "256x256",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo512.png",
    "sizes": "512x512",
    "type": "image/png"
  }]
}
```

上面的字段含义也不用多解释了，大致就是启动的`icon`样式