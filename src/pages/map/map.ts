import { Component, ViewChild, ElementRef } from '@angular/core';

import {  Platform } from 'ionic-angular';


declare var google: any;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  public mapData = [];
  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor( public platform: Platform) {
  }

  ionViewDidLoad() {

   // [{ "name": "Monona Terrace Convention Center", "lat": 43.071584, "lng": -89.38012, "center": true }, { "name": "Ionic HQ", "lat": 43.074395, "lng": -89.381056 }, { "name": "Afterparty - Brocach Irish Pub", "lat": 43.07336, "lng": -89.38335 }]
    this.mapData.push({
      name: 'Hillcrest Park, Singapore 289201',
      "lat": 1.331862, "lng": 103.807846, "center": true
    })
    let mapEle = this.mapElement.nativeElement;
    console.log(JSON.stringify(this.mapData));
    console.log("Center Map Data:" + this.mapData.find((d: any) => d.center));
    let map = new google.maps.Map(mapEle, {
      center: this.mapData.find((d: any) => d.center),
      zoom: 16
    });

    this.mapData.forEach((markerData: any) => {
      let infoWindow = new google.maps.InfoWindow({
        content: `<h5>${markerData.name}</h5>`
      });

      let marker = new google.maps.Marker({
        position: markerData,
        map: map,
        title: markerData.name
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    google.maps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });



  }
}
