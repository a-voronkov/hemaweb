'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  locationLat?: number;
  locationLng?: number;
}

interface MedicalCenterMapProps {
  centers: MedicalCenter[];
  selectedCenterId?: string;
  onCenterSelect?: (centerId: string) => void;
  height?: string;
}

export function MedicalCenterMap({
  centers,
  selectedCenterId,
  onCenterSelect,
  height = '600px'
}: MedicalCenterMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        className="flex items-center justify-center bg-muted rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Filter centers with valid coordinates
  const centersWithCoords = centers.filter(
    (c) => c.locationLat != null && c.locationLng != null
  );

  if (centersWithCoords.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No centers with coordinates</p>
        </div>
      </div>
    );
  }

  // Calculate center of all markers
  const avgLat = centersWithCoords.reduce((sum, c) => sum + (c.locationLat || 0), 0) / centersWithCoords.length;
  const avgLng = centersWithCoords.reduce((sum, c) => sum + (c.locationLng || 0), 0) / centersWithCoords.length;

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border">
      <MapContainer
        center={[avgLat, avgLng]}
        zoom={centersWithCoords.length === 1 ? 13 : 10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {centersWithCoords.map((center) => {
          const isSelected = center.id === selectedCenterId;

          return (
            <Marker
              key={center.id}
              position={[center.locationLat!, center.locationLng!]}
              eventHandlers={{
                click: () => onCenterSelect?.(center.id),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className={`font-semibold ${isSelected ? 'text-red-600' : ''}`}>
                    {isSelected && '📍 '}
                    {center.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{center.address}</p>
                  <p className="text-sm text-muted-foreground">{center.city}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

