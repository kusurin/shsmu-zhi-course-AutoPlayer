# 使用方法
- 打开课程学习页面
- `F12`打开开发工具
- 在控制台中粘贴运行代码`auto.js`
- 在弹出框中输入开始的章和节

# 注意事项
- `auto.js`作为txt打开（`auto_vjs.js`不稳定，还会导致进度丢失，别用）
- 当视频缓冲，最长等待5秒
- 缓冲失败会重试6次
- 当视频加载错误，会重试3次
- 当视频暂停超过20s且进度满100%，会播放下一个，否则最多重试6次
- 当初始进度条超过95%，会跳过该视频
