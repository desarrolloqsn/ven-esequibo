import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import imagen from './../../imagenes/grafo_co-ocurencia_hashtags-2023-06-16-2023-06-16.PNG';
import './Graficos.css';
import { Tooltip, Button, Select } from 'antd';
import moment from 'moment';
import video from './../../imagenes/TendenciasConversaciones.mp4';
//FILTRO FECHAS

import jsonFechas from './../../datos/rango_fechas.json';
//FIN FILTRO FECHAS

export default function GraphHashtags() {
  //FILTRO FECHAS
  const [fechas, setFechas] = useState([
    moment().format('YYYY-MM-DD'),
    moment().subtract(1, 'days').format('YYYY-MM-DD'),
    moment().subtract(2, 'days').format('YYYY-MM-DD'),
  ]);
  const [filtroFecha, setFiltroFecha] = useState(fechas[0]);
  const [selectedDate, setSelectedDate] = useState();

  const opciones = fechas.slice(-3).map((fecha, index) => (
    <Select.Option key={index} value={fecha}>
      {moment(fecha).format('YYYY-MM-DD')}
    </Select.Option>
  ));
  

  const handleFiltroFechaChange = (valor) => {
    setFiltroFecha(valor);
    setSelectedDate(valor);
  };

  return (
    <div className="fondo-grafo">
      <div className="card-body">
        <Select
          placeholder="Fechas"
          className="fechas-grafos"
          onChange={handleFiltroFechaChange}
          defaultValue={filtroFecha}
        >
          {opciones}
        </Select>

        <div className="grafo-video">
          <Tooltip title="Click para ver el grafo">
            <a
              href={`https://qsngrafos.vercel.app/co-ocurrencia/maduro/grafo_co-ocurencia_hashtags-${filtroFecha}.html`}
              target="_blank"
            >
              <div className="video-explicativo cartaGrafo">
                <img src={imagen} className="imagen-grafo" />
              </div>
            </a>
          </Tooltip>
          <div className="video-texto cartaGrafo">
            <video
              src={video}
              autoPlay
              muted
              loop
              type="video/mp4"
              controls
              className="video-explicativo cartaGrafo"
            ></video>
            <div className="texto-explicativo cartaGrafo scrollable-card">
              {/* Tu contenido aquí */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}