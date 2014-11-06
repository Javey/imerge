imerge
======
css合图工具

#特性

* 高性能，超简单
* 支持`background-repeat`，`background-size`，以及值为`left/right/top/bottom`（`center`和百分比%不支持）的`background-position`
* 支持小图在大图里面的padding值
* 支持合图配置，即指定那些图合到一起
* 支持ie6 hack写法，即用"_"开头的声明

##计划

* 多图片格式支持，现在只支持png
* 当没有自定义合图配置时，自动合图。例如，冲突检测机制

#安装

```js
npm install -g imerge
```

#使用方法

##自定义配置

自定义配置，可以指定那些小图合并到一起，只需要在css中定义了背景图片的地方加上`merge: value`，就可以将该小图合并到`value`大图中。对于没有定义`merge`的图片，将忽略。
例如：
```css
div {
	background: url('path/to/image.png');
	merge: sprite;
}
```
然后执行
```js
imerge source dest [options]
```
将会生成处理后的css文件和大图到`dest`文件夹。

输出的css文件内容如下：
```css
div {
	background: url('path/to/sprite_sprite.png');
	background-position: 0px 0px;
}
```
大图被命名为`sprite_sprite.png`。

##全自动合图

这种方式将扫描所有的背景图片，然后将其合并到一张图片`sprite_sprite.png`中，如果定义了ie6 hack写法的背景图片，合到`sprite_sprite_ie6.png`中。但这种情况存在以下风险：
* 当图片存在`png/git/jpg`等多种格式时，无法合并
* 当定义了不支持的属性`background-position: center 40%`时，无法合并
* 当存在一张图片`background-repeat: repeat-x`,另一张`background: repeat-y`时，无法合并

使用：
```js
imerge source dest -a
```

#命令选项
```js
options:
	-h, --help                     output usage information
	-V, --version                  output the version number
	-p, --pattern [pattern]        CSS file glob pattern
	-d, --default-padding [value]  Set default padding value
	-a, --all                      Process all background images
```

imerge
======

A tool for css sprite.

#Features

* Highly performance
* Support background-repeat, background-size and even background-position which value is left, right, top and bottom except for center
* Custom image padding in sprite
* Custom merge setting
* Support ie6 hack, i.e. declaration starts with '_'

##Plan

* Multi image formats are supported.Only support png for now.
* Auto generate sprite image when you don't customize merge setting, e.g. conflict detect.

#Install

```js
npm install -g imerge
```

#Usage

Before using this tool, you must to customize merge setting in css files. Just add `merge: value` in css block which has background or background-image declaration.

For example:
```css
div {
	background: url('path/to/image.png');
	merge: sprite;
}
```
then execute
```js
imerge source dest [options]
```
This will generate css files and sprite images to `dest` directory.

##Output
CSS file:
```css
div {
	background: url('path/to/sprite_sprite.png');
	background-position: 0px 0px;
}
```
Sprite image is named `sprite_sprite.png`.

#Options
```js
options:
	-h, --help                     output usage information
	-V, --version                  output the version number
	-p, --pattern [pattern]        CSS file glob pattern
	-d, --default-padding [value]  Set default padding value
	-a, --all                      Process all background images
```
				
