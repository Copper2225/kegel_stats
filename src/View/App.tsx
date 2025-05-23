import InputTile from 'src/View/InputPage/InputTile';

function App() {
    return (
        <div style={{ height: '100dvh', width: '100dvw' }} className={'justify-content-around d-flex flex-column'}>
            <InputTile title={'Bahn 1'} />
            <InputTile title={'Bahn 2'} />
            <InputTile title={'Bahn 3'} />
            <InputTile title={'Bahn 4'} />
        </div>
    );
}

export default App;
