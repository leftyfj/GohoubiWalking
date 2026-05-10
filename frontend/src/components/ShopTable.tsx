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
                     <th>店舗名</th>
                     <th>評価</th>
                     <th>距離</th>
                     <th>
                         営業
                         <br className="md-none" />
                         (🟢/✘)
                     </th>
                     {/* <th className="d-none d-md-table-cell">価格帯</th> */}
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
                         {/* <td className="d-none d-md-table-cell">
                             {shop.priceLevel
                                 ? '¥'.repeat(shop.priceLevel)
                                 : '-'}
                         </td> */}
                         <td>
                             <a
                                 href={`https://www.google.com/maps/place/?q=place_id:${shop.id}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                             >
                                 詳細
                             </a>
                         </td>
                     </tr>
                 ))}
             </tbody>
         </Table>
     </div>
 );
}
