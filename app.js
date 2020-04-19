app={
    getDataGET: async (location) => {
// If we want to get the Cryptovoxels api (we have to convert it to geoJSON first)
        const d = await $.getJSON("https://www.cryptovoxels.com/api/parcels.json");
        console.log(d)
        let info = d
            let parcel_coordinates = info.parcels
            console.log("loaded the file")
          
            var parcel_means={"parcels":[]}
            for(i=1;i<=parcel_coordinates.length;i++){
              console.log(parcel_coordinates[i-1])
              let square=parcel_coordinates[i-1].geometry
              parcel_means.parcels.push({
                "type": "Feature",
              "properties": {
                  "name": parcel_coordinates[i-1].name,
                  "id":i,
                  "address":parcel_coordinates[i-1].address,
                  "owner":parcel_coordinates[i-1].owner,
                  "owner_name":parcel_coordinates[i-1].owner_name,
                  "contributors":parcel_coordinates[i-1].contributors}
              ,"geometry":square})
            }
            var exteriorStyle = {
                "color": "#ffffff",
                "weight": 0,
                "fillOpacity": 0,// Hide all the features
                "opacity":0
            };
            parcel_means.parcels.forEach(parcel => {
                L.geoJSON(parcel,{style: exteriorStyle,onEachFeature: app.onEachFeature}).addTo(CVmap);
        });
    },
    getDataLocal: async (location) => {
            // if we have a local file or a pre-formatted geoJSON file


        //Creating a bunch of features given the data
    const d = await $.getJSON("https://benjythebee.github.io/parceldata/parcels.owner&contributors.json"); // true for asynchronous 
    var exteriorStyle = {
        "color": "#ffffff",
        "weight": 0,
        "fillOpacity": 0,// Hide all the features
        "opacity":0
    };
    d.parcels.forEach(parcel => {
        L.geoJSON(parcel,{style: exteriorStyle,onEachFeature: app.onEachFeature}).addTo(CVmap);
});

                
    },
    whenClicked: async (e) => {// What happens when click on feature
        // e = event
        var title = e.target.feature.properties.name; // Get name or address if no name
        if(!title || title==null){
            title = e.target.feature.properties.address
        }

        var owner = e.target.feature.properties.owner_name;// Get Owner name or Wallet address if no name
        if(!owner || owner==null){
            owner = e.target.feature.properties.owner.slice(0, 9);
        }
        var contributors = 'contributors:'
        console.log(e.target.feature.properties.contributors)// Get the contributors and show in list
        if(e.target.feature.properties.contributors!=null && e.target.feature.properties.contributors[0]!=""){
            
            contributors+="<ul style='margin-top: 0;'>"
            for(i=0;i<e.target.feature.properties.contributors.length;i++){
                console.log(contributors)
                var item = "<li>"+e.target.feature.properties.contributors[i].slice(0, 6)+"</li>"
                contributors+=item
            }
            contributors+="</ul>"
        }else{
            contributors+="none"
        }
        
        if(!owner || owner==null){
            owner = e.target.feature.properties.owner.slice(0, 6);
        }
        // Setting up the popup content
        // Setting a setTimeout cause the object is not created on the click ( a bit slow)
        setTimeout(()=>{
            $('.leaflet-popup').find('.title_name').html("<strong>"+title+"</strong>")
            $('.leaflet-popup').find('.title_owner').html("<strong>"+owner+"</strong>")
            $('.leaflet-popup').find('.collab_box').html(contributors)
        },200)
        
      },
      onEachFeature: async (feature, layer) => {// bind click to every feature
          //bind click
          layer.on({
              click: app.whenClicked
          });
      }
}