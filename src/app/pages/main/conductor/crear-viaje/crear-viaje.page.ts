import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'firebase/auth';  
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import mapboxgl from 'mapbox-gl';
import * as GeoJSON from 'geojson';  
import * as MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as MapboxDirections from '@mapbox/mapbox-sdk/services/directions';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})

export class CrearViajePage implements OnInit, AfterViewInit  {
  
  @ViewChild('map', { static: false }) mapContainer: ElementRef;
  
  form = new FormGroup({
    id: new FormControl(''),
    patente: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('[a-zA-Z0-9 ]*')]),
    salida: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),  // Sin validaciones adicionales
    coste: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]),  // Sin patrón
    pasajeros: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50)]),  // Rango ajustado
    disponibles: new FormControl(''),
    email: new FormControl(''),
    emailP: new FormControl(''),
    completo: new FormControl(false),
    destinoCoords: new FormControl(null),
  });
  
  user = {} as User;
  duocUCLocation = { lat: -36.8265, lng: -73.0492 };  // Coordenadas de Duoc UC
  map: mapboxgl.Map;
  
  destinoSuggestions: any[] = [];

  destinationCoordinates = { lat: 0, lng: 0 };

  geocodingClient: any;
  directionsClient: any;

  constructor(private navCtrl: NavController, private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  ngAfterViewInit() {
    this.initializeMap();
    window.addEventListener('resize', () => {
      if (this.map) {
        this.map.resize();
      }
    });
  }

  ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaWFuY29ydGVzIiwiYSI6ImNtNGM5dDY3eDA4YmYyam9ub3Bpanh0dXQifQ.rE1ukWyNUMnG2VKQqg5X2Q';
    this.geocodingClient = MapboxGeocoding({ accessToken: mapboxgl.accessToken });
    this.directionsClient = MapboxDirections({ accessToken: mapboxgl.accessToken });

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      } else {
        console.log("Usuario no autenticado");
      }
    });
  }
   // WEAS DE MAPA
  initializeMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.duocUCLocation.lng, this.duocUCLocation.lat],  // Asegúrate de que esté centrado en Duoc
      zoom: 12,
      interactive: true, // Permite la interacción
      scrollZoom: false, // Desactiva el zoom con el scroll
      
    });
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,  // Rastrear la ubicación en tiempo real
      showUserHeading: true,    // Mostrar la dirección de movimiento con una flecha
      showUserLocation: true,   // Mostrar el marcador en la ubicación del usuario
      showAccuracyCircle: true  // Mostrar un círculo que indique la precisión
    });
    this.map.addControl(geolocate);
    geolocate.trigger();

    const marker = new mapboxgl.Marker({ draggable: false, offset: [0, -10] })  // Ajusta la posición
  .setLngLat([this.duocUCLocation.lng, this.duocUCLocation.lat])
  .setPopup(new mapboxgl.Popup().setHTML('<h3>Duoc UC</h3>'))
  .addTo(this.map);


  this.map.fitBounds([
    [this.duocUCLocation.lng - 0.01, this.duocUCLocation.lat - 0.01], // Coordenadas límite inferior
    [this.duocUCLocation.lng + 0.01, this.duocUCLocation.lat + 0.01]  // Coordenadas límite superior
  ], {
    maxZoom: 15,  // Ajusta el zoom máximo para evitar acercamientos excesivos
  });
    
    this.map.on('load', () => {
      this.map.resize();  // Fuerza el ajuste de la resolución una vez cargado el mapa

      const duocMarker = new mapboxgl.Marker({ draggable: false })
        .setLngLat([this.duocUCLocation.lng, this.duocUCLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Duoc UC</h3>'))
        .addTo(this.map);
      
      duocMarker.getElement().style.pointerEvents = 'none'; // Evita que el marcador sea arrastrable
    });
  }

  async getDestinos(event: any) {
    const query = event.target.value;
    if (query.length >= 3) {
      try {
        const response = await this.geocodingClient.forwardGeocode({
          query: query,
          limit: 5,
        }).send();
  
        if (response.body && response.body.features) {
          this.destinoSuggestions = response.body.features;
        } else {
          console.error('No se encontraron sugerencias de destino');
          this.destinoSuggestions = [];  // Limpiar sugerencias si no se encuentran resultados válidos
        }
      } catch (error) {
        console.error('Error al obtener las sugerencias de destino:', error);
        this.destinoSuggestions = [];  // Limpiar sugerencias si hay un error
      }
    }
  }

  selectDestino(suggestion: any) {
    console.log('Destino seleccionado:', suggestion.center);

    this.form.controls.destino.setValue(suggestion.place_name);
    this.form.controls.destinoCoords.setValue(suggestion.center);
    this.destinoSuggestions = [];

    this.destinationCoordinates = {
      lat: suggestion.center[1],
      lng: suggestion.center[0]
    };

    this.map.flyTo({
      center: [this.destinationCoordinates.lng, this.destinationCoordinates.lat],
      zoom: 14
    });

    const destinationMarker = new mapboxgl.Marker({ draggable: false })
      .setLngLat([this.destinationCoordinates.lng, this.destinationCoordinates.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Destino</h3>'))
      .addTo(this.map);

    destinationMarker.getElement().style.pointerEvents = 'none';

    this.traceRoute();
  }

  async traceRoute() {
    try {
      const routeResponse = await this.directionsClient.getDirections({
        profile: 'driving',
        waypoints: [
          { coordinates: [this.duocUCLocation.lng, this.duocUCLocation.lat] },
          { coordinates: this.form.value.destinoCoords }
        ]
      }).send();

      const routeGeoJSON = routeResponse.body.routes[0].geometry;

      const routeFeature: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: routeGeoJSON.coordinates
        },
        properties: {}
      };
      if (this.map.getSource('route')) {
        this.map.removeSource('route');  // Eliminar la fuente existente
      }
      this.map.addSource('route', {
        type: 'geojson',
        data: routeFeature
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': '#3b9ddd',
          'line-width': 5
        }
      });
    } catch (error) {
      console.error('Error al trazar la ruta:', error);
    }
  }

  async submit() {
    console.log('Formulario válido:', this.form.valid);
  console.log('Errores en el formulario:', this.form.errors);
  console.log('Valores del formulario:', this.form.value);
    console.log('Formulario enviado');
    if (this.form.valid) {
      let path = '/viajes';
      const loading = await this.utilsSvc.loading();
      await loading.present();

      delete this.form.value.id;

      this.form.value.email = this.user.email;
      this.form.value.disponibles = this.form.value.pasajeros;
      this.form.value.emailP = 'none';

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
        this.navCtrl.navigateRoot(['/main/home']);
        this.utilsSvc.presentToast({
          message: 'Viaje creado exitosamente',
          duration: 3500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 3500,
          color: 'secondary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
}