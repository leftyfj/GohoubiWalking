import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
    DirectionsService,
    DirectionsRenderer
} from '@react-google-maps/api';

import { Button, Stack, Modal, Spinner } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { SearchButton } from './SearchButton';
import { ShopTable } from './ShopTable';
import { SelectDistance } from './SelectDistance';

import './Map.css';

const Map = () => {
    const [center, setCenter] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const [selectedShop, setSelectedShop] = useState<any>(null);
    const [directions, setDirections] = useState<any>(null);
    const [showRoute, setShowRoute] = useState(false);
    const [routeTarget, setRouteTarget] = useState<any>(null);
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [radius, setRadius] = useState(1000);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                console.error('位置情報取得失敗', error);
            }
        );
    }, []);

    const fetchShops = () => {
        // ★ null対策追加
        if (!center) return;

        setLoading(true);

        fetch(
            `https://gohoubiwalking.onrender.com/shops?lat=${center.lat}&lng=${center.lng}&radius=${radius}`
        )
            .then((res) => res.json())
            .then((data) => {
                setShops(data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    };

    // ★ center未取得時はここで終了
    if (!center) {
        return (
            <Modal show={true} centered backdrop="static" keyboard={false}>
                <Modal.Body className="text-center p-4">
                    <Spinner animation="border" />

                    <p className="mt-3">現在地を取得しています...</p>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <>
            <div className="container-area">
                <SelectDistance radius={radius} setRadius={setRadius} />

                <SearchButton onSearch={fetchShops} radius={radius} />

                {/* <ShopTable shops={shops} setSelectedShop={setSelectedShop} /> */}
            </div>

            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            >
                <GoogleMap
                    mapContainerClassName="google-map-container"
                    center={center}
                    zoom={15}
                >
                    <Marker position={center} />

                    {shops.map((shop) => (
                        <Marker
                            key={shop.id}
                            position={{
                                lat: shop.lat,
                                lng: shop.lng
                            }}
                            title={shop.name}
                            icon={{
                                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            }}
                            onClick={() => {
                                setSelectedShop(shop);
                                setShowRoute(false);
                            }}
                        />
                    ))}

                    {selectedShop && (
                        <InfoWindow
                            position={{
                                lat: selectedShop.lat,
                                lng: selectedShop.lng
                            }}
                            onCloseClick={() => setSelectedShop(null)}
                        >
                            <Stack gap={2}>
                                <div className="close-button-area">
                                    <h3 className="fw-bold">
                                        {selectedShop.name}
                                    </h3>

                                    <Button
                                        className="close-button"
                                        variant="light"
                                        size="sm"
                                        onClick={() => setSelectedShop(null)}
                                    >
                                        ×
                                    </Button>
                                </div>

                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => {
                                        setDirections(null);
                                        setRouteTarget(selectedShop);
                                        setShowRoute(true);
                                    }}
                                >
                                    店舗までのルート
                                </Button>
                            </Stack>
                        </InfoWindow>
                    )}

                    {routeTarget && showRoute && (
                        <DirectionsService
                            options={{
                                origin: center,
                                destination: {
                                    lat: routeTarget.lat,
                                    lng: routeTarget.lng
                                },
                                travelMode: google.maps.TravelMode.WALKING
                            }}
                            callback={(result, status) => {
                                if (status === 'OK') {
                                    setDirections(result);

                                    setShowRoute(false);
                                }
                            }}
                        />
                    )}

                    {directions && (
                        <DirectionsRenderer
                            options={{
                                directions,
                                suppressMarkers: true
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
            <div className="container-area">
                <ShopTable shops={shops} setSelectedShop={setSelectedShop} />
            </div>

            <Modal show={loading} centered backdrop="static" keyboard={false}>
                <Modal.Body className="text-center p-4">
                    <Spinner animation="border" />

                    <p className="mt-3">ご褒美を探しています...</p>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Map;
