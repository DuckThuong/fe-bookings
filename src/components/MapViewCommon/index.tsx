import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "./style.scss";
import type { NominatimResponseDto } from "../../api/dtos/map.dto";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewCommonProps {
  center: {
    lat: number;
    lng: number;
  };
  searchState?: {
    input: string;
    results: NominatimResponseDto[];
    isSearching: boolean;
    isDropdownOpen: boolean;
    onInputChange: (value: string) => void;
    onFocus: () => void;
    onSubmit: () => void | Promise<void>;
    onSelectResult: (result: NominatimResponseDto) => void;
    onOpenChange: (open: boolean) => void;
  };
  onCoordinateSelect: (value: { lat: number; lng: number }) => void | Promise<void>;
}

function ChangeView({
  center,
}: {
  center: [number, number];
}): null {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

function MapClickHandler({
  onCoordinateSelect,
}: {
  onCoordinateSelect: (value: { lat: number; lng: number }) => void | Promise<void>;
}): null {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onCoordinateSelect({ lat, lng });
    },
  });

  return null;
}

const getSuggestionTitle = (result: NominatimResponseDto) =>
  result.address?.amenity ||
  result.address?.road ||
  result.address?.hamlet ||
  result.address?.suburb ||
  result.address?.neighbourhood ||
  result.address?.city ||
  result.address?.town ||
  result.address?.village ||
  result.display_name;

export const MapViewCommon: React.FC<MapViewCommonProps> = ({
  center,
  searchState,
  onCoordinateSelect,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    center.lat,
    center.lng,
  ]);
  const markerRef = useRef<L.Marker>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMarkerPosition([center.lat, center.lng]);
  }, [center.lat, center.lng]);

  useEffect(() => {
    if (!searchState) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        searchState.onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchState]);

  const handleMarkerDrag = () => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    const { lat, lng } = marker.getLatLng();
    onCoordinateSelect({ lat, lng });
  };

  return (
    <div className="map__view">
      {searchState && (
        <div className="map__view__search" ref={searchWrapperRef}>
          <Input
            placeholder="Tim kiem dia diem..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchState.input}
            onChange={(event) => searchState.onInputChange(event.target.value)}
            onFocus={searchState.onFocus}
            onPressEnter={() => {
              void searchState.onSubmit();
            }}
          />
          {searchState.isDropdownOpen && (
            <div className="map-autocomplete-dropdown">
              {searchState.isSearching && (
                <div className="map-autocomplete-dropdown__state">
                  Dang tim dia diem...
                </div>
              )}

              {!searchState.isSearching &&
                searchState.results.map((result, index) => (
                  <button
                    key={`${result.lat}-${result.lon}-${index}`}
                    type="button"
                    className="map-autocomplete-dropdown__item"
                    onClick={() => searchState.onSelectResult(result)}
                  >
                    <span className="map-autocomplete-dropdown__item__title">
                      {getSuggestionTitle(result)}
                    </span>
                    <span className="map-autocomplete-dropdown__item__address">
                      {result.display_name}
                    </span>
                  </button>
                ))}

              {!searchState.isSearching &&
                searchState.input.trim().length >= 2 &&
                searchState.results.length === 0 && (
                  <div className="map-autocomplete-dropdown__state">
                    Khong tim thay ket qua phu hop.
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      <div className="map__view__container">
        <MapContainer center={markerPosition} zoom={15}>
          <ChangeView center={markerPosition} />
          <MapClickHandler onCoordinateSelect={onCoordinateSelect} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={markerPosition}
            draggable={true}
            ref={markerRef}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};
