import express from 'express'

const app=express();
const port =3000;

app.get('/',(req,res)=>{
    res.send('Hola');
});

app.listen(port,()=>{
    console.log(`Esta escuchando el puerto ${port}`);
})