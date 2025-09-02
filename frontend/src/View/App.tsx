import { Route, Routes } from 'react-router';
import AdvancedInputPage from 'src/View/InputPage/AdvancedInputPage';
import InputPage from 'src/View/InputPage/InputPage';
import RecordsPage from 'src/View/RecordsPage/RecordsPage';
import HomeMenu from 'src/View/HomeMenu';
import StatsPage from 'src/View/StatsPage/StatsPage';

function App() {
    return (
        <div style={{ height: '100dvh', width: '100dvw', padding: '8px' }}>
            <Routes>
                <Route path="/" element={<HomeMenu />} />
                <Route path="/input" element={<InputPage />} />
                <Route path="/advancedInput" element={<AdvancedInputPage />} />
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/stats" element={<StatsPage />} />
            </Routes>
        </div>
    );
}

export default App;
