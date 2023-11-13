import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Button, Collapse, Tooltip, Select , Card} from 'antd';
import video from './../../imagenes/Palabras frecuentes.mp4'
import { MdOpenInNew } from 'react-icons/md'
import './Graficos.css'
// import 'antd/dist/antd.css';

//FILTRO FECHAS
import json from './../../datos/datos_globales_grafo_palabras_freq.json'
import jsonFechas from './../../datos/rango_fechas.json'
import jsonBigramas from './../../datos/datos_globales_grafo_bigramas_freq.json'
import jsonTrigramas from './../../datos/datos_globales_grafo_trigramas_freq.json'
//FIN FILTRO FECHAS
const { Panel } = Collapse;
const text = `
Las palabras más frecuentes ayudan a identificar los temas principales o terminos más usados. Si comparamos
    dos grupos de palabras.
`;

export default function GrafoPalabrasMasFrecuentes(){
  const [network, setNetwork] = useState();
  const [data, setData] = useState();
  const [display, setDisplay] = useState(true)
  const [selectedDate, setSelectedDate] = useState();
  //FILTRO FECHAS
  const [fechas, setFechas] = useState(jsonFechas.fechas)
  const [filtroFecha, setFiltroFecha] = useState(fechas[0])
  const opciones = fechas.map((fecha, index) => {
    return (
      <Select.Option key={index} value={fecha}>
        {fecha}
      </Select.Option>
    );
  });
  useEffect(() => {
    if (fechas.length > 0) {
      setSelectedDate(fechas[0]);
    }
  }, [fechas]);

  const handleFiltroFechaChange = (valor) => {
    setFiltroFecha(valor);
    setSelectedDate(valor);
  };
  // FIN FILTRO FECHAS
  function handleDisplay() {
    setDisplay(!display);
  }
  useEffect(() => {
    window.addEventListener('error', e => {
        if (e.message === 'ResizeObserver loop limit exceeded') {
            const resizeObserverErrDiv = document.getElementById(
                'webpack-dev-server-client-overlay-div'
            );
            const resizeObserverErr = document.getElementById(
                'webpack-dev-server-client-overlay'
            );
            if (resizeObserverErr) {
                resizeObserverErr.setAttribute('style', 'display: none');
            }
            if (resizeObserverErrDiv) {
                resizeObserverErrDiv.setAttribute('style', 'display: none');
            }
        }
    });
 
}, []);
useEffect(() => {
  const drawGraph = () => {
    const container = document.getElementById('palabrasMasFrecuentes');

    if (!json[filtroFecha] || !Array.isArray(json[filtroFecha]) || json[filtroFecha].length < 2) {
      console.error(`No hay datos disponibles para la fecha seleccionada: ${filtroFecha}`);
      return;
    }

    const nodes = new DataSet(json[filtroFecha][0]);
    const edges = new DataSet(json[filtroFecha][1]);
    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      height: '700px',
      backgroundColor: '#000000',
      position: 'relative',
      float: 'left',
    };

    const network = new Network(container, data, options);
    setNetwork(network);
    setData(data);
  };

    drawGraph();
    const drawGraphBigramas = () => {
    const container = document.getElementById('bigramas');
      const nodes = new DataSet(jsonBigramas[filtroFecha][0])
      const edges = new DataSet(jsonBigramas[filtroFecha][1])
      const data = {
        nodes: nodes,
        edges: edges
      };

      const options = {
        height: '700px',
        backgroundColor: '#000000',
        position: 'relative',
        float: 'left'
      };

      const network= new Network(container, data, options);
      setNetwork(network);
      setData(data);
    };

    drawGraphBigramas();
    const drawGraphTrigramas = () => {
      const container = document.getElementById('trigramas');
      // parsing and collecting nodes and edges from the python
      const nodes = new DataSet(jsonTrigramas[filtroFecha][0])
      const edges = new DataSet(jsonTrigramas[filtroFecha][1])
      const data = {
        nodes: nodes,
        edges: edges
      };

      const options = {
        height: '700px',
        backgroundColor: '#000000',
        position: 'relative',
        float: 'left'
      };
      // create a network
      const network= new Network(container, data, options);
      // store references to the network and data in the state
      setNetwork(network);
      setData(data);
    };

    drawGraphTrigramas();
    
    
  }, [filtroFecha]);

  return (
    <div className="fondo-grafo">
    <div className="card-body">

    {/*FILTRO FECHAS*/}
    <Select placeholder="Fechas" className='fechas-grafos' onChange={handleFiltroFechaChange} defaultValue={filtroFecha}>
      {opciones}
    </Select>
    {display ? 
    <div>
    <div className='grafo-video'>
    <div id="palabrasMasFrecuentes" className='cartaGrafo' style={{backgroundColor:"black"}}></div>
   
    <div className='video-texto cartaGrafo'>
    <video src={video} autoplay muted loop type="video/mp4" controls className="video-explicativo cartaGrafo" ></video>
    <div className="texto-explicativo cartaGrafo scrollable-card" >
      <br></br>
      <br></br>
   ¡Hola!, vengo a explicarte la utilidad de este tipo de grafos y como puedes explorar la información contenida en ellos:
Los grafos de palabras frecuentes, son herramientas útiles para visualizar y comprender la relación y frecuencia de palabras en un conjunto de datos. 
Estos grafos, proporcionan información sobre la importancia relativa de las palabras y las conexiones entre ellas.
A las series seleccionadas, podrás compararlas entre sí, e identificar rápidamente los temas principales, o los términos claves de cada una.
Las aristas del grafo, representan la conexión entre palabras, y su grosor o ancho indica la frecuencia de esa conexión. 
Cuanto más gruesa sea una arista, mayor será la frecuencia de la relación entre esas palabras.
El largo de las aristas, también es un indicativo de la frecuencia de la conexión, brindando, una idea de la cercanía o intensidad de la relación entre las dos palabras que une.
Las aristas más cortas (frecuencias más altas) representarían relaciones más fuertes o directas.
Estos grafos, pueden revelar insights sobre la estructura de la información y la forma en que las palabras están relacionadas entre sí. 
Al visualizar el grafo, es posible identificar clústeres de palabras altamente conectadas, lo que puede indicar la existencia de grupos temáticos o conceptuales dentro del conjunto de datos.
Añadiendo información contextual y relaciones más específicas, los grafos de bigramas y trigramas revelan conexiones y patrones de coocurrencia, entre palabras adyacentes, proporcionando información más detallada sobre las asociaciones, en el contexto del texto, obteniéndose una perspectiva más completa, y detallada de cómo las palabras interactúan en secuencias, y cómo se combinan para formar expresiones y frases, con significado particular.
Esta combinación de grafos, proporciona una visión más profunda y precisa de la estructura, y el significado de la información contenida en el texto analizado.

    </div>
    </div>
    <Tooltip title='Ocultar video'>
    <Button  shape="circle" onClick={handleDisplay}>
        -
    </Button>
    </Tooltip>
    <Tooltip title='Abrir en otro navegador'>
    <a href={`https://qsngrafos.vercel.app/palabras/maduro/grafo_palabras-frecuentes-${filtroFecha}.html`} target="_blank"><Button  shape="circle">
        <MdOpenInNew/>
    </Button>
     </a>
    </Tooltip>
    </div>
    <div className='bigramas-trigramas'>
      <div id="bigramas" className='carta2' style={{backgroundColor:"black"}}></div>
      <Tooltip title='Abrir en otro navegador'>
    <a href={`https://qsngrafos.vercel.app/palabras/maduro/grafo_bigramas-frecuentes-${filtroFecha}.html`} target="_blank"><Button className='boton-abrirnavegador' shape="circle">
        <MdOpenInNew/>
    </Button>
     </a>
    </Tooltip>
    
      </div>
      <div className='bigramas-trigramas'>
      <div id="trigramas" className='carta2' style={{backgroundColor:"black"}}></div>
      <Tooltip title='Abrir en otro navegador'>
    <a href={`https://qsngrafos.vercel.app/palabras/maduro/grafo_trigramas-frecuentes-${filtroFecha}.html`} target="_blank"><Button className='boton-abrirnavegador' shape="circle">
        <MdOpenInNew/>
    </Button>
     </a>
    </Tooltip>
    
      </div>
    </div>
    :
    <div>
    <div className='grafo-video'>
    <div id="palabrasMasFrecuentes" className='carta2' style={{backgroundColor:"black"}}></div>
    <Tooltip title='Mostrar video'>
    <Button  shape="circle" onClick={handleDisplay}>
        +
    </Button>
     </Tooltip>
     <Tooltip title='Abrir en otro navegador'>
    <a href={`https://qsngrafos.vercel.app/palabras/maduro/grafo_palabras-frecuentes-${filtroFecha}.html`} target="_blank"><Button  shape="circle">
        <MdOpenInNew/>
    </Button>
     </a>
    </Tooltip>
    
      </div>
      <div className='bigramas-trigramas'>
      <div id="bigramas" className='carta2' style={{backgroundColor:"black"}}></div>
      <Tooltip title='Abrir en otro navegador'>
    <a href={`https://qsngrafos.vercel.app/palabras/maduro/grafo_bigramas-frecuentes-${filtroFecha}.html`} target="_blank"><Button className='boton-abrirnavegador' shape="circle">
        <MdOpenInNew/>
    </Button>
     </a>
    </Tooltip>
    
      </div>
      <div className='bigramas-trigramas'>
      <div id="trigramas" className='carta2' style={{backgroundColor:"black"}}></div>
      <Tooltip title='Abrir en otro navegador'>
    <a href={`https://qsngrafos.vercel.app/palabras/maduro/grafo_trigramas-frecuentes-${filtroFecha}.html`} target="_blank"><Button className='boton-abrirnavegador' shape="circle">
        <MdOpenInNew/>
    </Button>
     </a>
    </Tooltip>
    
      </div>
      </div>
    }


    </div>
    </div>
    );
    }