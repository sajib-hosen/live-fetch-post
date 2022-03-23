import { Button, Card, CardContent, Grid, Pagination, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

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
    const [timerKey, setTimerKey] = useState<NodeJS.Timer | null>(null) // interval key passing to anothe useEffect to conditionaly stop
    const [allPost, setAllPost] = useState<any>({})
    const [page, setPage] = useState(1);
    const [pagePost, setPagePost] = useState<InitPost[]>([]);
    
    useEffect(() => {  // calling the API after each 10 second by changing state.
      const timer = setInterval(()=>{
        setKeyCall(Date.now())
      }, 10000)

      setTimerKey(timer) //
    }, []) 

    useEffect(()=>{  // fetching data after every 10 second.
        fetch(`https://hn.algolia.com/api/v1/search_by_date?query=${pageCount}`)
        .then( res => res.json())
        .then(data =>{
            setAllPost({...allPost, [pageCount]: data.hits})
        })
        setPageCount(pageCount + 1) //set up page number

        if(pageCount > 19){  // conditionaly stopping the setInterval when we got data for 20 times
            if(timerKey){
                clearInterval(timerKey)
            }
        }
    },[ keyCall ])

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
    console.log(pagePost)

    return (
        <div>
             <Box sx={{ flexGrow: 1, margin:3 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {pagePost && pagePost.map((eachObj: InitPost) => (
                    <Grid item xs={2} sm={4} md={4} key={eachObj.objectID}>
                        <Card>
                        <CardContent>
                            {eachObj.author && <Typography>Author: {eachObj.author.toUpperCase()}</Typography>}
                            {eachObj.title && <Typography>Title: {eachObj.title}</Typography>}
                            {eachObj.comment_text && <Typography>Comment: {eachObj.comment_text.slice(0, 200)} {eachObj.story_url && <a href={eachObj.story_url} target="_blank" >Read Story</a> }</Typography>}
                            <Button variant='outlined' >Details</Button>
                        </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ margin: 4 }} >
                <Pagination page={page} onChange={handleChange} count={pageCount} color="secondary" />
            </Box>
        </div>
    );
};

export default Home;