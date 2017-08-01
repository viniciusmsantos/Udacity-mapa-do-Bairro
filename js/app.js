var map, largeInfowindow;
//variaveis para os pontos no mapa
var markers = [];
var polygon = null;
var placeMarkers = [];


// array de locais
var locations = [
          {title: 'Museu Monteiro Lobato', location: {lat: -23.022231, lng: -45.564466}},
          {title: 'Museu Mazzaropi',location: {lat: -23.045272, lng: -45.528572}},
          {title: 'Museu de História Natural', location: {lat: -23.0156914, lng: -45.5364608}},
          {title: 'Parque vale do Itaim',location: {lat: -23.0372505, lng: -45.5338063}},
          {title: 'Cristo Redentor(Taubaté)',location: {lat: -23.036121, lng: -45.546443}}
        ];

function initMap() {

// estiliza mapa
    var styles = [
    {"featureType": "poi.park","elementType": "geometry.fill","stylers": [{"color": "#f0f1d9"}]},
    {"featureType": "poi.school","elementType": "geometry.fill","stylers": [{"color": "#f0f1d9"}]},
    {"featureType": "poi.school","elementType": "labels","stylers": [{"visibility": "simplified"}]},
    {"featureType": "poi.sports_complex","elementType": "geometry.fill","stylers": [{"color": "#f0f1d9"}]},
    {"featureType": "road","elementType": "all","stylers": [{"color": "#ffffff"}]},
    {"featureType": "road","elementType": "geometry.fill","stylers": [{"color": "#ffffff"}]},
    {"featureType": "road","elementType": "geometry.stroke","stylers": [{"color": "#e9e9e9"},
    {"weight": 0.5}]},
    {"featureType": "road","elementType": "labels","stylers": [{"color": "#c0c0c0"},{"visibility": "simplified"}]},
    {"featureType": "road","elementType": "labels.text.fill","stylers": [{"color": "#969696"}]},
    {"featureType": "water","elementType": "geometry.fill","stylers": [{"color": "#4f8abe"},{"lightness": 70}]}
    ];
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -23.0205, lng: -45.5564},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

// estiliza marcadores
    var defaultIcon = makeMarkerIcon('fbc11b');

// estiliza macardor no mouseover
    var highlightedIcon = makeMarkerIcon('FF4500');

// animação de marcadores ao iniciar o mapa


    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            description: locations[i].description,
            id: i
        });
        markers.push(marker);
        bounds.extend(marker.position);
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleBounce(this);
            //console.log('click');
        });

        function toggleBounce(marker) {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function() {
                marker.setAnimation(null)
                }, 2000);
            }
        }   
        
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }

    //aplica bindings do modelo
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);

    map.fitBounds(bounds);

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);



}


function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }


          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
        marker.addListener('click', function(){
            //console.log('click');
        });
      }



function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


// Cria marcadores para cada lugar 
function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };


        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.id
        });

// Cria infowindow
        var placeInfoWindow = new google.maps.InfoWindow();
        
        marker.addListener('click', function() {
          console.log('click');
            if (placeInfoWindow.marker == this) {
                console.log("This infowindow already is on this marker");
            } else {
                getPlacesDeatails(this, placeInfoWindow);
            }
        });

        placeMarkers.push(marker);
        if (place.geometry.viewport) {

            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }

    map.fitBounds(bounds);
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

// Hides all markers outside the polygon, shows only the markers within.
function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
        if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
            markers[i].setMap(map);
        } else {
            markers[i].setMap(null);
        }
    }
}

// coloca marcadores no menu lateral e filtra
var ViewModel = function() {
    var self = this;
    self.placesList = ko.observableArray(locations);
    
     self.placesList().forEach(function(location, place) {
        location.marker = markers[place];
    });

    self.query = ko.observable('');
    self.filteredPlaces = ko.computed(function() {
     console.log(location)
    return ko.utils.arrayFilter(self.placesList(), function(location) { 
        console.log(location)
        if (location.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
            location.marker.setVisible(true);
            return true;
        } else { 
            location.marker.setVisible(false);
            largeInfowindow.close();   
            return false;
        }
    });
}, self);

    self.marker = ko.observableArray(markers);
    self.description = ko.observable('');




    self.clickMarker = function(location) {
        populateInfoWindow(location.marker, largeInfowindow);
        infoWiki();
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        
        window.setTimeout(function() {
          location.marker.setAnimation(null);
        }, 3000);
        
            function infoWiki(){
            var listItem = location.title
            var url = "https://pt.wikipedia.org/w/api.php?action=opensearch&search="+ listItem +"&format=json&callback=?"; 
            var jqXHR = $.ajax({
                url: url,
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    var title = data[0];
                    var para = data[2][0];
                    var url = data[3][0];
                    self.description('Descrição: <br> <a href="' + url + '">' + title +":"+ ' '+ para +' </br> (Clique para saber mais)</a>');
                    if(para == null){
                        self.description('Não há descrição disponivel');
                    }
                },
                error: function(){
                    console.log("Erro Nos dados wikipedia");
                    self.description('<h2>Falha ao requisitar dados<h2>')
                }
            });
        };
    };

}

// Função de erro  
function googleError() {
  alert("Falha ao carregar o mapa");  
}
