const corsOption ={
    
        origin:["http://localhost:5173","http://localhost:4173",process.env.CLIENT_URL],
        credentials:true
    
}

const SANDESH_TOKEN="sandesh-token"

export {corsOption,SANDESH_TOKEN}