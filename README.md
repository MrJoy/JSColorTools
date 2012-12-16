# JSColorTools

This is a standalone set of very simple JS tools for doing some useful color
manipulations.  The particular problem solved is lerping between colors in a
more visually pleasing way than one can achieve by doing so in the HSB color
space.

To that end, this library provides two classes:  `RGBColor`, and `HSBColor`,
along with functions to convert between them and to do angular lerping between
HSB colors.

A prime example of this is lerping between red and green smoothly.  Done in RGB
colorspace, the midpoint will be brown.  Done in HSB colorspace, it will be
yellow.

## Demonstration

A quick demo showing the utility of using HSB colorspace for interpolation
can be found [here](http://cloudability.github.com/JSColorTools/).

## Usage

Create instances of `RGBColor`, or `HSBColor` by providing the components as
parameters to the constructors.  They include an alpha component and the scale
is from 0..1, as opposed to the 0..255 that you may be accustomed to:

```javascript
var red = new RGBColor(1, 0, 0, 1),
  green = new RGBColor(0, 1, 0, 1);
```


You can convert an `RGBColor` or `HSBColor` into an HTML color string, for
example to set the background color of an element:

```javascript
// Set the background color without including an alpha value.
document.getElementById("someElement").style.backgroundColor = red.toHTML();
```


You can convert an `RGBColor` to an `HSBColor`:

```javascript
var redAsHSB = red.toHSB(),
  greenAsHSB = green.toHSB();
```


You can lerp (blend) between two `RGBColor`s and then convert the result into
an HTML color string, for example to set the background color of an element:

```javascript
var resultHSB = HSBColor.lerp(red.toHSB(), green.toHSB(), 0.5);
document.getElementById('someElement').style.backgroundColor = resultHSB.toHTML();
```

And if you want, you can even get an HTML color with an alpha value, although
this doesn't work in most contexts:

```javascript
console.log(red.toHTML(true));
```


## License

This code is distributed under the MIT license, see the file MIT-LICENSE for
more information.
