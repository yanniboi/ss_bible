#!/usr/bin/env node
 
//
// This hook copies various resource files 
// from our version control system directories 
// into the appropriate platform specific location
//
 
 
// configure all the files to copy.  
// Key of object is the source file, 
// value is the destination location.  
// It's fine to put all platforms' icons 
// and splash screen files here, even if 
// we don't build for all platforms 
// on each developer's box.
 
var filestocopy = [{
    "config/android/res/drawable/icon.png": 
    "platforms/android/res/drawable/icon.png"
}, {
    "config/android/res/drawable-hdpi/icon.png": 
    "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "config/android/res/drawable-ldpi/icon.png": 
    "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "config/android/res/drawable-mdpi/icon.png": 
    "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "config/android/res/drawable-xhdpi/icon.png": 
    "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "config/android/res/drawable/default.png":
        "platforms/android/res/drawable/splash.png"
}, {
    "config/android/res/drawable-hdpi/default.png":
        "platforms/android/res/drawable-hdpi/splash.png"
}, {
    "config/android/res/drawable-ldpi/default.png":
        "platforms/android/res/drawable-ldpi/splash.png"
}, {
    "config/android/res/drawable-mdpi/default.png":
        "platforms/android/res/drawable-mdpi/splash.png"
}, {
    "config/android/res/drawable-xhdpi/default.png":
        "platforms/android/res/drawable-xhdpi/splash.png"
}, {
    "config/android/res/drawable/default-land.png":
        "platforms/android/res/drawable-land/splash.png"
}, {
    "config/android/res/drawable-hdpi/default-land.png":
        "platforms/android/res/drawable-hdpi-land/splash.png"
}, {
    "config/android/res/drawable-ldpi/default-land.png":
        "platforms/android/res/drawable-ldpi-land/splash.png"
}, {
    "config/android/res/drawable-mdpi/default-land.png":
        "platforms/android/res/drawable-mdpi-land/splash.png"
}, {
    "config/android/res/drawable-xhdpi/default-land.png":
        "platforms/android/res/drawable-xhdpi-land/splash.png"
}, {
    "config/ios/Resources/icons/Icon-72.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-72.png"
}, {
    "config/ios/Resources/icons/Icon-40.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-40.png"
}, {
    "config/ios/Resources/icons/Icon-40@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-40@2x.png"
}, {
    "config/ios/Resources/icons/Icon-Small.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-small.png"
}, {
    "config/ios/Resources/icons/Icon-Small@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-small@2x.png"
}, {
    "config/ios/Resources/icons/Icon-Small-50.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-50.png"
}, {
    "config/ios/Resources/icons/Icon-Small-50@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-50@2x.png"
}, {
    "config/ios/Resources/icons/Icon-60.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-60.png"
}, {
    "config/ios/Resources/icons/Icon-60@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-60@2x.png"
}, {
    "config/ios/Resources/icons/Icon-76.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-76.png"
}, {
    "config/ios/Resources/icons/Icon-76@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-76@2x.png"
}, {
    "config/ios/Resources/icons/Icon.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon.png"
}, {
    "config/ios/Resources/icons/Icon@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon@2x.png"
}, {
    "config/ios/Resources/icons/icon-72@2x.png": 
    "platforms/ios/Bible\ In\ One\ Year/Resources/icons/icon-72@2x.png"
}, {
    "config/ios/Resources/splash/Default@2x.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default-568h@2x.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "config/ios/Resources/splash/iphone3G.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default~iphone.png"
}, {
    "config/ios/Resources/splash/Default-Landscape.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default-Landscape~ipad.png"
}, {
    "config/ios/Resources/splash/Default-Landscape@2x.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default-Landscape@2x~ipad.png"
}, {
    "config/ios/Resources/splash/Default-Portrait.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default-Portrait~ipad.png"
}, {
    "config/ios/Resources/splash/Default-Portrait@2x.png":
    "platforms/ios/Bible\ In\ One\ Year/Resources/splash/Default-Portrait@2x~ipad.png"
}, ];
 
var fs = require('fs');
var path = require('path');
 
// no need to configure below
var rootdir = process.argv[2];
 
filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
