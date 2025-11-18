'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface LocationPickerProps {
  lat?: number;
  lng?: number;
  address?: string;
  city?: string;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ 
  lat, 
  lng, 
  address,
  city,
  onLocationChange,
  height = '400px' 
}: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(
    lat && lng ? [lat, lng] : null
  );
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleLocationChange = useCallback((newLat: number, newLng: number) => {
    setPosition([newLat, newLng]);
    onLocationChange(newLat, newLng);
  }, [onLocationChange]);

  const geocodeAddress = async () => {
    if (!address || !city) return;

    setGeocoding(true);
    try {
      const query = `${address}, ${city}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        handleLocationChange(newLat, newLng);
      } else {
        alert('Address not found. Please click on the map to set location manually.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to geocode address. Please click on the map to set location manually.');
    } finally {
      setGeocoding(false);
    }
  };

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

  const defaultCenter: [number, number] = position || [13.7563, 100.5018]; // Bangkok

  return (
    <div className="space-y-2">
      {address && city && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={geocodeAddress}
            disabled={geocoding}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            {geocoding ? 'Finding location...' : 'Find location from address'}
          </Button>
        </div>
      )}
      
      <div style={{ height }} className="rounded-lg overflow-hidden border">
        <MapContainer
          center={defaultCenter}
          zoom={position ? 13 : 6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationChange={handleLocationChange} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {position 
          ? `Selected: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
          : 'Click on the map to set location'
        }
      </p>
    </div>
  );
}

