'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  isActive: boolean;
}

interface BloodDrive {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  medicalCenter: {
    id: string;
    name: string;
    city: string;
    locationLat?: number;
    locationLng?: number;
  };
  isWithinFavoriteRadius?: boolean;
}

interface BloodDrivesMapProps {
  bloodDrives: BloodDrive[];
  favoriteLocations: FavoriteLocation[];
}

export function BloodDrivesMap({ bloodDrives, favoriteLocations }: BloodDrivesMapProps) {
  const [L, setL] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!mounted || !L) {
    return (
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Calculate center of map based on favorite locations or blood drives
  const getMapCenter = (): [number, number] => {
    if (favoriteLocations.length > 0) {
      const avgLat = favoriteLocations.reduce((sum, loc) => sum + loc.latitude, 0) / favoriteLocations.length;
      const avgLng = favoriteLocations.reduce((sum, loc) => sum + loc.longitude, 0) / favoriteLocations.length;
      return [avgLat, avgLng];
    }
    
    const drivesWithCoords = bloodDrives.filter(d => d.medicalCenter.locationLat && d.medicalCenter.locationLng);
    if (drivesWithCoords.length > 0) {
      const avgLat = drivesWithCoords.reduce((sum, d) => sum + d.medicalCenter.locationLat!, 0) / drivesWithCoords.length;
      const avgLng = drivesWithCoords.reduce((sum, d) => sum + d.medicalCenter.locationLng!, 0) / drivesWithCoords.length;
      return [avgLat, avgLng];
    }
    
    // Default to Thailand center
    return [13.7563, 100.5018];
  };

  // Create custom icons
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const greyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const center = getMapCenter();

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={favoriteLocations.length > 0 ? 10 : 6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Favorite locations with circles */}
        {favoriteLocations.filter(loc => loc.isActive).map((location) => (
          <Circle
            key={location.id}
            center={[location.latitude, location.longitude]}
            radius={location.radiusKm * 1000} // Convert km to meters
            pathOptions={{
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        ))}

        {/* Blood drive markers */}
        {bloodDrives
          .filter(drive => drive.medicalCenter.locationLat && drive.medicalCenter.locationLng)
          .map((drive) => (
            <Marker
              key={drive.id}
              position={[drive.medicalCenter.locationLat!, drive.medicalCenter.locationLng!]}
              icon={drive.isWithinFavoriteRadius ? redIcon : greyIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{drive.name}</h3>
                  <p className="text-sm text-muted-foreground">{drive.medicalCenter.name}</p>
                  <p className="text-sm">{drive.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(drive.startDate).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

