import { useState } from 'react';
import { Link } from 'react-router-dom';

import viteLogo from '/vite.svg'
import image01 from '/cache-static-resources/images/image-01.png';

import reactLogo from '../../../assets/react.svg'
import image02 from '../../../assets/image-02.png';

import Button from '@mui/material/Button';



export default function Home() {
    const [count, setCount] = useState(0)

    const image03 = "https://leonardopaiva.com/logo.png";

    return (
        <>
        <Link to="../events" className='button'>
            Events
        </Link><br /><br />
        <Button variant="contained">Hello world</Button>;
        <div>
            <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <img src={image01} className="logo react" alt="Teste image 01" />
            <a href="https://leonardopaiva.com" target="_blank">
            <img src={image03} className="logo react" alt="Teste image logo leonardopaiva.com" />
            </a>
            <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            <img src={image02} className="logo react" alt="Teste image 02" />

        </div>
        <h1>Vite + React s</h1>
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
            </button>
            <p>
            Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        
        </>
    );
}
