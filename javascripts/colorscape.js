/*jslint white: true, indent: 2 */

/*****************************************************************************/
// Some handy-dandy additions to the Math class.
/*****************************************************************************/
Math.clamp01 = function (x) {
  "use strict";
  if (x < 0.0)      { x = 0.0; }
  else if (x > 1.0) { x = 1.0; }
  return x;
};

Math.lerp = function (from, to, t) {
  "use strict";
  return from + (to - from) * Math.clamp01(t);
};

Math.lerpAngle = function (a, b, t) {
  "use strict";
  var num = (b - a) - Math.floor((b - a) / 360.0) * 360.0;
  if (num > 180.0) { num -= 360.0; }
  num = a + num * Math.clamp01(t);
  if (num < 0.0) { num = (((-1 * num) % 360) - 360) * -1; }
  num = num % 360.0;

  return num;
};


/*****************************************************************************/
// Forward declarations.
/*****************************************************************************/
var RGBColor, HSBColor;


/*****************************************************************************/
// Basic class to represent colors in the RGBA colorspace.
/*****************************************************************************/
RGBColor = function (red, green, blue, alpha) {
  "use strict";
  var that = this;
  this.attrs = {
    red:   red,
    green: green,
    blue:  blue,
    alpha: alpha
  };

  this.red = function (red) {
    if (red !== undefined) { that.attrs.red = red; }
    return that.attrs.red;
  };
  this.green = function (green) {
    if (green !== undefined) { that.attrs.green = green; }
    return that.attrs.green;
  };
  this.blue = function (blue) {
    if (blue !== undefined) { that.attrs.blue = blue; }
    return that.attrs.blue;
  };
  this.alpha = function (alpha) {
    if (alpha !== undefined) { that.attrs.alpha = alpha; }
    return that.attrs.alpha;
  };

  this.toHSB = function () { return HSBColor.fromRGB(this); };

  this.toHTML = function (withAlpha) {
    var red = Math.floor(that.red() * 255).toString(16),
      green = Math.floor(that.green() * 255).toString(16),
      blue = Math.floor(that.blue() * 255).toString(16),
      alpha = Math.floor(that.alpha() * 255).toString(16);

    // Pad to two digits...
    if (red.length < 2)   { red   = "0" + red; }
    if (green.length < 2) { green = "0" + green; }
    if (blue.length < 2)  { blue  = "0" + blue; }
    if (withAlpha && alpha.length < 2) { alpha = "0" + alpha; }

    return "#" + red + green + blue + ((withAlpha !== undefined && withAlpha === true) ? alpha : "");
  };
};

RGBColor.lerp = function (c1, c2, t) {
  "use strict";
  var red = Math.lerp(c1.red(), c2.red(), t),
    green = Math.lerp(c1.green(), c2.green(), t),
    blue = Math.lerp(c1.blue(), c2.blue(), t),
    alpha = Math.lerp(c1.alpha(), c2.alpha(), t);

  return new RGBColor(red, green, blue, alpha);
};


/*****************************************************************************/
// Basic class to represent colors in the HSBA colorspace.
/*****************************************************************************/
HSBColor = function (hue, saturation, brightness, alpha) {
  "use strict";
  var that = this;
  this.attrs = {
    hue:        hue,
    saturation: saturation,
    brightness: brightness,
    alpha:      alpha
  };

  this.hue = function (hue) {
    if (hue !== undefined) { that.attrs.hue = hue; }
    return that.attrs.hue;
  };
  this.saturation = function (saturation) {
    if (saturation !== undefined) { that.attrs.saturation = saturation; }
    return that.attrs.saturation;
  };
  this.brightness = function (brightness) {
    if (brightness !== undefined) { that.attrs.brightness = brightness; }
    return that.attrs.brightness;
  };
  this.alpha = function (alpha) {
    if (alpha !== undefined) { that.attrs.alpha = alpha; }
    return that.attrs.alpha;
  };

  this.toRGB = function () { return HSBColor.toRGB(this); };

  this.toHTML = function (withAlpha) {
    return this.toRGB().toHTML(withAlpha);
  };
};

HSBColor.fromRGB = function (color) {
  "use strict";
  var red = color.red(),
    green = color.green(),
    blue = color.blue(),
    alpha = color.alpha(),
    ret = new HSBColor(0, 0, 0, alpha),
    max = Math.max(red, green, blue),
    min = Math.min(red, green, blue),
    delta = max - min;

  if (max <= 0.0) { return ret; }

  if (max > min) {
    if (green === max)     { ret.hue((blue - red) / delta * 60.0 + 120.0); }
    else if (blue === max) { ret.hue((red - green) / delta * 60.0 + 240.0); }
    else if (blue > green) { ret.hue((green - blue) / delta * 60.0 + 360.0); }
    else                   { ret.hue((green - blue) / delta * 60.0); }

    if (ret.hue() < 0.0)   { ret.hue(ret.hue() + 360.0); }
  } // Implicit else: h == 0.

  ret.hue(ret.hue() * (1.0 / 360.0));
  ret.saturation(delta / max);
  ret.brightness(max);

  return ret;
};

HSBColor.toRGB = function (hsbColor) {
  "use strict";
  var r, g, b,
    hue = hsbColor.hue() * 360.0,
    saturation = hsbColor.saturation(),
    brightness = hsbColor.brightness(),
    max = brightness,
    delta = brightness * saturation,
    d6 = delta / 60.0,
    min = brightness - delta;

  if (saturation !== 0.0) {
    if (hue < 60.0)        { r = max;                       g = hue * d6 + min;            b = min; }
    else if (hue < 120.0)  { r = -(hue - 120.0) * d6 + min; g = max;                       b = min; }
    else if (hue < 180.0)  { r = min;                       g = max;                       b = (hue - 120.0) * d6 + min; }
    else if (hue < 240.0)  { r = min;                       g = -(hue - 240.0) * d6 + min; b = max; }
    else if (hue < 300.0)  { r = (hue - 240.0) * d6 + min;  g = min;                       b = max; }
    else if (hue <= 360.0) { r = max;                       g = min;                       b = -(hue - 360.0) * d6 + min; }
    else                   { r = 0.0;                       g = 0.0;                       b = 0.0; }
  } else {
    r = g = b = brightness;
  }

  return new RGBColor(Math.clamp01(r), Math.clamp01(g), Math.clamp01(b), hsbColor.alpha());
};

HSBColor.lerp = function (c1, c2, t) {
  "use strict";
  var hue, saturation;

  // Special case black (brightness == 0): interpolate neither hue nor saturation!
  if (c1.brightness() === 0.0)        { hue = c2.hue(); saturation = c2.saturation(); }
  else if (c2.brightness() === 0.0)   { hue = c1.hue(); saturation = c1.saturation(); }
  else {
    // Special case grey (saturation == 0): don't interpolate hue!
    if (c1.saturation() === 0.0)      { hue = c2.hue(); }
    else if (c2.saturation() === 0.0) { hue = c1.hue(); }
    else                              { hue = Math.lerpAngle(c1.hue() * 360.0, c2.hue() * 360.0, t) / 360.0; }

    saturation = Math.lerp(c1.saturation(), c2.saturation(), t);
  }

  return new HSBColor(hue, saturation, Math.lerp(c1.brightness(), c2.brightness(), t), Math.lerp(c1.alpha(), c2.alpha(), t));
};
