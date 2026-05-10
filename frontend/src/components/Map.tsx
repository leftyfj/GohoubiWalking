import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
    DirectionsService,
    DirectionsRenderer
} from '@react-google-maps/api';
import { Button, Stack } from 'react-bootstrap';
import { CSSProperties, useEffect, useState } from 'react';
import { SearchButton } from './SearchButton';
import { ShopTable } from './ShopTable';
import { SelectDistance } from './SelectDistance';
import './Map.css';
const containerStyle: CSSProperties = {
    width: '90%',
    height: '400px',
    margin: '0 auto'
};

const Map = () => {
    const [center, setCenter] = useState({
        lat: 35.681236,
        lng: 139.767125
    });

    const [selectedShop, setSelectedShop] = useState<any>(null);
    const [directions, setDirections] = useState<any>(null);
    const [showRoute, setShowRoute] = useState(false);
    const [routeTarget, setRouteTarget] = useState<any>(null);
    const [shops, setShops] = useState<any[]>([]);

    // 検索範囲からデフォルトを1000mに設定
    const [radius, setRadius] = useState(1000);

    const fetchShops = () => {
        fetch(
            `http://localhost:3000/shops?lat=${center.lat}&lng=${center.lng}&radius=${radius}`
        )
            .then((res) => res.json())
            .then((data) => {
                // console.log('APIデータ:', data);
                setShops(data);
            })
            .catch((err) => console.error(err));
    };
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
    return (
        <>
            <div className="container-area">
                <SelectDistance radius={radius} setRadius={setRadius} />

                <SearchButton onSearch={fetchShops} radius={radius} />
                {/* 店舗の一覧 */}
                <ShopTable shops={shops} setSelectedShop={setSelectedShop} />
            </div>

            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            >
                <GoogleMap
                    // mapContainerStyle={containerStyle}
                    mapContainerClassName="google-map-container"
                    center={center}
                    zoom={15}
                >
                    {/* 現在地に赤いマーカーを表示 */}
                    {center && <Marker position={center} />}
                    {/* 店舗情報を緑色のマーカーで表示 */}
                    {shops.map((shop) => (
                        <Marker
                            key={shop.id}
                            position={{ lat: shop.lat, lng: shop.lng }}
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
                                <h3>{selectedShop.name}</h3>
                                <p>評価：{selectedShop.rating}</p>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => {
                                        setDirections(null);
                                        setRouteTarget(selectedShop); // ← ここが重要
                                        setShowRoute(true);
                                        setSelectedShop(null); // これでOKになる
                                    }}
                                >
                                    店舗までのルート
                                </Button>
                                <a
                                    href={`https://www.google.com/maps/place/?q=place_id:${selectedShop.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Googleマップで詳細を見る
                                </a>
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
                                travelMode: 'WALKING'
                            }}
                            callback={(result, status) => {
                                if (status === 'OK') {
                                    setDirections(result);
                                    setShowRoute(false); // ← これが重要
                                }
                            }}
                        />
                    )}
                    {directions && (
                        <DirectionsRenderer
                            options={{
                                directions: directions,
                                suppressMarkers: true
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </>
    );
};

export default Map;
