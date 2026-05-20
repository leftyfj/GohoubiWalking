import Table from 'react-bootstrap/Table';
import './ShopTable.css';

type ShopProps = {
 shops:any[];
 setSelectedShop: (shop: any) => void;
};

export const ShopTable = ({shops, setSelectedShop}:ShopProps) => {
 return (
     <div className="shoptable-area">
         <Table striped bordered hover>
             <thead>
                 <tr>
                     <th>
                         店舗名
                         <small className="d-block text-muted">
                             タップで地図上に表示
                         </small>
                     </th>
                     <th>情報</th>
                     <th>評価</th>
                     <th>距離</th>
                     <th>
                         営業
                         <br className="md-none" />
                         (🟢/✘)
                     </th>
                 </tr>
             </thead>
             <tbody>
                 {shops.map((shop) => (
                     <tr
                         key={shop.id}
                         onClick={() => {
                             setSelectedShop(shop);
                         }}
                         style={{ cursor: 'pointer' }}
                     >
                         <td>{shop.name}</td>
                         <td>
                             <a
                                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                     shop.name
                                 )}&query_place_id=${shop.placeName.replace(
                                     'places/',
                                     ''
                                 )}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                             >
                                 詳細
                             </a>
                         </td>
                         <td>{shop.rating?.toFixed(1) ?? '-'}</td>
                         <td>
                             {shop.distance < 1
                                 ? `${Math.round(shop.distance * 1000)} m`
                                 : `${shop.distance.toFixed(1)} km`}
                         </td>
                         <td className="open-status">
                             {shop.openNow === true
                                 ? '🟢'
                                 : shop.openNow === false
                                   ? '✘'
                                   : '-'}
                         </td>
                     </tr>
                 ))}
             </tbody>
         </Table>
     </div>
 );
}
