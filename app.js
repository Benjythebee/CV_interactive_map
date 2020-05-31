app={
    getDataLocal: async () => {
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
                                            // Get the contributors and show in list
        if(e.target.feature.properties.contributors!=null && e.target.feature.properties.contributors[0]!=""){
            
            contributors+="<ul style='margin-top: 0;'>"
            for(i=0;i<e.target.feature.properties.contributors.length;i++){

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
        CVmap.on('popupopen',e=>{
            $('.leaflet-popup').find('.title_name').html("<strong>"+title+"</strong>")
            $('.leaflet-popup').find('.title_owner').html("<strong>"+owner+"</strong>")
            $('.leaflet-popup').find('.collab_box').html(contributors)
        })
        /*setTimeout(()=>{
            $('.leaflet-popup').find('.title_name').html("<strong>"+title+"</strong>")
            $('.leaflet-popup').find('.title_owner').html("<strong>"+owner+"</strong>")
            $('.leaflet-popup').find('.collab_box').html(contributors)
        },1200)*/
        
      },
      onEachFeature: async (feature, layer) => {// bind click to every feature
          //bind click
          layer.on({
              click: app.whenClicked
          });
      },
      getDataGET: async (location) => {// If we want to get the Cryptovoxels api (we have to convert it to geoJSON first) 
        //Might face some CORS problems
        
                const d = await $.getJSON("https://www.cryptovoxels.com/api/parcels.json");

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
            getheatmap: async ()=>{

                const d = await $.get("https://benjythebee.github.io/parceldata/Heatmapdata.json");
                console.log(d.length)
                var numTime=d.length
                var data=[]
                for(i=0;i<numTime;i++){
                    data.push(JSON.parse(d[i]))
                }
                
                
                var i=0

                
                var heat = L.heatLayer(data[0].womps,  {radius: 25, gradient:{0.1: 'blue', 0.3: 'lime', 1: 'red' }});
                CVmap.addLayer(heat);
                L.Control.textbox = L.Control.extend({
                    onAdd: function(map) {
                        
                    var text = L.DomUtil.create('div');
                    text.id = "info_text";
                    text.innerHTML = "<strong>Date</strong>"
                    return text;
                    },
            
                    onRemove: function(map) {
                        // Nothing to do here
                    }
                });
                L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
                L.control.textbox({ position: 'topright' }).addTo(CVmap);
                function parse(str) {
                    var y = str.substr(0,4),
                        m = str.substr(4,2) - 1,
                        d = str.substr(6,2);
                        h = str.substr(8,2);
                    var D = new Date(y,m,d,h);
                    return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d && D.getHours() == h) ? D : 'invalid date';
                }
                L.control.liveupdate ({
                    update_map: function () {
                        heat.setLatLngs(data[i].womps)
                        
                        if(i>=0 && i<=5){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Large activity in Shenzhen and Makers</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=6 && i<=9){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Sugar Club is partying in Rome</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=10 && i<=14){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Artists started bulding in Pranksyland + OCM activity</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=15 && i<=19){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Nostro doing some work in Hiro</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=20 && i<=23){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Sugar club is having a break, Nostro testing the womp on megavoxes</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=24 && i<=27){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Further activity in OCM</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=27 && i<=33){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=33 && i<=37){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Activity in Center, Junkyard and Punks</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=38 && i<=42){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Proxima Island is born.</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=42 && i<=48){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Reduced activity after auction was delayed</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=48 && i<=51){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Activity in Mars, Deep South, North Terrace and makers </span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=52 && i<=54){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Sudden surge on Proxima and activity in Le Marais </span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=55 && i<=58){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Things have quieted down, large activity in Modville/Junkyard/Proxima overnight</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }else if(i>=58 && i<=61){
                            $("#info_text")[0].innerHTML="<strong>"+parse(data[i].time)+"</strong><br><span style='text-align: right; float:right;'>Some activity in scripting</span><br><span style='text-align: right; float:right;'>("+i+"/"+numTime+")</span>"
                        }
                        
                        if(i>=numTime-1){
                        i=0
                        }else{
                        i++
                        }
                    },
                    interval: 750
                })
                .addTo(CVmap)
                .startUpdating();
            }
}