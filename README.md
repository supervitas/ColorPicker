# ColorPicker example for Three.js 

##This is a basic example of using Color Picking Technique. For more info you can read [this](http://www.opengl-tutorial.org/ru/miscellaneous/clicking-on-objects/picking-with-an-opengl-hack/)

The basic idea is to create a copy with unique color of object you want to pick, render it on second scene with that color to texture
and after that read pixel color from mouse position. This pixel color can be used as an ID.
