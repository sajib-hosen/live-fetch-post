import React from 'react';
import { useLocation } from 'react-router-dom';

const Details = () => {
    const location: any = useLocation();
    const post = location.state.post;
    console.log( post )
    return (
        <div>
            <p>show details</p>
            {location.state.post.title && <p>{location.state.post.title}</p> }
            {location.state.post.author && <p>{location.state.post.author}</p> }
            
            <pre>
                {
                    JSON.stringify(post, null, 2)
                }
            </pre>

        </div>
    );
};

export default Details;