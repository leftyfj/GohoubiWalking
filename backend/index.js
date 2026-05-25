import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

app.get('/shops', async (req, res) => {
    const { lat, lng, radius, genre } = req.query;
    //  console.log('genre=', genre);
    const selectedRadius = Number(radius) || 1000;
    const apiRadius = 5000;
    if (!lat || !lng) {
        return res.status(400).json({ error: '緯度経度が必要です' });
    }

    // ★ OR検索クエリ
    const querySweets =
        '甘味処 OR 和菓子 OR ケーキ OR スイーツ OR デザート OR たい焼き OR どら焼き OR 団子 OR だんご OR 大福 OR パフェ OR パンケーキ OR アイスクリーム OR ジェラート OR チョコレート OR まんじゅう OR シュークリーム OR エクレア OR 羊羹 OR ぼた餅 OR おはぎ OR あんぱん';
    const queryRamen = 'ラーメン';
    let query = querySweets;

    if (genre === 'ramen') {
        query = queryRamen;
    }

    // console.log('query=', query);
    try {
        const response = await axios.post(
            'https://places.googleapis.com/v1/places:searchText',
            {
                textQuery: query,
                locationBias: {
                    circle: {
                        center: {
                            latitude: Number(lat),
                            longitude: Number(lng)
                        },
                        radius: apiRadius
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
                    'X-Goog-FieldMask':
                        // 'places.id,places.displayName,places.rating,places.location,places.currentOpeningHours.openNow,places.priceLevel',
                        'places.id,places.name,places.displayName,places.rating,places.location,places.currentOpeningHours.openNow,places.priceLevel',
                    'Accept-Language': 'ja' // ← これ
                }
            }
        );

        const results = response.data.places || [];

        const shops = results
            .map((place) => ({
                id: place.id,
                placeName:place.name,
                name: place.displayName?.text,
                lat: place.location?.latitude,
                lng: place.location?.longitude,
                rating: place.rating || 0,
                openNow: place.currentOpeningHours?.openNow ?? null,
                priceLevel: place.priceLevel ?? '-',
                language: 'ja',
                distance: getDistance(
                    Number(lat),
                    Number(lng),
                    place.location?.latitude,
                    place.location?.longitude
                )
            }))
            .filter((shop) => shop.distance <= selectedRadius / 1000)
            // .sort((a, b) => b.rating - a.rating)
            .sort((a, b) => b.distance - a.distance)
            .slice(0, 10);

        res.json(shops);
    } catch (error) {
        console.error('APIエラー:', error.response?.data || error.message);
        res.status(500).json({ error: 'Places API error' });
    }
});

app.get('/', (req, res) => {
    res.send('API running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
