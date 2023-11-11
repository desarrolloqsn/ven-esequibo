import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSelector } from "react-redux";
import { Select, Tag } from "antd";
import './Graficos.css';
import { HiDocumentDownload } from 'react-icons/hi'
import { saveAs } from 'file-saver';
import { write, utils } from 'xlsx';
import { Button, Tooltip } from 'antd';
import './../Tabla/Carta.css'

const { Option } = Select;

const Mapa = () => {
  const datos = useSelector((state) => state.datosFiltrados);
  const mapRef = useRef(null);
  const [selectedEstados, setSelectedEstados] = useState(["Distrito Capital"]); // Inicialmente selecciona "Distrito Capital"

const estados = [...new Set(datos.map((dato) => dato.ESTADO))].filter(estado => estado !== "");

// Ordenar estados alfabéticamente
estados.sort((a, b) => a.localeCompare(b));
const [filteredDatos,setFilteredDatos] = useState(datos);


  useEffect(() => {
    if (!mapRef.current) {
      // Configuramos el mapa y centramos en Caracas
      const map = L.map("map").setView([10.4806, -66.9036], 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (datos.length > 0 && mapRef.current) {
      // Limpiamos los marcadores existentes antes de agregar los nuevos
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          mapRef.current.removeLayer(layer);
        }
      });
  
      // Filtramos los datos según los estados seleccionados
      let filteredDatos = datos;
      if (selectedEstados.length > 0 && !selectedEstados.includes([])) {
        filteredDatos = datos.filter((dato) => selectedEstados.includes(dato.ESTADO));
        setFilteredDatos(filteredDatos)
      }
  
      // Verificamos si los estados seleccionados están vacíos
      if (selectedEstados.length === 0) {
        // Si los estados seleccionados están vacíos, mostramos el mapa vacío sin puntos
        filteredDatos = [];
        setFilteredDatos(filteredDatos)
      }
  
      // Creamos un objeto para almacenar los promedios por estado
      const stateAverages = {};
  
      // Calculamos la latitud y longitud promedio de las ubicaciones filtradas para cada estado
      filteredDatos.forEach((dato) => {
        if (dato.hasOwnProperty("lat") && dato.hasOwnProperty("lng")) {
          const estado = dato.ESTADO;
          const markerColor = dato.sentimiento === "positivo" ? "green" : dato.sentimiento === "negativo" ? "red" : "gray";
          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div class="custom-icon" style="background-color: ${markerColor}"></div>`,
          });
        
          // // Crear el contenido del popup con los datos del tweet
          // const popupContent = `
          //   <div className='contendor-tweets'>
          //     <div className='user-twitter'>${dato.fecha}</div>    
          //     <br></br>
          //     <div className='foto-texto-perfil'>
          //       <div className='contenedor-perfil'>
          //         <img src=${dato.profileImage} className='fotoperfil' alt='Foto de perfil' />
          //       </div>
                
          //       <div className='contenedor-publicacion'>
          //         <div className='contenedor-tituloSubtitulo'>
          //           <div className='titulo-tweet'>${dato.name}</div>
          //           <div className='user-twitter'>@${dato.usuarioOriginal}</div>
          //         </div>
          //         <div>${dato.texto}</div>
          //       </div>
          //     </div>
          //   </div>
          // `;
          const popupContent = `
          <a href=${dato.link} target="_blank">
            <div class='contendor-tweets'>
              <div class='user-twitter'>${dato.fecha}</div>    
              <br></br>
              <div class='foto-texto-perfil'>
                <div class='contenedor-perfil'>
                  <img src=${dato.profileImage} class='fotoperfil' alt='Foto de perfil' />
                </div>
                <div class='contenedor-publicacion'>
                  <div class='contenedor-tituloSubtitulo'>
                    <div class='titulo-tweet'>${dato.name}</div>
                    <div class='user-twitter'>@${dato.usuarioOriginal}</div>
                  </div>
                  <div>${dato.texto}</div>
                </div>
              </div>
              <div class='tags'>
                ${dato.sentimiento && `
                  <div
                    class="tag-mapa"
                    style="
                      background-color: ${dato.sentimiento === 'neutro' ? 'grey' : dato.sentimiento === 'positivo' ? '#008300' : '#ff2323'};
                      color: white;
                      border-radius: 10px;
                      padding: 3px 8px;
                      font-size: 12px;
                      font-weight: 600;
                      border: none;
                      margin-left: 1.5rem;
                    "
                  >
                    ${dato.sentimiento}
                  </div>
                `}
              </div>
            </div>
          </a>
        `;
  
          // Agregar el marcador al mapa y asociarlo con el popup del tweet
          const marker = L.marker([dato.lat, dato.lng], { icon: customIcon }).addTo(mapRef.current);
          marker.bindPopup(popupContent, {
            autoClose: false, // Para mantener abierto el popup hasta que lo cierres manualmente
            closeButton: true, // Mostrar botón de cierre en el popup
          });

          
  
          // Añadimos el círculo para cada ubicación
          const circleOptions = {
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.5,
            radius: 1, // Ajusta el tamaño del círculo según la cantidad de eventos (valor fijo por ahora)
          };
          L.circle([dato.lat, dato.lng], circleOptions).addTo(mapRef.current);
  
          // Calculamos el promedio de latitud y longitud por estado
          if (!stateAverages[estado]) {
            stateAverages[estado] = {
              latSum: 0,
              lngSum: 0,
              validLocations: 0,
            };
          }
          stateAverages[estado].latSum += dato.lat;
          stateAverages[estado].lngSum += dato.lng;
          stateAverages[estado].validLocations++;
        }
      });
    }
  }, [datos, selectedEstados]);
  


  // Función para manejar el cambio de estados seleccionados
  const handleEstadosChange = (value) => {
    console.log("valor filtro",value)
    setSelectedEstados(value);
  };


  const handleDownloadExcel = () => {
    if (filteredDatos && filteredDatos.length > 0) {
      // Filtrar los filteredDatos que tienen información en filteredDatos.ESTADO
      const filteredData = filteredDatos.filter((dato) => dato.ESTADO !== "");
  
      if (filteredData.length === 0) {
        // Si no hay datos con información en datos.ESTADO, mostrar un mensaje o realizar alguna acción
        alert("No hay datos con información en datos.ESTADO para descargar.");
        return;
      }
  
      const formattedData = filteredData.map((dato) => ({
        "ID": dato.id,
        "Fecha": dato.date,
        "Estado": dato.ESTADO,
        "Link": dato.link,
        "Texto": dato.texto,
        "Usuario Original": dato.usuarioOriginal,
        "Sentimiento": dato.sentimiento,
        "Latitud": dato.lat,
        "Longitud": dato.lng,
      }));
  
      const worksheet = utils.json_to_sheet(formattedData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Datos');
      const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Obtener la fecha actual
      const today = new Date();
      const date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
      // Nombre del archivo con la fecha actual
      const fileName = `MapaPolaridad_${date}.xlsx`;
  
      saveAs(data, fileName);
    }
  }

  return (
    <div>
      <div class='titulo-carta'>Mapa polaridad</div>
      <div className='subtitulo-carta'>
        <div>Polaridad por locación</div>
        
        <Select
          value={selectedEstados}
          style={{ width: 300 }}
          onChange={handleEstadosChange}
          mode="multiple" // Esto habilita la selección múltiple
          allowClear={false}
        >
          {/* <Option value="Todos">Todos</Option> */}
          {estados.map((estado) => (
            <Option key={estado} value={estado} allowClear={false}>
              {estado}
            </Option>
          ))}
        </Select>
        <Tooltip title="Descargar Excel">
          <Button onClick={handleDownloadExcel} type="primary" shape="circle" className='subtitulo-boton'><HiDocumentDownload /></Button>
        </Tooltip>
      </div>
      <div id="map" className="mapa carta" style={{ height: "500px" }}></div>
    </div>
  );
};

export default Mapa;
