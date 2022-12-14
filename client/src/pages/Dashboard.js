import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();

    const [quote, setQuote] = useState('')
    const [newQuote, setNewQuote] = useState('')


    useEffect(() => {
      
        const token = localStorage.getItem('token');
        
        if(token){
            const user = jwtDecode(token);

            if(!user){
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                populateQuote()
            }
        }

    }, []);


    async function populateQuote(){

        const req = await fetch('http://localhost:8080/api/quote', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        });

        const data = await req.json();
        console.log(data)

        if(data.status === 'ok'){
            setQuote(data.quote)
        } else {
            alert(data.error)
        }

    };
    
    
    async function updateQuote(e){
        
        e.preventDefault();

        const req = await fetch('http://localhost:8080/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                quote: newQuote,
            }),
        });

        const data = await req.json();
        console.log(data)

        if(data.status === 'ok'){
            setNewQuote('')
            setQuote(newQuote)
        } else {
            alert(data.error)
        }

    };


    return (
        
        <div>
            <h1>Your quote: {quote || 'no quote found'}</h1>
            <form onSubmit={updateQuote}>
                <input type='text' palceholder='Quote' value={newQuote} onChange={e => setNewQuote(e.target.value)} />
                <input type='submit' value='Update quote' />
            </form>
        </div>
    )

}

export default Dashboard