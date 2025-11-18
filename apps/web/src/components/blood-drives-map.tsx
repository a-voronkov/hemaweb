'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BloodDrive {
  id: string;
  title: string;
  medicalCenter: {
    name: string;
    locationLat?: number | null;
    locationLng?: number | null;
    address?: string | null;
    city?: string | null;
  };
  type: {
    code: string;
    name: string;
  };
  status: {
    code: string;
    name: string;
  };
  startDateTime: string;
}

interface BloodDrivesMapProps {
  bloodDrives: BloodDrive[];
  userLocation?: { lat: number; lng: number } | null;
  onMarkerClick?: (driveId: string) => void;
}

export function BloodDrivesMap({ bloodDrives, userLocation, onMarkerClick }: BloodDrivesMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      // Default center (Bangkok, Thailand)
      const defaultCenter: [number, number] = [13.7563, 100.5018];
      const center = userLocation 
        ? [userLocation.lat, userLocation.lng] as [number, number]
        : defaultCenter;

      mapRef.current = L.map(mapContainerRef.current).setView(center, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('<b>Your Location</b>');
    }

    // Add blood drive markers
    const bounds: L.LatLngBoundsExpression = [];
    
    bloodDrives.forEach((drive) => {
      if (!drive.medicalCenter.locationLat || !drive.medicalCenter.locationLng) return;

      const lat = drive.medicalCenter.locationLat;
      const lng = drive.medicalCenter.locationLng;
      bounds.push([lat, lng]);

      // Create custom icon based on drive type
      const isEmergency = drive.type.code === 'emergency';
      const markerColor = isEmergency ? '#ef4444' : '#10b981';
      
      const customIcon = L.divIcon({
        className: 'blood-drive-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 18px;
              font-weight: bold;
            ">❤</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.current!);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: ${isEmergency ? '#ef4444' : '#000'};">
            ${drive.title}
            ${isEmergency ? '<span style="color: #ef4444; font-size: 12px;"> (URGENT)</span>' : ''}
          </h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Center:</strong> ${drive.medicalCenter.name}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${drive.medicalCenter.address || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${new Date(drive.startDateTime).toLocaleDateString()}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${drive.status.name}</p>
          <button 
            onclick="window.location.href='/blood-drives/${drive.id}'"
            style="
              margin-top: 8px;
              padding: 6px 12px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              width: 100%;
            "
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(drive.id));
      }
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      if (userLocation) {
        bounds.push([userLocation.lat, userLocation.lng]);
      }
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [bloodDrives, userLocation, onMarkerClick]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      className="border"
    />
  );
}

