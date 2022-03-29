import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { notDeepEqual } from 'assert';

const server = setupServer(
    rest.get('https://hn.algolia.com/api/v1/search_by_date?query=3', (req, res, ctx)=>{
        return res(ctx.json({
            0: [{objectID: '1', title: 'this is title', story_url: 'this is story url', comment_text: 'this is text comment', author: 'this is author'}, {objectID: '2', title: 'this is title', story_url: 'this is story url', comment_text: 'this is text comment', author: 'this is author'}],
            1: [{objectID: '3', title: 'this is title', story_url: 'this is story url', comment_text: 'this is text comment', author: 'this is author'}, {objectID: '4', title: 'this is title', story_url: 'this is story url', comment_text: 'this is text comment', author: 'this is author'}],
            2: [{objectID: '6', title: 'this is title', story_url: 'this is story url', comment_text: 'this is text comment', author: 'this is author'}, {objectID: '6', title: 'this is title', story_url: 'this is story url', comment_text: 'this is text comment', author: 'this is author'}],
        }))
    })
)

beforeAll(()=> server.listen())
afterEach(()=> server.resetHandlers())
afterAll(()=> server.close())


const MockHome = ()=>{
    return (<BrowserRouter>
        <Home/>
    </BrowserRouter>)
}

describe('Home should be', ()=>{

    // Loading should be in the document.
    test('loading ... should have in the document', async ()=>{
       render( <MockHome />);
        const leadingEl = screen.getByText('Loading...');
        expect(leadingEl).toBeInTheDocument();
    })

    
    test('shoult author be in the document', async ()=>{
        render ( <MockHome/>)
        await screen.findByTestId('post-box')
        expect(screen.getByTestId('post-box')).toBeInTheDocument()
    })


    test('shoult pagination', async ()=>{
        render ( <MockHome/>)
        await screen.findByTestId('pagination-testid')
        expect(screen.getByTestId('pagination-testid')).toBeInTheDocument()
    })



})
