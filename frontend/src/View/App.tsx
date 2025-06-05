import { Route, Routes } from 'react-router';
import AdvancedInputPage from 'src/View/InputPage/AdvancedInputPage';
import InputPage from 'src/View/InputPage/InputPage';
import RecordsPage from 'src/View/RecordsPage/RecordsPage';

function App() {
    return (
        <div style={{ height: '100dvh', width: '100dvw', padding: '8px' }}>
            <Routes>
                <Route path="/" element={<InputPage />} />
                <Route path="/advancedInput" element={<AdvancedInputPage />} />
                <Route path="/records" element={<RecordsPage />} />
            </Routes>
        </div>
    );
}

export default App;
