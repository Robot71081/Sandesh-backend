const corsOption ={
    
        origin:["https://sandesh-frontend-dec209czs-robot71081s-projects.vercel.app",process.env.CLIENT_URL],
        credentials:true
    
}

const SANDESH_TOKEN="sandesh-token"

export {corsOption,SANDESH_TOKEN}