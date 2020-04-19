app={
    getData: async () => {

    const d = $.getJSON("api/parcels.json"); // true for asynchronous 
    L.geoJSON(d).addTo(map);
                
    }
}