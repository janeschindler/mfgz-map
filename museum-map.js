var map;
jQuery(document).ready(function($) {

	var eGuide;
	if(window.location.href.indexOf("eguide") != -1){
		eGuide = true;
	}else{
		eGuide = false;
	}
	var plc;
	if(window.location.href.indexOf("pavillon-le-corbusier") != -1){
			plc = true;
	}else{
			plc = false;
	}




$(window).load(function(){
	if($('body').hasClass('wp-admin')){
		$('#map').height(400);
	}else if($('body').hasClass('single-objekt')){
		if($(window).width() > 800){
			$('#map').height($(window).height() - 68 - 40);
		}else{
			var is_iPad = navigator.userAgent.match(/iPad/i) != null;
			var topStuff = $('.navbar').height() + $('.title-area').height() + 60;
			console.log("topstuff"+topStuff);
			console.log('titlearea'+$('.title-area').height());
			console.log('navbar'+$('.navbar-header').height());
			if(is_iPad == true){
				$('#map').height($(window).height() - topStuff - 20);
			}else{
				$('#map').height($(window).height() - topStuff);
			}
			$('.objekt-location-container').css('top',$('.title-area').height() + 10 + 'px');
		}
	}else if($('body').hasClass('single-ausstellungstexte')){
		if($(window).width() > 800 && $(window).width() > $(window).height()){
			//$('#map').height($(window).height() - 140);
			var textTopStuff = $('h1').height() + 20;
			$('#map').height($(window).height() - textTopStuff - $('.navbar-header').height() - $('#colophon').height() );
			$('.objekt-location-container').css('top',textTopStuff + 'px');
		}else{
			var textTopStuff = $('.navbar-header').height() + $('h1').height() + $('.location-info').height() + parseInt($('h1').css('padding-top')) + parseInt($('h1').css('margin-bottom'));
			$('#map').height($(window).height() - textTopStuff);
			$('.objekt-location-container').css('top',textTopStuff - $('.navbar-header').height() + 'px');
		}
	}else if($('body').hasClass('page-id-1316')){
		if(window.innerHeight > window.innerWidth || $(window).width() < 800){
			$('#map').height($(window).height() - 100);
		}else{
			$('#map').height($(window).height() - 140);
		}
	}else{
		/*$('#map').height($(window).height() - 140);*/
    if($(window).width() > 800){
      $('#map').height($(window).width() * .4);
    }else{
      $('#map').height($(window).width() * .7);
    }
	}
});

	if($('body').hasClass('single-objekt')){
		$('.map-container').append('<span class="close-button-container"><span class="close-button"></span></span>');
		$('.map-container').on('click', '.close-button', function(e){
  		$('.objekt-location-container').fadeToggle();
		});
	}

	//ensure min height of ausstellungstexte
	$('.single-ausstellungstexte .main-content').css('min-height',$(window).height() - 134 -70 +'px');

var overlay;
SvgOverlay.prototype = new google.maps.OverlayView();

var objektCoordFloor = [{lat:47.382946, lng: 8.535739},{floor:'floorplan-eg'}];
if($('#_objekt_location').val() == null || $('#_objekt_location').val() == ""){}else{
	objektCoordFloor = JSON.parse($('#_objekt_location').val());
}
if($('#_objekt_location').text() == null || $('#_objekt_location').text() == ""){}else{if($('body').hasClass('single-objekt') || $('body').hasClass('single-ausstellungstexte')){
	objektCoordFloor = JSON.parse($('#_objekt_location').text());
}}
var	objektPosition = objektCoordFloor[0];
var showFloor = objektCoordFloor[1].floor;
var initZoom;

// case just plc zoom in over plc location
if(plc == true && eGuide == false){
	initZoom = 15;
	if($(window).width() < 800){
		initZoom = 13;
	}
	objektPosition = {lat:47.356249, lng: 8.550879};
} // case plc and eguide -> zoom in close over plc location to see floor plan
else if(plc == true && eGuide == true){
	initZoom = 20;
	objektPosition = {lat:47.356249, lng: 8.550879};
} // case not plc and not eguide -> zoom in over musuem location
else if(eGuide == false){
	initZoom = 14;
		if($(window).width() < 800){
			initZoom = 13;
		}
	objektPosition = {lat:47.386806, lng:8.523518};
} // case eguide only -> zoom in close to museum to see floor plan
else {
	initZoom = 20;
}


      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
					center: objektPosition,
          zoom: initZoom,
					mapTypeId: google.maps.MapTypeId.ROAD,
					mapTypeControl: false,
					streetViewControl: false,
					fullscreenControl:false,
					styles: [
							{
								"stylers": [
									{
										"saturation": -100
									},
									{
										"lightness": -25
									}
								]
							},
							{
								"featureType": "landscape.man_made",
								"elementType": "geometry",
								"stylers": [
									{
										"visibility": "off"
									}
								]
							}
						]
        });


			//marker and infowindow Ausstellungsstr.
			var markerAusstellungsstr = {
					path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
					fillColor: 'rgb(225,0,45)',
					fillOpacity: 1,
					scale: 1,
					strokeColor: 'rgb(225,0,45)',
					strokeWeight: 14
				};

				//marker for zoomed out
				marker = new google.maps.Marker({
          //position: map.getCenter(),
					position: {lat:47.382946, lng: 8.535739},
					icon: markerAusstellungsstr,
          draggable: false,
          map: map
        });

			//info window for zoomed out
			var infoWindowAustellungsstr = document.getElementById('info-ausstellungsstr');
			infowindow = new google.maps.InfoWindow({
          content: infoWindowAustellungsstr,
					disableAutoPan: true
        });
			//infowindow.open(map, marker);

			//button to zoom to indoor map
			$("body").on("click", ".see-floorplan", function(){
				map.panTo({lat:47.382946, lng: 8.535739});
				map.setZoom(20);
			});

		//marker toni-areal
			var markerToniShape = {
					path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
					fillColor: 'rgb(50,110,180)',
					fillOpacity: 1,
					scale: 1,
					strokeColor: 'rgb(50,110,180)',
					strokeWeight: 14
				};

				//marker for zoomed out
				markerToni = new google.maps.Marker({
          //position: map.getCenter(),
					position: {lat:47.390221, lng: 8.511489},
					icon: markerToniShape,
          draggable: false,
          map: map
        });

			//info window for zoomed out
			var infoWindowToniContent = document.getElementById('info-toni');
			infowindowToni = new google.maps.InfoWindow({
          content: infoWindowToniContent,
					disableAutoPan: true
        });
			//infowindow.open(map, markerToni);

			//marker plc
				var markerPLCShape = {
						path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
						fillColor: 'rgb(50,50,180)',
						fillOpacity: 1,
						scale: 1,
						strokeColor: 'rgb(50,110,180)',
						strokeWeight: 14
					};

					//marker for zoomed out
					markerPLC = new google.maps.Marker({
	          //position: map.getCenter(),
						position: {lat:47.356249, lng: 8.550879},
						icon: markerPLCShape,
	          draggable: false,
	          map: map
	        });

				//info window for zoomed out
				var infoWindowPLCContent = document.getElementById('info-plc');
				infowindowPLC = new google.maps.InfoWindow({
	          content: infoWindowPLCContent,
						disableAutoPan: true
	        });

marker.setVisible(false);
markerToni.setVisible(false);

//find out if person is in bounds: constants here are the bounds.
  realisticBoundsAusstellungsstr = new google.maps.LatLngBounds(
      new google.maps.LatLng(47.381198, 8.534804),
      new google.maps.LatLng(47.384409, 8.538431)
  );

  realisticBoundsToni = new google.maps.LatLngBounds(
      new google.maps.LatLng(47.389183, 8.510298),
      new google.maps.LatLng(47.391986, 8.514051)
  );

  realisticBoundsTest = new google.maps.LatLngBounds(
      new google.maps.LatLng(47.366133, 8.519503),
      new google.maps.LatLng(47.366888, 8.520409)
  );

	var mapCenter = map.getCenter();
google.maps.event.addListener(map, 'center_changed', function() {
	mapCenter = map.getCenter();
			if( (realisticBoundsAusstellungsstr.contains(mapCenter) == true && map.getZoom() > 17) || (realisticBoundsToni.contains(mapCenter) == true && map.getZoom() > 17) ){
      	$('#floor-control').show();
			}else{
      	$('#floor-control').hide();
			}

});


			//open info windows on zoom out
    var zoom = map.getZoom();
    $('#map').addClass('zoom-'+zoom);
		if(zoom > 17){
			infowindow.close(map, marker);
			infowindowToni.close(map, markerToni);
			infowindowPLC.close(map, markerPLC);
			$('#floor-control').show();
			marker.setVisible(false);
			markerToni.setVisible(false);
			markerPLC.setVisible(false);
		}else{
			infowindow.open(map, marker);
			infowindowToni.open(map, markerToni);
			infowindowPLC.open(map, markerPLC);
			$('#floor-control').hide();
			if($('body').hasClass('wp-admin') == true){}else{
				marker.setVisible(true);
				markerToni.setVisible(true);
				markerPLC.setVisible(true);
			}
		}
google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoom = map.getZoom();
    $('#map').addClass('zoom-'+zoom);
    if(zoom > 17){
      infowindow.close(map, marker);
      infowindow.close(map, markerToni);
			infowindowPLC.close(map, markerPLC);
			if(realisticBoundsAusstellungsstr.contains(mapCenter) == true || realisticBoundsToni.contains(mapCenter) == true){
      	$('#floor-control').show();
			}
      marker.setVisible(false);
      markerToni.setVisible(false);
			markerPLC.setVisible(false);
    }else{
      $('#floor-control').hide();
			if($('body').hasClass('wp-admin') == true){}else{
      	infowindow.open(map, marker);
      	infowindowToni.open(map, markerToni);
				infowindowPLC.open(map, markerPLC);
				marker.setVisible(true);
				markerToni.setVisible(true);
				markerPLC.setVisible(true);
			}
    }

});

google.maps.event.addListenerOnce(map, 'idle', function() {
	//a dumb way to test if map is ready that works in another function.
	$('body').trigger('click');
});

//show/hide floors and make a variable that holds new coordinates and floor for admin map
var floorControl = document.getElementById('floor-control');

google.maps.event.addListenerOnce(map, 'idle', function(){
		$('.floor-button').removeClass('active');
		$('.floorplan').hide();
		$('.'+showFloor).show();
		$('.'+showFloor).parent().addClass('active');
		console.log(showFloor);
});
google.maps.event.addDomListener(floorControl, 'click', function(e) {
		showFloor = $(e.target).attr('class');
		$('.floor-button').removeClass('active');
		$(e.target).parent().addClass('active');
	  $('.floorplan').hide();
		$('.'+showFloor).show();
		console.log('object-floor'+objektCoordFloor[1].floor);

	if($('body').hasClass('wp-admin')){
		objektCoordFloor[1].floor = showFloor;
    document.getElementById("_objekt_location").value = JSON.stringify(objektCoordFloor);
	}

});


//admin stuff
if($('body').hasClass('wp-admin') || $('body').hasClass('single-objekt') || $('body').hasClass('single-ausstellungstexte')){
//draggable placement marker
var markerObjektShape = {
		path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
		//fillColor: 'rgb(0,0,0)',
		fillColor: 'rgb(225,0,45)',
		fillOpacity: 1,
		scale: 1,
		//strokeColor: 'rgb(0,0,0)',
		strokeColor: 'rgb(225,0,45)',
		strokeWeight: 14
	};

var draggable = false;
if($('body').hasClass('wp-admin')){
	draggable = true;
}
var objektMarker = new google.maps.Marker({
  draggable: draggable,
  position: objektPosition,
	//position: {lat:47.382946, lng: 8.535739},
  map: map,
  title: "Objekt",
	icon: markerObjektShape
  });

google.maps.event.addListener(objektMarker, 'dragend', function (event) {
		var lat = this.getPosition().lat();
		var lng = this.getPosition().lng();
		var coord = {lat: lat, lng: lng};
		objektCoordFloor[0] = coord;
		console.log(objektCoordFloor);
    document.getElementById("_objekt_location").value = JSON.stringify(objektCoordFloor);
});


var floorControl = document.getElementById('floor-control');
google.maps.event.addDomListener(floorControl, 'click', function(e) {
		showFloor = $(e.target).attr('class');
		//show/hide marker
		if(showFloor == objektCoordFloor[1].floor){
					objektMarker.setVisible(true)
		}else{
					objektMarker.setVisible(false);
		}


});


}

/*geolocation*/
//are you on the outdoor themenweg?
var outDoorTour = false;
function isOutDoorTour(){
	if($('body').hasClass('term-themenweg-mfgz-landesmuseum') || $('body').hasClass('term-themenweg-landesmuseum-mfgz') || $('.themenweg').length > 0){
		outDoorTour = true;
	}else{
		outDoorTour = false;
	}
	return outDoorTour;
}
outDoorTour = isOutDoorTour();

	//geolocate info window
	 infoWindow = new google.maps.InfoWindow;
	 userMarker = null;
	 accuracyCircle = null;

	// Try HTML5 geolocation.
	$('#locator-tool').click(function(){
		$(this).addClass('locating-blink');
	if (navigator.geolocation) {
		//navigator.geolocation.getCurrentPosition(function(position) {
		navigator.geolocation.watchPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			//infoWindow.open(map);
			map.setCenter(pos);
			console.log(position.coords.accuracy);
			$('#locator-tool').removeClass('locating-blink');

			var geolocateObjektShape = {
					path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
					fillColor: 'rgb(255,255,255)',
					fillOpacity: 1,
					scale: 2.5,
					strokeColor: 'rgb(0,0,0)',
					strokeWeight: 3
				};

			console.log(realisticBoundsAusstellungsstr.contains(pos));
			console.log(realisticBoundsToni.contains(pos));
			console.log(realisticBoundsTest.contains(pos));
			if(realisticBoundsAusstellungsstr.contains(pos) == false && realisticBoundsToni.contains(pos) == false && realisticBoundsTest.contains(pos) == false && outDoorTour == false ){
				infoWindow.setPosition(objektPosition);
				infoWindow.setContent('You are too far from the object');
				map.setCenter(objektPosition);
				infoWindow.open(map);
			}else{ if (userMarker && userMarker.setPosition) {
	        userMarker.setPosition(pos);
					accuracyCircle.setRadius(position.coords.accuracy);
					accuracyCircle.setCenter(pos);
			} else {
				userMarker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: geolocateObjektShape
        });
				accuracyCircle = new google.maps.Circle({
            strokeColor: '#000',
            strokeOpacity: 0.8,
            strokeWeight: .5,
            fillColor: '#000',
            fillOpacity: 0.35,
            map: map,
            center: pos,
            radius: position.coords.accuracy
          });

				}//end you are at a location

			}

		}, function(error) {
			handleLocationError(true, infoWindow, map.getCenter(), error);
		}, {enableHighAccuracy: true});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}


function handleLocationError(browserHasGeolocation, infoWindow, pos, error) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
												'Error: The Geolocation service failed.' :
												'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
	$('#locator-tool').removeClass('locating-blink');
	console.log(error);
}
	});




				//museum as SVG overlay?

  bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(47.382482, 8.535468),
      new google.maps.LatLng(47.383638, 8.537230)
  );

	var srcImage = '';

  // The custom USGSOverlay object contains the USGS image,
  // the bounds of the image, and a reference to the map.
  overlay = new SvgOverlay(bounds, /*srcImage,*/ map);
}

function SvgOverlay( bounds, /*image, */map ) {
  this.bounds_ = bounds;
  //this.image_ = image;
  this.map_ = map;
  this.div_ = null;
  this.setMap( map );
}

SvgOverlay.prototype.onAdd = function() {

  var divFloorPlan = document.createElement("div");
  divFloorPlan.style.position = "absolute";
	divFloorPlan.className = 'floorplan-container';

	//UG
	var floorUG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 691.859 482.684" enable-background="new 0 0 691.859 482.684" xml:space="preserve"> <g id="new_drawing_basement"> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="92.17,406.214 0.258,304.092 246.889,82.11 338.807,184.228 	"/> <rect x="-7.404" y="321.301" transform="matrix(-0.6691 -0.7431 0.7431 -0.6691 -101.462 671.2721)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="212.217" height="73.844"/> <rect x="84.347" y="224.305" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -17.7824 619.22)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.067" stroke-miterlimit="10" width="89.233" height="178.528"/> <polygon fill="#9D9D9C" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="664.27,375.444 670.082,370.212 337.432,0.624 246.906,82.108 606.887,482.06 691.602,405.812 	"/> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="664.27,375.444 670.082,370.212 337.432,0.624 246.906,82.108 606.887,482.06 691.602,405.812 	"/> <g> <rect x="61.686" y="279.179" transform="matrix(-0.6692 -0.7431 0.7431 -0.6692 -90.0953 533.73)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="24.146" height="15.482"/> </g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" x1="38.618" y1="334.879" x2="98.327" y2="401.192"/> <g> <rect x="44.35" y="286.976" transform="matrix(0.6691 0.7432 -0.7432 0.6691 240.5288 54.8493)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" width="28.643" height="21.098"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="58.118" y1="312.675" x2="73.798" y2="298.557"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="55.683" y1="309.971" x2="71.361" y2="295.854"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="53.246" y1="307.266" x2="68.928" y2="293.148"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="50.812" y1="304.561" x2="66.49" y2="290.444"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="48.377" y1="301.855" x2="64.055" y2="287.738"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="45.941" y1="299.153" x2="61.619" y2="285.033"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="43.506" y1="296.445" x2="59.184" y2="282.329"/> </g> </g> </g> <g id="lock"> </g> <g id="Ebene_5"> </g> <g id="new_drawing_top_floor"> </g> <g id="exhibits"> <text transform="matrix(0.669 0.7434 -0.743 0.6693 131.8984 288.2432)">Reform</text> <text transform="matrix(0.669 0.7434 -0.743 0.6693 140.3193 271.127)">Das neue Heim</text> <text transform="matrix(0.669 0.7434 -0.743 0.6693 178.3486 277.5059)">Die gute Form</text> <text transform="matrix(0.669 0.7434 -0.743 0.6693 160.4678 293.5146)">Postfunktional</text> <text transform="matrix(0.669 0.7434 -0.743 0.6693 152.9375 311.625)">Pop</text> <polygon fill="none" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="112.113,289.269 151.744,333.307 202.434,287.649 162.803,243.61 	"/> <polygon fill="none" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="147.576,257.325 165.682,277.442 147.93,293.43 129.826,273.314 	"/> <polygon fill="none" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="112.113,289.269 133.938,313.519 151.648,297.564 129.826,273.314 	"/> <polygon fill="none" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="151.744,333.307 133.938,313.519 151.648,297.564 169.457,317.353 	"/> <polygon fill="none" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="184.146,304.122 162.621,280.199 147.93,293.43 169.457,317.353 	"/> <polygon fill="none" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="184.146,304.122 162.621,280.199 180.906,263.729 202.434,287.649 	"/> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="119.977,298.007 140.982,321.345 146.781,316.122 125.777,292.782 	"/> <text transform="matrix(0.669 0.7434 -0.743 0.6693 129.7705 304.3032)">Minimal</text> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="189.959,273.787 180.906,263.729 171.854,253.67 162.803,243.61 147.576,257.325 165.682,277.442 176.123,268.035 185.174,278.094 	"/> <text transform="matrix(0.669 0.7434 -0.743 0.6693 159.3223 256.3623)">Wohnbedarf</text> </g> <g id="exhibits_1"> <rect x="75.305" y="326.548" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -111.9666 606.7006)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.584" height="3.463"/> <rect x="80.38" y="332.183" transform="matrix(-0.6686 -0.7436 0.7436 -0.6686 -107.8526 619.7688)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.58" height="3.466"/> <rect x="85.451" y="337.819" transform="matrix(-0.6686 -0.7436 0.7436 -0.6686 -103.5751 632.9507)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.583" height="3.468"/> <rect x="90.52" y="343.459" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -99.14 646.2365)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.584" height="3.464"/> <rect x="95.595" y="349.095" transform="matrix(-0.6688 -0.7435 0.7435 -0.6688 -94.9799 659.3405)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.582" height="3.466"/> <rect x="100.664" y="354.731" transform="matrix(-0.6686 -0.7436 0.7436 -0.6686 -90.7911 672.4661)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.584" height="3.468"/> <rect x="105.736" y="360.371" transform="matrix(-0.669 -0.7433 0.7433 -0.669 -86.3494 685.7517)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="7.582" height="3.466"/> <rect x="72.116" y="321.747" transform="matrix(0.669 0.7432 -0.7432 0.669 266.2234 52.6532)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0655" stroke-miterlimit="10" width="3.751" height="7.005"/> <rect x="66.905" y="326.431" transform="matrix(0.6686 0.7436 -0.7436 0.6686 268.1334 58.1885)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="3.751" height="7.008"/> <rect x="61.693" y="331.115" transform="matrix(0.6687 0.7435 -0.7435 0.6687 269.8429 63.5808)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="3.75" height="7.009"/> <rect x="62.252" y="338.284" transform="matrix(-0.6687 -0.7435 0.7435 -0.6687 -142.6132 616.4848)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="7.58" height="3.464"/> <rect x="67.321" y="343.92" transform="matrix(-0.669 -0.7433 0.7433 -0.669 -138.2273 629.7449)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="7.585" height="3.464"/> <rect x="72.394" y="349.558" transform="matrix(-0.6688 -0.7434 0.7434 -0.6688 -134.0087 642.8856)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="7.584" height="3.466"/> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" points="77.433,355.268 82.503,360.904 85.083,358.588 80.011,352.951 	"/> <rect x="82.536" y="360.832" transform="matrix(-0.6689 -0.7433 0.7433 -0.6689 -125.4386 669.2575)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="7.583" height="3.464"/> <rect x="87.607" y="366.468" transform="matrix(-0.6688 -0.7435 0.7435 -0.6688 -121.2176 682.3986)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="7.584" height="3.466"/> <rect x="92.68" y="372.107" transform="matrix(-0.669 -0.7433 0.7433 -0.669 -116.8543 695.6392)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="7.585" height="3.465"/> <rect x="110.127" y="363.998" transform="matrix(0.6689 0.7433 -0.7433 0.6689 310.2637 38.42)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="3.752" height="7.006"/> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" points="110.651,371.236 108.144,368.449 102.931,373.133 105.44,375.92 	"/> <rect x="99.706" y="373.366" transform="matrix(0.6692 0.7431 -0.7431 0.6692 313.6624 49.1947)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="3.751" height="7.006"/> <rect x="91.902" y="309.193" transform="matrix(0.6686 0.7436 -0.7436 0.6686 263.5992 33.8885)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" width="3.751" height="7.008"/> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="92.425,316.434 98.771,323.486 101.351,321.17 95.005,314.116 	"/> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" points="98.771,323.486 105.116,330.538 107.694,328.221 101.351,321.17 	"/> <rect x="104.834" y="331.172" transform="matrix(-0.6688 -0.7434 0.7434 -0.6688 -64.6349 637.015)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" width="9.485" height="3.466"/> <rect x="111.179" y="338.223" transform="matrix(-0.6687 -0.7435 0.7435 -0.6687 -59.3162 653.486)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" width="9.483" height="3.467"/> <rect x="117.52" y="345.274" transform="matrix(-0.6689 -0.7434 0.7434 -0.6689 -53.9196 669.9974)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" width="9.487" height="3.467"/> <rect x="126.133" y="347.241" transform="matrix(0.6689 0.7433 -0.7433 0.6689 303.1077 20.9744)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0654" stroke-miterlimit="10" width="3.752" height="7.009"/> <g> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 69.0264 365.6021)">AA</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 72.8672 325.1548)">A</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 67.626 329.8062)">B</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 62.373 334.4985)">C</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 110.7441 367.2563)">M</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 105.7705 372.2046)">L</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 100.4141 376.7817)">K</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 64.8125 339.896)">D</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 69.958 345.6167)">E</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 75.0898 351.3208)">F</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 79.9395 356.7104)">G</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 85.0996 362.4458)">H</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 90.5986 368.5581)">I</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 95.4941 374.0005)">J</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 77.9473 328.356)">T</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 82.9307 333.895)">S</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 95.6934 318.8276)">V</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 101.8447 325.6646)">W</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 108.375 332.9233)">X</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 114.6426 339.8901)">Y</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 121.0713 347.0356)">Z</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 88.0176 339.5493)">R</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 92.9111 344.9888)">Q</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 98.1758 350.8403)">P</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 103.2139 356.4399)">O</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 108.2578 362.0474)">N</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 92.6016 312.5708)">U</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 126.3848 350.1196)">ZZ</text> </g> <rect x="84.106" y="292.09" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -75.5347 555.9362)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0165" stroke-miterlimit="10" width="3.779" height="5.388"/> <rect x="86.873" y="324.836" transform="matrix(-0.6691 -0.7431 0.7431 -0.6691 -50.6487 632.5098)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0641" stroke-miterlimit="10" width="57.211" height="5.388"/> <rect x="136.673" y="353.521" transform="matrix(0.6691 0.7432 -0.7432 0.6691 311.4983 12.8604)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0258" stroke-miterlimit="10" width="9.27" height="5.388"/> </g> </svg>';
	var divFloorPlanUG = document.createElement("div");
	divFloorPlanUG.innerHTML = floorUG;
	divFloorPlanUG.className = 'floorplan floorplan-ug';
	$(divFloorPlanUG).append('<div class="label saal-1"><span class="text">Saal 2</span></div>');
	$(divFloorPlanUG).append('<div class="label saal-2"><span class="text">Saal 1</span></div>');
	$(divFloorPlanUG).append('<div class="label tech lift lift-1"><i class="mfgz-sym" aria-hidden="true">C</i></div>');
	$(divFloorPlanUG).append('<div class="label tech stair stair-4"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlan).append(divFloorPlanUG);

	//EG
	var floorEG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 691.859 482.684" enable-background="new 0 0 691.859 482.684" xml:space="preserve"> <g id="Ebene_1"> <rect x="101.056" y="77.593" transform="matrix(0.669 0.7433 -0.7433 0.669 237.1831 -45.5696)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="137.393" height="331.818"/> <rect x="1.737" y="300.685" transform="matrix(-0.6691 -0.7431 0.7431 -0.6691 -115.7857 623.6642)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="158.415" height="73.845"/> <polygon fill="#9D9D9C" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="664.508,374.819 670.321,369.587 337.67,0 247.146,81.484 607.125,481.436 691.84,405.188 	"/> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="664.508,374.819 670.321,369.587 337.67,0 247.146,81.484 607.125,481.436 691.84,405.188 	"/> <rect x="50.45" y="249.617" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -75.5705 504.7941)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0829" stroke-miterlimit="10" width="48.286" height="39.207"/> <rect x="-2.091" y="309.403" transform="matrix(-0.6691 -0.7431 0.7431 -0.6691 -198.1667 545.0628)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="48.695" height="14.487"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" d="M86.09,226.379l-13.047,11.764l32.312,35.886 l-29.172,26.246l59.604,66.223l42.218-37.999L86.09,226.379z"/> <g> <rect x="61.783" y="278.384" transform="matrix(-0.6692 -0.7431 0.7431 -0.6692 -89.3424 532.4753)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0705" stroke-miterlimit="10" width="24.146" height="15.482"/> </g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" x1="150.568" y1="353.247" x2="90.926" y2="287.009"/> <g> <rect x="44.426" y="286.133" transform="matrix(0.6691 0.7432 -0.7432 0.6691 239.9277 54.5138)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" width="28.643" height="21.098"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="58.194" y1="311.832" x2="73.874" y2="297.714"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="55.759" y1="309.128" x2="71.438" y2="295.012"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="53.322" y1="306.423" x2="69.004" y2="292.306"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="50.888" y1="303.718" x2="66.566" y2="289.602"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="48.453" y1="301.013" x2="64.131" y2="286.896"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="46.018" y1="298.311" x2="61.695" y2="284.19"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="43.582" y1="295.603" x2="59.26" y2="281.486"/> </g> </g> <g> <rect x="87.939" y="248.774" transform="matrix(0.6691 0.7431 -0.7431 0.6691 225.213 9.2122)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" width="28.643" height="17.514"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="103.04" y1="271.483" x2="116.055" y2="259.766"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="100.604" y1="268.779" x2="113.62" y2="257.062"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="98.171" y1="266.075" x2="111.185" y2="254.356"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="95.735" y1="263.368" x2="108.747" y2="251.651"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="93.3" y1="260.664" x2="106.313" y2="248.948"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="90.862" y1="257.96" x2="103.878" y2="246.241"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="88.43" y1="255.255" x2="101.442" y2="243.534"/> </g> </g> <g> <rect x="133.185" y="298.974" transform="matrix(0.6691 0.7431 -0.7431 0.6691 277.4954 -7.7997)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" width="28.643" height="17.515"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="148.284" y1="321.683" x2="161.301" y2="309.963"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="145.849" y1="318.978" x2="158.864" y2="307.258"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="143.414" y1="316.272" x2="156.43" y2="304.556"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="140.978" y1="313.567" x2="153.992" y2="301.849"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="138.544" y1="310.86" x2="151.557" y2="299.146"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="136.109" y1="308.158" x2="149.123" y2="296.438"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="133.674" y1="305.454" x2="146.687" y2="293.735"/> </g> </g> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="131.406,302.963 164.996,340.267 150.57,353.25 116.982,315.947 	"/> </g> </svg>';
	var divFloorPlanEG = document.createElement("div");
	divFloorPlanEG.innerHTML = floorEG;
	divFloorPlanEG.className = 'floorplan floorplan-eg';
	$(divFloorPlanEG).append('<div class="label halle-eg"><span class="text">Halle</span></div>');
	$(divFloorPlanEG).append('<div class="label shop"><span class="text en">Shop</span><span class="text de">Shop</span><span class="text fr">Boutique</span><i class="mfgz-sym" aria-hidden="true">E</i></div>');
	$(divFloorPlanEG).append('<div class="label tech lift lift-1"><i class="mfgz-sym" aria-hidden="true">C</i></div>');
	$(divFloorPlanEG).append('<div class="label tech stair stair-1"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlanEG).append('<div class="label tech stair stair-2"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlanEG).append('<div class="label tech stair stair-4"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlanEG).append('<div class="label tech drinking-fountain-1"><i class="mfgz-sym" aria-hidden="true">G</i></div>');
	$(divFloorPlanEG).append('<div class="label cafe"><span class="text">Café</span><i class="mfgz-sym" aria-hidden="true">D</i></div>');
	$(divFloorPlan).append(divFloorPlanEG);

	//1. OG
	var floor1 = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 691.859 482.684" enable-background="new 0 0 691.859 482.684" xml:space="preserve"> <g id="new_drawing_second_to_top_floor"> <rect x="124.096" y="78.857" transform="matrix(0.669 0.7433 -0.7433 0.669 238.328 -45.6176)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="92.567" height="331.82"/> <rect x="118.397" y="182.824" transform="matrix(0.7431 -0.6691 0.6691 0.7431 -85.3121 194.5581)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0969" stroke-miterlimit="10" width="184.736" height="51.157"/> <rect x="170.314" y="134.683" transform="matrix(0.7432 -0.6691 0.6691 0.7432 -38.8025 189.2466)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0487" stroke-miterlimit="10" width="113.581" height="20.967"/> <rect x="-7.681" y="320.677" transform="matrix(-0.6691 -0.7431 0.7431 -0.6691 -101.462 670.024)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="212.217" height="73.843"/> <polygon fill="#9D9D9C" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="663.991,374.82 669.805,369.588 337.153,0 246.629,81.484 606.608,481.436 691.323,405.188 	"/> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="663.991,374.82 669.805,369.588 337.153,0 246.629,81.484 606.608,481.436 691.323,405.188 	"/> <g> <rect x="61.267" y="278.385" transform="matrix(-0.6692 -0.7431 0.7431 -0.6692 -90.2046 532.0935)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="24.146" height="15.482"/> </g> <g> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0933" stroke-miterlimit="10" points="11.334,293.246 43.636,329.119 32.293,339.327 -0.01,303.451 		"/> </g> <g> <rect x="45.106" y="260.45" transform="matrix(-0.6692 -0.7431 0.7431 -0.6692 -103.8515 490.1489)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0705" stroke-miterlimit="10" width="24.146" height="15.482"/> </g> <g> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.054" stroke-miterlimit="10" points="43.634,329.122 22.349,305.475 54.373,276.618 75.66,300.266 		"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="24.474" y1="307.836" x2="56.522" y2="278.979"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="41.343" y1="326.57" x2="73.391" y2="297.713"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="38.905" y1="323.867" x2="70.954" y2="295.011"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="36.468" y1="321.163" x2="68.521" y2="292.306"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="34.034" y1="318.457" x2="66.081" y2="289.603"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="31.6" y1="315.75" x2="63.648" y2="286.894"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="29.163" y1="313.051" x2="61.212" y2="284.191"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="26.731" y1="310.342" x2="58.776" y2="281.485"/> </g> </g> <rect x="69.533" y="355.055" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -75.3461 750.4083)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0671" stroke-miterlimit="10" width="119.697" height="73.844"/> <g> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0746" stroke-miterlimit="10" points="104.592,274.233 134.197,307.112 116.785,322.788 87.178,289.905 		"/> </g> <g> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0682" stroke-miterlimit="10" points="125.395,297.296 107.973,312.954 96.5,300.294 113.921,284.638 		"/> <g> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M106.558,291.199"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M117.947,303.848"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M108.993,289.006"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M120.383,301.655"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M111.69,286.645"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M123.08,299.294"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M98.885,298.144"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M110.274,310.793"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M96.487,300.265"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M107.877,312.914"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M103.853,293.635"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M115.245,306.287"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M101.146,296.069"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" d="M112.539,308.721"/> </g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="117.87" y1="304.024" x2="106.479" y2="291.376"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="120.356" y1="301.786" x2="108.968" y2="289.136"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="122.876" y1="299.583" x2="111.431" y2="286.904"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="110.426" y1="310.763" x2="99.008" y2="298.084"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="115.386" y1="306.267" x2="103.993" y2="293.614"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="112.897" y1="308.505" x2="101.503" y2="295.853"/> </g> <g> <rect x="75.72" y="261.389" transform="matrix(-0.6693 -0.743 0.743 -0.6693 -56.3718 521.1136)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0746" stroke-miterlimit="10" width="24.148" height="23.428"/> </g> <g> <rect x="90.914" y="250.642" transform="matrix(0.6691 0.7432 -0.7432 0.6691 226.8566 9.2938)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0636" stroke-miterlimit="10" width="24.155" height="17.513"/> <g> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M115.284,259.964"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M102.269,271.683"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M112.849,257.26"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M99.835,268.977"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M110.414,254.555"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M97.4,266.272"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M107.978,251.852"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M94.966,263.567"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M105.349,248.969"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M92.337,260.685"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M102.992,246.295"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M89.98,258.011"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M101.471,244.563"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M88.459,256.279"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M117.592,262.518"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M104.58,274.233"/> </g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="102.277" y1="271.65" x2="115.293" y2="259.932"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="99.972" y1="269.086" x2="112.985" y2="257.37"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="97.666" y1="266.525" x2="110.68" y2="254.807"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="95.359" y1="263.963" x2="108.371" y2="252.247"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="93.034" y1="261.418" x2="106.047" y2="249.701"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="90.758" y1="258.83" x2="103.769" y2="247.115"/> </g> <g> <rect x="136.714" y="301.494" transform="matrix(0.6691 0.7431 -0.7431 0.6691 279.7825 -7.9121)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0636" stroke-miterlimit="10" width="24.126" height="17.515"/> <g> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M156.773,306.046"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M143.76,317.767"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M154.34,303.344"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M141.327,315.061"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M151.904,300.638"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M138.891,312.355"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M149.469,297.934"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M136.455,309.651"/> </g> </g> <g> <rect x="121.482" y="312.221" transform="matrix(-0.6692 -0.7431 0.7431 -0.6692 -17.7722 639.9617)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0791" stroke-miterlimit="10" width="24.148" height="23.43"/> </g> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M161.642,311.453"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M148.628,323.174"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M163.355,313.354"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M150.342,325.075"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M159.208,308.751"/> <path fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" d="M146.195,320.468"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="143.424" y1="317.391" x2="156.437" y2="305.67"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="141.117" y1="314.826" x2="154.131" y2="303.11"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="138.812" y1="312.266" x2="151.824" y2="300.548"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="136.504" y1="309.706" x2="149.518" y2="297.988"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="148.034" y1="322.514" x2="161.049" y2="310.793"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0693" stroke-miterlimit="10" x1="145.73" y1="319.95" x2="158.742" y2="308.234"/> </g> <g id="Ebene_1"> <line fill="none" stroke="#9D9D9C" stroke-width="0.0745" stroke-miterlimit="10" x1="38.328" y1="291.075" x2="59.618" y2="314.72"/> </g> <g id="exhibits_1"> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 280.123 133.5918)">A</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 295.2158 150.3564)">B</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 310.3652 167.1777)">C</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 178.2773 285.9355)">M</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 191.7139 274.3135)">L</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 204.791 262.2891)">K</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 297.1484 179.0479)">D</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 284.0234 191.0146)">E</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 270.8838 202.9688)">F</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 257.5195 214.6709)">G</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 244.3496 226.5898)">H</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 231.4922 238.8545)">I</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 218.2031 250.6406)">J</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 116.7607 241.5312)">Q</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 124.7402 285.5156)">P</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 137.3574 273.916)">O</text> <text transform="matrix(0.7238 0.8045 -0.7437 0.6685 165.1641 297.918)">N</text> </g> </svg>';
	var divFloorPlan1 = document.createElement("div");
	divFloorPlan1.innerHTML = floor1;
	divFloorPlan1.className = 'floorplan floorplan-1';
	$(divFloorPlan1).append('<div class="label galerie-1"><span class="text">Galerie 1</span></div>');
	$(divFloorPlan1).append('<div class="label tech garderobe"><span class="text de">Garderobe</span><span class="text en">Cloakroom</span><span class="text fr">Vestiaire</span><i class="mfgz-sym" aria-hidden="true">F</i></div>');
	$(divFloorPlan1).append('<div class="label tech lift lift-1"><i class="mfgz-sym" aria-hidden="true">C</i></div>');
	$(divFloorPlan1).append('<div class="label tech stair stair-1"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlan1).append('<div class="label tech stair stair-2"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlan1).append('<div class="label tech wc wc-1"><i class="mfgz-sym" aria-hidden="true">A</i></div>');
	$(divFloorPlan1).append('<div class="label tech wc wc-2"><i class="mfgz-sym" aria-hidden="true">A</i></div>');
	$(divFloorPlan1).append('<div class="label vortragssaal"><span class="text">Vortragssaal</span></div>');
	$(divFloorPlan).append(divFloorPlan1);

	//2. OG
	var floor2 = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 691.859 482.684" enable-background="new 0 0 691.859 482.684" xml:space="preserve"> <g id="new_drawing_top_floor"> <rect x="124.154" y="78.859" transform="matrix(0.669 0.7433 -0.7433 0.669 238.3502 -45.6591)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="92.566" height="331.819"/> <rect x="102.726" y="195.653" transform="matrix(0.7431 -0.6691 0.6691 0.7431 -105.4876 167.6593)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0665" stroke-miterlimit="10" width="125.826" height="51.158"/> <rect x="66.463" y="208.807" transform="matrix(0.7431 -0.6691 0.6691 0.7431 -95.2288 186.5997)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0989" stroke-miterlimit="10" width="257.955" height="17.065"/> <rect x="-7.62" y="320.677" transform="matrix(-0.6691 -0.7431 0.7431 -0.6691 -101.3593 670.0698)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="212.217" height="73.843"/> <polygon fill="#9D9D9C" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="664.053,374.82 669.866,369.588 337.215,0 246.69,81.484 606.67,481.436 691.385,405.188 	"/> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="664.053,374.82 669.866,369.588 337.215,0 246.69,81.484 606.67,481.436 691.385,405.188 	"/> <g> <rect x="61.323" y="278.395" transform="matrix(-0.6692 -0.7431 0.7431 -0.6692 -90.113 532.1421)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.0705" stroke-miterlimit="10" width="24.146" height="15.47"/> </g> <g> <rect x="95.899" y="285.564" transform="matrix(0.7431 -0.6691 0.6691 0.7431 -168.4639 149.2861)" fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" width="28.643" height="17.023"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="124.01" y1="293.114" x2="112.617" y2="280.465"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="121.305" y1="295.55" x2="109.915" y2="282.9"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="118.601" y1="297.985" x2="107.211" y2="285.335"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="115.895" y1="300.419" x2="104.506" y2="287.771"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="113.189" y1="302.855" x2="101.801" y2="290.206"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="110.486" y1="305.294" x2="99.096" y2="292.64"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0683" stroke-miterlimit="10" x1="107.779" y1="307.726" x2="96.387" y2="295.075"/> </g> </g> <rect x="71.407" y="355.863" transform="matrix(-0.6691 -0.7432 0.7432 -0.6691 -74.629 752.3419)" fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" width="117.525" height="73.843"/> <g> <text transform="matrix(0.8074 -0.7281 0.6696 0.7427 139.4521 270.293)">A</text> <text transform="matrix(0.8074 -0.7281 0.6696 0.7427 164.918 247.3623)">B</text> <text transform="matrix(0.8074 -0.7281 0.6696 0.7427 190.4688 224.3545)">C</text> <text transform="matrix(0.8074 -0.7281 0.6696 0.7427 216.0625 201.3125)">D</text> <text transform="matrix(0.8074 -0.7281 0.6696 0.7427 241.7012 178.2256)">E</text> <text transform="matrix(0.8074 -0.7281 0.6696 0.7427 267.1211 155.3398)">F</text> </g> <g> <polygon fill="#DADADA" stroke="#9D9D9C" stroke-width="0.08" stroke-miterlimit="10" points="43.691,329.145 11.383,293.254 43.402,264.392 75.713,300.282 		"/> </g> <g> <polygon fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.054" stroke-miterlimit="10" points="43.634,329.122 22.349,305.475 54.373,276.618 75.66,300.266 		"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="24.474" y1="307.836" x2="56.522" y2="278.979"/> <g> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="41.343" y1="326.57" x2="73.391" y2="297.713"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="38.905" y1="323.867" x2="70.954" y2="295.011"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="36.468" y1="321.163" x2="68.521" y2="292.306"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="34.034" y1="318.457" x2="66.081" y2="289.603"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="31.6" y1="315.75" x2="63.648" y2="286.894"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="29.163" y1="313.051" x2="61.212" y2="284.191"/> <line fill="#F6F6F6" stroke="#9D9D9C" stroke-width="0.0991" stroke-miterlimit="10" x1="26.731" y1="310.342" x2="58.776" y2="281.485"/> </g> </g> <line fill="none" stroke="#9D9D9C" stroke-width="0.0745" stroke-miterlimit="10" x1="38.328" y1="291.075" x2="59.618" y2="314.72"/> </g> </svg>';
	var divFloorPlan2 = document.createElement("div");
	divFloorPlan2.innerHTML = floor2;
	divFloorPlan2.className = 'floorplan floorplan-2';
	$(divFloorPlan2).append('<div class="label galerie-2"><span class="text">Galerie 2</span></div>');
	$(divFloorPlan2).append('<div class="label atelier"><span class="text">Atelier</span></div>');
	$(divFloorPlan2).append('<div class="label tech stair stair-3"><i class="mfgz-sym" aria-hidden="true">B</i></div>');
	$(divFloorPlan).append(divFloorPlan2);


  this.div_ = divFloorPlan;

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(divFloorPlan);

	var that = this;
	google.maps.event.addDomListener( divFloorPlan, "click", function(){
		google.maps.event.trigger( that, "click" );
	} );

//show floorplan on zoom, add zoom level class for font sizes and line widths
google.maps.event.addListener(map, 'idle', function() {
    var zoom = map.getZoom();
		$('#map').addClass('zoom-'+zoom);
    if(zoom > 17){
      $(divFloorPlan).show();
    }else{
      $(divFloorPlan).hide();
    }
});
google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoom = map.getZoom();
		$('#map').removeClass();
		$('#map').addClass('zoom-'+zoom);
		if(zoom > 17){
			$(divFloorPlan).show();
		}else{
			$(divFloorPlan).hide();
		}
		//tech icons, like stairs and bathrooms, only if big enough
		if(zoom <= 19){
			$('.tech').hide();
		}else{
			$('.tech').show();
		}
});

};

SvgOverlay.prototype.draw = function() {

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
SvgOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

google.maps.event.addDomListener(window, 'load', initMap);


/*object location*/
$('.locate-button, .location-name').click(function(e){
	e.stopPropagation();
	if($('#_objekt_location').text().length){
  $('.objekt-location-container').fadeToggle();
  google.maps.event.trigger(map, 'resize');
  map.setCenter(objektPosition);
	}
});

$('body').on('click', function(e){
	console.log(e.target);
	if($(e.target).hasClass('location-name')){
	}else if($(e.target).parents('.title-area').length){
		if($('#_objekt_location').text().length){
		$('.objekt-location-container').fadeOut();
		google.maps.event.trigger(map, 'resize');
		map.setCenter(objektPosition);
	}

	}
});


});
