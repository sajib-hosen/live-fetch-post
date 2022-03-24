import { Button, Card, CardContent, Grid, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface InitPost {
    title: string,
    url: string,
    created_at: Date,
    author: string,
    objectID:string,
    comment_text: string,
    story_url:string
}

const Home = () => {
    const [keyCall, setKeyCall] = useState<number>(0)
    const [pageCount, setPageCount] = useState<number>(0)
    // const [timerKey, setTimerKey] = useState<NodeJS.Timer | null>(null) // interval key passing to anothe useEffect to conditionaly stop
    const [allPost, setAllPost] = useState<any>({})
    const [page, setPage] = useState(1);
    const [pagePost, setPagePost] = useState<InitPost[]>([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {  // calling the API after each 10 second by changing state.
      const timer = setInterval(()=>{
        setKeyCall(Date.now())
      }, 10000)
    }, []) 

    useEffect(()=>{  // fetching data after every 10 second.
        setIsLoading(true)
        fetch(`https://hn.algolia.com/api/v1/search_by_date?query=${pageCount}`)
        .then( res => res.json())
        .then(data =>{
            setAllPost({...allPost, [pageCount]: data.hits})
        })
        .catch((error)=>{
            console.log(pageCount, error.message)
        })
        setIsLoading(false)
    },[keyCall])

    useEffect(()=>{ // determining or set the page number what will be page number
        setPageCount(Object.keys(allPost).length)
        if(!Object.keys(allPost).length){
            setIsLoading(true)
            console.log('loading...')
        }
        else{
            setIsLoading(false)
        }
        console.log('calling for:', Object.keys(allPost).length, allPost)
    },[allPost])

    // for initial "pagePost set" randering ========================================
    useEffect(()=>{
        if(!Boolean(pagePost.length) && allPost['0'] ){
            setPagePost(allPost['0'])
        }
    },[allPost])
    //------------------------------------------------------------------------------

    // on page change ==============================================================
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(()=>{
        if(allPost['0']){
            setPagePost(allPost[page - 1])
        }
    },[ page ])
    //-------------------------------------------------------------------------------

    const getDetails = (post: InitPost) => {
        navigate('/details', {state:{ post }})
    }

    return (
        <div>
            {isLoading ? 'Loading...' : <div>
            <Box margin='6'>
            <TableContainer>
                <Table sx={{ minWidth: 150 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center">Title</TableCell>
                        <TableCell align="center">URL</TableCell>
                        <TableCell align="center">Created At</TableCell>
                        <TableCell align="center">Author</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagePost && pagePost.map((eachObj: InitPost) => (
                            <TableRow onClick={()=>{getDetails(eachObj)}} key={eachObj.objectID} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center" component="th" scope="row">{eachObj.title && eachObj.title.slice(0, 10)}</TableCell>
                                <TableCell align="center">{eachObj.story_url && eachObj.story_url.slice(0, 20)}</TableCell>
                                <TableCell align="center">{eachObj.comment_text && eachObj.comment_text.slice(0, 20)}</TableCell>
                                <TableCell align="center">{eachObj.author && eachObj.author.slice(0, 20)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
            </div> }
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ margin: 4 }} >
                { Object.keys(allPost).length ? <Pagination page={page} onChange={handleChange} count={Object.keys(allPost).length} color="secondary" /> : "" }
            </Box>
        </div>
    );
};

export default Home;