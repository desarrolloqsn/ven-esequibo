import { Empty, Table, Tag } from 'antd';
import React, { useEffect } from 'react';
import perfil from './../../imagenes/user.webp';
import './Carta.css'
import { useSelector } from 'react-redux';
import { Rate } from 'antd';
import { useLocation } from 'react-router';
import {HiDocumentDownload} from 'react-icons/hi'
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';


export default function TablaTweets(){
  const datatweets = useSelector((state) => state.datosFiltrados);
  const location = useLocation();
  const currentUrl = location.pathname;
  const subUrl = currentUrl.startsWith('/dashboard/') ? currentUrl.substring('/dashboard/'.length) : '';
  const modeloSinEspacios = decodeURIComponent(subUrl.replace(/\+/g, " "));

  const tweetsFiltrados = datatweets.filter(tweet => {
    const propiedadModelo = tweet[modeloSinEspacios];
    return Array.isArray(propiedadModelo) && propiedadModelo.length > 0;
  });

 

  const decodeText = (text) => {
    try {
      return decodeURIComponent(text);
    } catch (error) {
      return text;
    }
  };
  const attributes = [
    'Atributos de Personalidad',
    'Atributos de Politicos',
    'Continuidad y cambio',
    'Emociones Básicas (Plutchik)',
    'Preocupaciones',
    'Preocupaciones - Ven',
    'Red motivacional del voto',
    'Sentimientos',
    'Voto Emocional y Racional'
  ];



// Paso 1: Iterar sobre cada objeto en el array
datatweets.forEach(tweet => {
  // Paso 2: Sumar las propiedades "citas", "retweets", "likes", "comentarios" y "vistas"
  const { citas, retweets, likes, comentarios } = tweet;
  const totalInteracciones = citas + retweets + likes + comentarios;

  // Paso 3: Almacenar la suma en una nueva propiedad del objeto
  tweet.totalInteracciones = totalInteracciones;
});

// Paso 4: Ordenar el array de objetos en base a la propiedad "totalInteracciones" de forma descendente
const tweetsNuevo = datatweets.sort((a, b) => b.totalInteracciones - a.totalInteracciones);
const top10MasRetwitteados = tweetsNuevo.slice(0,100)

 
  console.log("TWEETS",tweetsNuevo.slice(0,100));
  
const data = [
  {
    key: '1',
    Tweets: 'Some tweet',
  },
  // ...otros datos
];


const columns = [
  {
   
    dataIndex: 'Tweets',
    width: '50%',
    title: (
 
      <Tooltip title='Mas engagements referido a la suma de me gusta, retweets, comentarios y citas.'>
     Tweets
     </Tooltip>
     
  ),
  


    render: (_, record) =>{
      if (top10MasRetwitteados.length > 0) {
        return (
      top10MasRetwitteados.map((item, index) => (

        <Link to={item.link} target="_blank"> <div key={index}>
          
          <div className='contendor-tweets'>
            {/* CONTENEDOR GENERAL */}
            <div className='user-twitter'>{item.fecha}</div>    
            <br></br>
            <div className='foto-texto-perfil'>
              {/* CONTENEDOR foto y texto vertical */}
              <div className='contenedor-perfil'>
                {/* CONTENEDOR FOTO PERFIL */}
                <img
                  src={item.profileImage || perfil}
                  className='fotoperfil'
                  alt='Foto de perfil'
                />
              </div>
              
              <div className='contenedor-publicacion'>
                {/* CONTENEDOR TEXTO */}
                <div className='contenedor-tituloSubtitulo'>
                  <div className='titulo-tweet'>{item.name}</div>
                  {/* Título */}
                  <div className='user-twitter'>@{item.usuarioOriginal}</div>
                            
                   
                  </div>
                  {/* Mapeo de usuarios categorizadores */}
                  {item.usuarioCategorizador_Comments.length > 0 && (
                    <div>
                      <div>Replying to</div>
                      <div className='replyingto'>
                        {item.usuarioCategorizador_Comments.map((usuario, index) => `@${usuario}`).join(' ')}
                      </div>
                    </div>
                  )}
                 <div>{decodeText(item.texto)}</div>
                {/* Texto */}
                {item.imagen_tweet !== null && item.imagen_tweet.length > 0 ? (
                  <div>
                    {item.imagen_tweet.map((elemento, index) => {
                      if (elemento.startsWith('https://video')) {
                        return (
                          <video key={index} src={elemento} controls  className='publicacion'/>
                
                        );
                      } else {
                        return (
                          <img
                            key={index}
                            src={elemento}
                            className='publicacion'
                            alt='Imagen de la publicación'
                          />
                        );
                      }
                    })}
                  </div>
                ) : null}
                {/* Imagen */}

              {/*TWEET CITADO*/}
              {item.name_author_tweet_citado ?
                        <div className='contendor-tweets citado'>
                           <div className='user-twitter'>{item.fecha_tweet_citado}</div>  
                            <div className='contenedor-publicacion'>
                              {/* CONTENEDOR TEXTO */}
                              <div className='contenedor-tituloSubtitulo'>
                                <div className='titulo-tweet'>{item.name_author_tweet_citado}</div>
                                {/* Título */}
                                <div className='user-twitter'>@{item.usuarioOriginal_tweet_citado}</div>
                                          
                             
                                </div>
                                </div>
                          <div>{decodeText(item.texto_tweet_citado)}</div>
                         
                        </div>
                        : null}



                {/* <div className='tags'> */}

        <div className='tags'> 
                  {/* CONTENEDOR tags */}
                  <Tag
                    key={index}
                    style={{marginBottom:"0.5rem"}}
                    color={
                      item.sentimiento === 'neutro'
                        ? 'grey'
                        : item.sentimiento === 'positivo'
                        ? '#008300'
                        : '#ff2323'
                    }
                  >
                    {item.sentimiento.toUpperCase()}
                  </Tag>
                   {/* {item.tags.map((tag, index) => (
                    <Tag style={{marginBottom:"0.5rem"}} key={index} color='blue'>{tag}</Tag>
                  ))} */}
                     {modeloSinEspacios !== null ? null :
                  <div>
                  {item[modeloSinEspacios].map((tag, index) => (
                    <Tag style={{marginBottom:"0.5rem"}} key={index} color='blue'>{tag}</Tag>
                  ))}
                  </div>
                }
                  
                
                  
                  
                 
                

                </div>
                
                <Rate allowHalf disabled defaultValue={item.totalInteracciones / top10MasRetwitteados[0].totalInteracciones * 5}  character={<span style={{ fontSize: '18px' }}>★</span>} />
                 {/* <div className='retweets'>{item.retweets} retweets</div>  */}
              </div>
            </div>
          </div>

         
        </div></Link>
      
       ))
       );
   } else {
     return <Empty description="No hay eventos"/>;
   }
 
       }
       
       }
 ];

const convertirArraysACadenas = (data) => {
  const newData = { ...data };
  for (const key in newData) {
    if (Array.isArray(newData[key])) {
      newData[key] = newData[key].join(', ');
    }
  }
  return newData;
};
const handleDownloadExcel = () => {
  const datosConvertidos = datatweets.map(convertirArraysACadenas);
  const worksheet = XLSX.utils.json_to_sheet(datosConvertidos, { header: Object.keys(datosConvertidos[0]) });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type:'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Obtener la fecha actual
  const today = new Date();
  const date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // Nombre del archivo con la fecha actual
  const fileName = `Tweets_${date}.xlsx`;

  saveAs(data, fileName);
};

  return(
    <div>
    <div className='titulo-carta'>Categorización</div>
   
    <div className='subtitulo-carta'>
        <div>Eventos con más engagements</div>
        <Tooltip title="Descargar Excel">
        <Button onClick={handleDownloadExcel} type="primary" shape="circle"  className='subtitulo-boton'><HiDocumentDownload/></Button>
        </Tooltip>
      </div>
    <div className='carta'>
      <Table columns={columns} dataSource={data} scroll={{ y: 348 }} pagination={false}/>
    </div>
    </div>
  )
}
 

