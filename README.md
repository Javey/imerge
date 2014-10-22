imerge
======

A tool for css sprite.

#Features

* Highly performant
* Support background-repeat, background-size and even background-position which value is left, right, top and bottom except for center
* Custom image padding in sprite
* Custom merge setting

#Install

```js
npm install -g imerge
```

#Usage

Before using the tool, you must to customize merge setting in css files. Just add `merge: value` in css block which has background or background-image declaration.

example:
```css
div {
	background: url('path/to/image.png');
	merge: sprite
}
```
then
```js
imerge source dest [options]
```
This will generate css files and sprites image to dest directory.

```js
options:
	-h, --help                     output usage information
	-V, --version                  output the version number
	-p, --pattern [pattern]        CSS file glob pattern
	-d, --default-padding [value]  Set default padding value
```
				
