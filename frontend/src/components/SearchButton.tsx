import Button from 'react-bootstrap/Button';
import './SearchButton.css'

type SearchButtonProps = {
    onSearch: () => void;
    radius: number;
};
export const SearchButton = (props:SearchButtonProps) => {
    const {onSearch, radius} = props;
 return (
     <Button
         variant="primary"
         className="mb-3 search-button"
         onClick={onSearch}
     >
         {radius / 1000}km以内で探す
     </Button>
 );
}
