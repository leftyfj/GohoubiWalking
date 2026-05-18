import './SelectDistance.css'

type SelectDistanceProps = {
    radius:number;
    setRadius:(value:number)=>void;
}
export const SelectDistance = (props:SelectDistanceProps) => {
    const {radius, setRadius} = props;
 return (
     <select className="distance-select" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
         <option value={1000}>1km</option>
         <option value={2000}>2km</option>
         <option value={3000}>3km</option>
         <option value={4000}>4km</option>
         <option value={5000}>5km</option>
     </select>
 );
}
