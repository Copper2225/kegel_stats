import styled from 'styled-components';

const LinkButton = styled.a`
    width: 100%;
    flex: 1;
    align-content: center;
    font-size: 3em;
`;

const HomeMenu = () => {
    return (
        <div className={'d-flex flex-column h-100 gap-5 py-4 px-2'}>
            <h1 className={'text-center text-decoration-underline'}>Kegel Statistiken</h1>
            <LinkButton href={'/input'} className={'btn btn-primary'}>
                Eintragen
            </LinkButton>
            <LinkButton href={'/records'} className={'btn btn-primary'}>
                Liste
            </LinkButton>
            <LinkButton href={'/records'} className={'btn btn-primary'}>
                Statistiken
            </LinkButton>
            <LinkButton href={'/records'} className={'btn btn-primary'}>
                Rekorde
            </LinkButton>
        </div>
    );
};

export default HomeMenu;
