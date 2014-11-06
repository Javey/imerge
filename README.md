imerge
======

A tool for css sprite.

#Features

* Highly performance
* Support background-repeat, background-size and even background-position which value is left, right, top and bottom except for center
* Custom image padding in sprite
* Custom merge setting

##Plan

* Multi image formats supported.Only support png for now.
* Auto generate sprite image when you don't customize merge setting, i.e. conflict detect.

#Install

```js
npm install -g imerge
```

#Usage

Before using the tool, you must to customize merge setting in css files. Just add `merge: value` in css block which has background or background-image declaration.

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
				
