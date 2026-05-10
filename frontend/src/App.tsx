import { Container } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

import Map from './components/Map';
import './App.css';

function App() {
    return (
        <>
            <Container className="mt-3">
                <h1 className='fs-2'>ご褒美ウォーキング</h1>
                <Map />
            </Container>
        </>
    );
}

export default App;
