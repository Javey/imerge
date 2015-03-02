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
	imerge: sprite;
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
```
Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -p, --pattern [pattern]        CSS file glob pattern
    -d, --default-padding [value]  Set default padding value
    -a, --all                      Process all background images
    -w, --webroot [path]           Set webroot path. Default: source path. Deprecated, use --source-context.
    -c, --css-to [path]            CSS output path. The priority is higher than dest
    -s, --sprite-to [path]         Sprite image output path. The priority is higher than dest
    -e, --source-context [path]    Source file webroot
    -t, --output-context [path]    Output file webroot
```

# 编程

可以将`imerge`当成一个node module进行编程

## 示例

```javascript
var IMerge = require('IMerge');

var iMerge = new IMerge.IMerge(options, pathFilter);
iMerge.start();
```

### options

```js
{
	// 扫描css的目录
	from: '',
	// 存放处理后的css和sprite image的目录
	to: '',
	// 存放处理后的css目录，优先级高于to
	cssTo: '',
	// 存放处理后的sprite image目录，优先级高于to
	spriteTo: '',
	// 原始css文件中，绝对路径引用image相对的目录
	sourceContext: '',
	// 编译后的css文件中，绝对路径引用image相对的目录
	outputContext: '',
	// 扫描文件的glob pattern
	pattern: '/**/*.css',
	defaults: {
		// 小图在sprite中间距，类似css的写法
		padding: null
	},
	options: {
		// 是否扫描所有background background-image，而不用管是否设置了merge属性
		all: false
	}
}
```

### pathFilter

```js
{
	// 图片地址过滤器
	imagePathFilter: function(file, conf) {
		return file;
	},
	// sprite图片输出路径
	spriteTo: function(merge) {
		return path.join(opt.spriteTo, '/spirte_' + merge + '.png');
	},
	// sprite图片写回css中地址
	spritePathFilter: function(file) {
		return file.replace(opt.outputContext, '');
	},
	// 处理后的css存放地址
	cssTo: function(file) {
		return path.join(opt.cssTo, path.relative(opt.from, file));
	}
}
```

## 问题

1. stylus中merge冲突

> 可以将css中的配置声明改为imerge
> ```css
> div {
>	background: url('path/to/image.png');
>	imerge: sprite;
> }
> ```


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

```
Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -p, --pattern [pattern]        CSS file glob pattern
    -d, --default-padding [value]  Set default padding value
    -a, --all                      Process all background images
    -w, --webroot [path]           Set webroot path. Default: source path. Deprecated, use --source-context.
    -c, --css-to [path]            CSS output path. The priority is higher than dest
    -s, --sprite-to [path]         Sprite image output path. The priority is higher than dest
    -e, --source-context [path]    Source file webroot
    -t, --output-context [path]    Output file webroot
```

#Test

Use mocha as the unit test framwork.

```js
npm install -g mocha
// enter project directory
mocha -w --compilers coffee:coffee-script --recursive  
```
				
