import Button from 'react-bootstrap/Button';

type SearchButtonProps = {
    onSearch: () => void;
    radius: number;
};

export const SearchButton = (props:SearchButtonProps) => {
    const {onSearch, radius} = props;
 return (
     <Button
         variant="primary"
         className="mb-3"
         onClick={onSearch}
         style={{ display: 'block', margin: '20px auto' }}
     >
         {radius / 1000}km以内で探す
     </Button>
 );
}
