###### CV interactive Map
 An interactive map that displays in-world for Cryptovoxels by [Fayelure](https://twitter.com/Benjythebee), with resources from [Fayelure](https://cryptovoxels.com) and [Leaflet](https://leafletjs.com/).
[See demo centered at Origin City Market](https://benjythebee.github.io/CV_interactive_map/index.html)
![Demonstration](https://benjythebee.github.io/CV_interactive_map/Thumbnail.png)

The map is initialized with an html div
```
<div id="cvmap" style="height: 700px; position: relative; outline: none;">
```
and the following script
```
       var CVmap = L.map('cvmap').setView([1.80, 0.98], 9);
      /* Load the tileLayer x and y*/
      L.tileLayer(`https://map.cryptovoxels.com/tile?z={z}&x={x}&y={y}`, {
        minZoom: 3,
        maxZoom: 20,
        attribution: 'Map data &copy; Cryptovoxels',
        id: 'cryptovoxels'
      }).addTo(CVmap)
```
The function
>SetView()
has two arguments: 
-One, an array [X,Y] defining the intial center. A positive X means it's east and a positive Y means north. 
-The second argument is the initial zoom.

To convert Cryptovoxels' coordinates to [X,Y], just divide the CV's coords by 100.

For more info on leaflet functions: [the Leaflet Documentation](https://leafletjs.com/reference-1.6.0.html#map-methods-for-modifying-map-state)

The rest of the script element is for markers and popups

 The content of the popup is in:
 ```
.setContent(`
<iframe id="cryptovoxel" src="https://www.cryptovoxels.com/play${playCoord}&mode=orbit" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:15rem; height:100%; min-height:10rem;" allowTransparency="true" sandbox="allow-scripts allow-same-origin">
`)

 ```
Note Cryptovoxels is in an iframe and has the flag "&mode=orbit". For more info on flags visit [the Cryptovoxels Documentation](https://www.cryptovoxels.com/docs/flags)
You can edit the size of the iframe by editing the *style* tag in the HTML code.

It is important that the leaflet map is in a "defined" size container.


