import { Controller } from "@hotwired/stimulus";
import consumer from "../channels/consumer";

export default class extends Controller {
  static targets = ["map"];

  connect() {
    this.markers = [];

    this.map = new google.maps.Map(this.mapTarget, {
      center: { lat: 51.509865, lng: -0.118092 },
      zoom: 15,
    });

    this.subscription = consumer.subscriptions.create("MarkerChannel", {
      connected: () => console.log("Connected to MarkerChannel"),
      disconnected: () => console.log("Disconnected from MarkerChannel"),
      received: (data) => {
        debugger;
        switch (data.type) {
          case "markers_list":
            this.handleMarkersList(data.markers);
            break;
          case "add":
            this.addMarker(data.record);
            break;
          case "update":
            this.updateMarker(data.record);
            break;
          case "delete":
            this.deleteMarker(data.record);
            break;
          default:
            break;
        }
      },
    });
  }

  handleMarkersList(markers) {
    markers.forEach((marker) => {
      this.addMarker(marker);
    });
  }

  disconnect() {
    this.subscription.unsubscribe();
  }

  addMarker(record) {
    const { latitude, longitude, name } = record;
    const position = new google.maps.LatLng(latitude, longitude);
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: name,
    });
    this.markers.push(marker);
  }

  updateMarker(record) {
    const marker = this.findMarker(record.id);
    if (marker) {
      marker.setTitle(record.name);
      if (
        record.latitude !== marker.getPosition().lat() ||
        record.longitude !== marker.getPosition().lng()
      ) {
        const position = new google.maps.LatLng(
          record.latitude,
          record.longitude
        );
        marker.setPosition(position);
      }
    }
  }

  deleteMarker(record) {
    const marker = this.findMarker(record.id);
    if (marker) {
      marker.setMap(null);
      this.markers = this.markers.filter((m) => m !== marker);
    }
  }

  findMarker(id) {
    return this.markers.find((m) => m.id === id);
  }
}
