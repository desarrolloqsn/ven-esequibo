import React, {useState} from 'react'
import './Dashboard.css'
import { DatePicker, Input, Select, Button , Tooltip ,Modal , Form, Space } from 'antd';
import { TimePicker } from 'antd';
import {HiOutlineDocumentReport} from 'react-icons/hi'
import { Checkbox, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  filtrarDatos,guardarHoras } from '../../redux/actions';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AiOutlineSearch, AiFillInfoCircle } from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import isBetween from 'dayjs/plugin/isBetween';
import { TreeSelect } from 'antd';
const { SHOW_PARENT } = TreeSelect;

// Importa la extensión `isBetween`
dayjs.extend(isBetween);

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`;


export default function Filtros() {
    const datos = useSelector((state) => state.datosParaFiltros);
    const datosFiltrados = useSelector((state)=> state.datosFiltrados)
    const location = useLocation();
    const currentUrl = location.pathname;
    const subUrl = currentUrl.startsWith('/dashboard/') ? currentUrl.substring('/dashboard/'.length) : '';
    const modeloSinEspacios = decodeURIComponent(subUrl.replace(/\+/g, " "));
    const [palabrasInput,setpalabrasInput] = useState([])
    const [inputValues, setInputValues] = useState({});


     const tweetsFiltrados = datos.filter(tweet => {
      const propiedadModelo = tweet[modeloSinEspacios];
      return Array.isArray(propiedadModelo) && propiedadModelo.length > 0;
    });

    const formatDate = (fecha) => {
      const year = fecha.$y;
      const month = String(fecha.$M+1).padStart(2, "0");
      const day = String(fecha.$D).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
  
    const handleFechaChange = (dates) => {
      if (!dates || dates.length < 2) {
        dispatch(filtrarDatos());
        return
      }
    
      const fechaInicio = dates && dates[0];
      const fechaFin = dates && dates[1];
    
      const formattedFechaInicio = formatDate(fechaInicio);
      const formattedFechaFin = formatDate(fechaFin);
    
      // console.log(formattedFechaInicio, formattedFechaFin);
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        fechaInicio: formattedFechaInicio,
        fechaFin:formattedFechaFin
      }));
     
    };


    const dates = datos.map(tweet => dayjs(tweet.date));

    let minDate, maxDate;
    
    if (dates.length > 0) {
      minDate = dates.reduce((min, date) => (date.isBefore(min) ? date : min));
      maxDate = dates.reduce((max, date) => (date.isAfter(max) ? date : max));
    }
    
    // console.log('Fecha mínima:', formatDate(minDate));
    // console.log('Fecha máxima:', formatDate(maxDate));
    

    const categoriasModelos = [
      { modelo: "Sentimientos", categorias: ["Agotamiento", "Apatía", "Alegría", "Altivez", "Amor", "Aversión", "Calma", "Certeza", "Compasión", "Deseo", "Desagrado", "Dolor", "Entusiasmo", "Frustración", "Humillación", "Ira", "Miedo", "Placer", "Satisfacción", "Tensión", "Tristeza", "Valor"] },
      { modelo: "Atributos%20de%20Personalidad", categorias: ["Agrado", "Antipatico", "Calidez", "Competencia comunicativa", "Conocimiento", "Creatividad", "Credibilidad", "Desconfianza", "Deshonestidad", "Dinamismo", "Firmeza", "Fragilidad", "Frialdad", "Honestidad", "Ignorancia", "Insensibilidad", "Insensibilidad social", "Inmoralidad", "Laboriosidad", "Moralidad", "Mediocridad", "No defensa de lo nacional", "Ociosidad", "Optimismo", "Pesimismo", "Responsable", "Respeto", "Sensibilidad", "Sensibilidad social", "Sociable"] },
      { modelo: "Atributos%20de%20Politicos", categorias: ["Abierto al diálogo", "Autoridad", "Cerrado al diálogo", "Competencia comunicativa", "Conocimiento", "Defensa de lo nacional", "Deshonestidad", "Experiencia", "Falta de autoridad", "Incoherencia", "Incompetencia comunicativa", "Inexperiencia", "Insensibilidad social", "Inpopular", "Ineptitud de gestión", "Ignorancia", "No defensa de lo nacional", "No respeto institucional", "Respeto institucional"] },
      { modelo: "Continuidad%20y%20cambio", categorias: ["Cambio", "Continuidad"] },
      { modelo: "Emociones%20B%C3%A1sicas%20(Plutchik)", categorias: ["Alegría", "Anticipación", "Aversión", "Confianza", "Ira", "Miedo", "Sorpresa", "Tristeza"] },
      { modelo: "Preocupaciones", categorias: ["Ambiente", "Conflictividad", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
      // { modelo: "Preocupaciones%20-%20Ven", categorias: ["Ambiente", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
      { modelo: "Red%20motivacional%20del%20voto", categorias: ["Voto Blanco", "Voto Clientelar", "Voto Emocional", "Voto Ganador", "Voto Ideológico", "Voto Partidario", "Voto Plebiscitario", "Voto Racional", "Voto de Ira", "Voto del Miedo", "Voto por carisma", "Voto Útil"] },
      { modelo: "Voto%20Emocional%20y%20Racional", categorias: ["Voto Emocional", "Voto Racional"] }
    ];
    
    const categoriasModelosSelector = [
      { modelo: "Sentimientos", categorias: ["Agotamiento", "Apatía", "Alegría", "Altivez", "Amor", "Aversión", "Calma", "Certeza", "Compasión", "Deseo", "Desagrado", "Dolor", "Entusiasmo", "Frustración", "Humillación", "Ira", "Miedo", "Placer", "Satisfacción", "Tensión", "Tristeza", "Valor"] },
      { modelo: "Atributos de Personalidad", categorias: ["Agrado", "Antipatico", "Calidez", "Competencia comunicativa", "Conocimiento", "Creatividad", "Credibilidad", "Desconfianza", "Deshonestidad", "Dinamismo", "Firmeza", "Fragilidad", "Frialdad", "Honestidad", "Ignorancia", "Insensibilidad", "Insensibilidad social", "Inmoralidad", "Laboriosidad", "Moralidad", "Mediocridad", "No defensa de lo nacional", "Ociosidad", "Optimismo", "Pesimismo", "Responsable", "Respeto", "Sensibilidad", "Sensibilidad social", "Sociable"] },
      { modelo: "Atributos de Politicos", categorias: ["Abierto al diálogo", "Autoridad", "Cerrado al diálogo", "Competencia comunicativa", "Conocimiento", "Defensa de lo nacional", "Deshonestidad", "Experiencia", "Falta de autoridad", "Incoherencia", "Incompetencia comunicativa", "Inexperiencia", "Insensibilidad social", "Inpopular", "Ineptitud de gestión", "Ignorancia", "No defensa de lo nacional", "No respeto institucional", "Respeto institucional"] },
      { modelo: "Continuidad y cambio", categorias: ["Cambio", "Continuidad"] },
      { modelo: "Emociones Básicas (Plutchik)", categorias: ["Alegría", "Anticipación", "Aversión", "Confianza", "Ira", "Miedo", "Sorpresa", "Tristeza"] },
      { modelo: "Preocupaciones", categorias: ["Ambiente", "Conflictividad", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
      // { modelo: "Preocupaciones - Ven", categorias: ["Ambiente", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
      { modelo: "Red motivacional del voto", categorias: ["Voto Blanco", "Voto Clientelar", "Voto Emocional", "Voto Ganador", "Voto Ideológico", "Voto Partidario", "Voto Plebiscitario", "Voto Racional", "Voto de Ira", "Voto del Miedo", "Voto por carisma", "Voto Útil"] },
      { modelo: "Voto Emocional y Racional", categorias: ["Voto Emocional", "Voto Racional"] }
    ];

    // Función recursiva para construir el árbol
function buildTree(data) {
  const tree = [];

  for (let i = 0; i < data.length; i++) {
    const model = data[i];

    const node = {
      title: model.modelo,
      value: `${model.modelo}`,
      key: `${model.modelo}`,
      children: []
    };

    for (let j = 0; j < model.categorias.length; j++) {
      const category = model.categorias[j];

      const childNode = {
        title: category,
        value: `${model.modelo}-${category}`,
        key: `${model.modelo}-${category}`
      };

      node.children.push(childNode);
    }

    tree.push(node);
  }

  return tree;
}

// Generar el array treeData
const treeData = buildTree(categoriasModelosSelector);

// console.log(treeData);

    const dispatch = useDispatch();

    // console.log("data", datos)
 
    const [filtroCumple, setFiltroCumple] = useState(null);
    const [filtros, setFiltros] = useState({
      serie: [],
      subserie: [],
      palabra: [],
      sinpalabra: [], // Agregar esta línea para inicializar la propiedad sinpalabra
      fechaInicio: formatDate(minDate),
      fechaFin: formatDate(maxDate),
      horaInicio: "00:00",
      horaFin: "23:59",
      polaridad:[],
      modelo:[],
      categoria: [],
      anidados: false,
      datos: datos
    });



    useEffect(() => {

      let modelo = [modeloSinEspacios]
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        modelo: modelo ? [...modelo] : [],
      }));
    }, [modeloSinEspacios]);
  
   
    const handleFiltrarEventos = (value, key) => {
      if (value.trim() === "") {
        // El valor está vacío, puedes mostrar un mensaje de error o realizar alguna acción apropiada.
        return;
      }
      const updatedInputValues = {
        ...inputValues,
        [key]: {
          condicion: filtroCumple === 'Eventos que cumplen' ? 'Eventos que cumplen' : "Eventos que no cumplen",
          valor: value,
        },
      };
    
      setInputValues(updatedInputValues);
      
      // console.log(value, key);
      
      const updatedPalabrasInput = {
        ...palabrasInput,
        [`input${key}`]: {
          condicion: filtroCumple === 'Eventos que cumplen' ? 'Eventos que cumplen' : "Eventos que no cumplen",
          valor: value
        }
      };
    
      setpalabrasInput(updatedPalabrasInput);
    
      const cumplenArray = Object.keys(updatedPalabrasInput).reduce((arr, inputKey) => {
        if (updatedPalabrasInput[inputKey].condicion === 'Eventos que cumplen') {
          arr.push(updatedPalabrasInput[inputKey].valor);
        }
        return arr;
      }, []);
    
      const palabraArray = cumplenArray.length > 0 ? cumplenArray : [];
    
      if (filtroCumple === 'Eventos que cumplen') {
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          palabra: palabraArray,
          datos: datos
        }));

      } else if (filtroCumple === 'Eventos que no cumplen') {
        const cumplenArray = Object.keys(palabrasInput).reduce((arr, key) => {
          if (palabrasInput[key].condicion === 'Eventos que no cumplen') {
            arr.push(palabrasInput[key].valor);
          }
          return arr;
        }, []);
      
        const palabraArray = cumplenArray.length > 0 ? cumplenArray : [value];
      
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          sinpalabra: prevFiltros.sinpalabra.concat(palabraArray),
          datos: datos
        }));
      } else {
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          palabra: filtros.palabra.concat(value),
          datos:datos
        }));
      }
    };

    const handleFiltroCumpleChange = (value) => {
      setFiltroCumple(value);
    };
  
    const [duplications, setDuplications] = useState([
      { key: 0 },
    ]);
  
    const handleButtonClick = () => {
      const newDuplications = [...duplications, { key: duplications.length }];
      setDuplications(newDuplications);
    };
  
    const handleButtonClickDelete = (i) => {
      const newDuplications = duplications.filter((duplication) => duplication.key !== i);
      setDuplications(newDuplications);
   
    };
      
        // Paso 1
      const seriesSet = new Set();

      // Paso 2
      for (let i = 0; i < datos.length; i++) {
        const tweet = datos[i];

        // Paso 3
        if (tweet.seriesName !== "") {
          // Paso 4
          seriesSet.add(tweet.seriesName);
        }
      }

      // Paso 5
      const seriesArray = Array.from(seriesSet);
      // console.log(seriesArray);
        

    // Paso 1: Crear un conjunto para las subseries únicas
      const subSeriesSet = new Set();

      // Paso 2: Recorrer los datos y agregar las subseries al conjunto
      for (let i = 0; i < datos.length; i++) {
        const tweet = datos[i];
        const subSeries = tweet.subSeriesName;

        if (Array.isArray(subSeries)) {
          subSeries.forEach((subSerie) => {
            subSeriesSet.add(subSerie);
          });
        }
      }

      // Paso 3: Convertir el conjunto en un array de subseries
      const subSeriesArray = Array.from(subSeriesSet);

      // Paso 4: Mostrar el array de subseries únicas
      // console.log(subSeriesArray);


      const handleSeriesChange = (serieDato) => {
        // console.log(serie)
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          serie: serieDato,
        }));
       
      };

      const handleSubSeriesChange = (subserieDato) => {
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          subserie: subserieDato,
        }));
       
      };
    
      
     
    const renderCode = () => {
      let contadorKey = 0; 
        return duplications.map((duplication) => {
          contadorKey++; 
          return (
          <div key={contadorKey} className="filtro-texto">
            <Select placeholder="Filtro por palabra/autor/hashtag/mención" className="selectores-dash-eventos"  allowClear onChange={handleFiltroCumpleChange}>
              <Select.Option value="Eventos que cumplen" allowClear>Eventos que cumplen</Select.Option>
              <Select.Option value="Eventos que no cumplen" allowClear>Eventos que no cumplen</Select.Option>
            </Select>
            <Tooltip placement="top" title='Eliminar filtro' >
            <Button type="primary" shape="circle" onClick={(e) => handleButtonClickDelete(contadorKey, e)} className='subtitulo-boton'>
              -
            </Button>
            </Tooltip>
            {/* <Select placeholder="Categoria" className="selectores-dash-eventos" allowClear>
              <Select.Option value="Texto" allowClear>Texto</Select.Option>
              <Select.Option value="Autores" allowClear>Autores</Select.Option>
              <Select.Option value="Hashtags" allowClear>Hashtags</Select.Option>
              <Select.Option value="Menciones" allowClear>Menciones</Select.Option>
            </Select> */}
          <Input
          placeholder="Texto/Autor/Hashtag/Mención"
          allowClear
          onBlur={(e) => handleFiltrarEventos(e.target.value, contadorKey)}
          onChange={(e) => handleInputChange(contadorKey, e.target.value)}
          value={inputValues[contadorKey] ? inputValues[contadorKey].valor : ''}
        />
 
          </div>
        )});
        
      };


      const handleInputChange = (key, value) => {
        setInputValues(prevInputValues => ({
          ...prevInputValues,
          [key]:{ valor: value }
        }));
      };



      const [value, setValue] = useState([]);
      const onChange = (newValue) => {
        setValue(newValue);
        const categorias = newValue.map(item => {
          const parts = item.split('-');
          if (parts.length === 2) {
            return parts[1];
          }
          return null;
        }).filter(item => item !== null);
      
        setFiltros(prevFiltros => ({
          ...prevFiltros,
          modelo: newValue.map(value => value.split('-')[0]),
          categoria: categorias
        }));
      }
      const tProps = {
        treeData,
        value,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Categorías',
        style: {
          width: '100%',
        },
      };


      function obtenerHora(objeto) {
        // Obtener la propiedad $d.$D del objeto
        const fechaCompleta = objeto.$d;
      
        // Crear un objeto de fecha a partir de la cadena de fecha completa
        const fecha = new Date(fechaCompleta);
      
        // Obtener la hora y minutos de la fecha
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
      
        // Formatear la hora en formato "22:09"
        const horaFormateada = `${agregarCeroDelante(horas)}:${agregarCeroDelante(minutos)}:00`;
      
        // Devolver la hora formateada
        return horaFormateada;
      }
      
      function agregarCeroDelante(numero) {
        // Agregar un cero delante del número si es menor a 10
        return numero < 10 ? `0${numero}` : numero;
      }
      
      
   
    
    


      

    


      const handleHoraChange = (times) => {
       
        if(times){
          const [horaInicio, horaFin] = times;
          if (!times || times.length === 0) {
            // Establecer las times predeterminadas '00:00' y '23:59'
            times = [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')];
          }
          
      
          // Realizar la validación de horaInicio > horaFin
          if (horaInicio > horaFin) {
            // Mostrar un mensaje de error o realizar la acción correspondiente
            // console.log("La hora de inicio no puede ser mayor que la hora de fin");
            // Otra acción...
            return; // Salir de la función para evitar continuar con el flujo
          }
        
          // console.log(times);
          guardarHoras(horaInicio, horaFin);
        
          const horaIn = obtenerHora(horaInicio);
          const horaFi = obtenerHora(horaFin);
          setFiltros((prevFiltros) => ({
            ...prevFiltros,
            horaInicio: horaIn,
            horaFin: horaFi
          }));
          // console.log(horaIn, horaFi);
        }
       
       
      };
     

   
const initialValues = [formatDate(minDate), formatDate(maxDate)];
 
const initialValuesHora = [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')];

// Buscar el objeto correspondiente al modelo en categoriasModelos
const modeloEncontrado = categoriasModelos.find(item => item.modelo === subUrl);

// Obtener la lista de categorías del modelo
const categorias = modeloEncontrado ? modeloEncontrado.categorias : [];



const selectProps = {
  mode: 'multiple',
  placeholder: 'Categorias',
  maxTagCount: 'responsive',
};

const selectPropsSub = {
  mode: 'multiple',
  placeholder: 'Subseries',
  maxTagCount: 'responsive',
};

const selectPropsPolaridad = {
  mode: 'multiple',
  placeholder: 'Polaridad',
  maxTagCount: 'responsive',
};

const selectPropsSerie = {
  mode: 'multiple',
  placeholder: 'Serie',
  maxTagCount: 'responsive',
};

const handlePolaridadChange = value => {
  setFiltros(prevFiltros => ({
    ...prevFiltros,
    polaridad: value
  }));
};

const handleCategoriaChange = value => {
  setFiltros(prevFiltros => ({
    ...prevFiltros,
    categoria: value
  }));
};



const onChangeCheck = (e) => {
  setFiltros(prevFiltros => ({
    ...prevFiltros,
    anidados: !filtros.anidados
  }));
};


const startDate = dayjs(initialValues[0]);
const endDate = dayjs(initialValues[1]);

const disabledDate = current => {
  // Verifica si la fecha actual está fuera del rango permitido
  return !dayjs(current).isBetween(startDate, endDate, null, '[]');
};


  function sendFilter(){
    if (filtros.horaInicio === "" && filtros.horaFin === "") {
      filtros.horaInicio = '00:00';
      filtros.horaFin = '23:59';
    }
  
    const valores = {
      serie: filtros.serie,
      subserie: filtros.subserie,
      palabra: [],
      sinpalabra: [],
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      horaInicio: filtros.horaInicio,
      horaFin: filtros.horaFin,
      polaridad: filtros.polaridad,
      modelo: filtros.modelo,
      categoria: filtros.categoria,
      anidados: filtros.anidados,
     datos:datos
    };
  
    // Agregar los valores de inputValues a los filtros
    for (const key in inputValues) {
      if (inputValues[key].condicion === 'Eventos que cumplen') {
        valores.palabra.push(inputValues[key].valor);
      } else if (inputValues[key].condicion === 'Eventos que no cumplen') {
        valores.sinpalabra.push(inputValues[key].valor);
      }
    }
    // console.log(inputValues)
    // console.log(valores);
    // console.log(filtros.palabra,filtros.sinpalabra)
    dispatch(filtrarDatos(valores));
  }


  return (
    <div>
    <div className='nombreDashboard'>VEN - Referendo Guyana - TW{modeloSinEspacios ? `- ${modeloSinEspacios}` : null}</div>
    <div className='contenedor-filtros'>
     <div className='boton-informe'>
     <Tooltip placement="top" title='Generar informe' >
     <Link to="/informes" ><Button type="primary" shape="circle" className='subtitulo-boton'><HiOutlineDocumentReport/></Button></Link>
    </Tooltip>
    </div>
   
    <div className='filtro-texto'>

    
    <DatePicker.RangePicker
  name="dias"
  placeholder={['Día Inicio', 'Día Fin']}
  allowClear={false}
  onChange={handleFechaChange}
  defaultValue={[
    dayjs(initialValues[1], dateFormat),
    dayjs(initialValues[1], dateFormat)
  ]}
  format={dateFormat}
  disabledDate={() => false}  // Permitir selección de cualquier fecha
  className="selectores-dash-eventos"
/>
      <div className='filtro-texto-hora'>
    
      <TimePicker.RangePicker
       name="horas"
        placeholder={['Hora Inicio', 'Hora Fin']}
        format='HH:mm'
        allowClear={true}
        onChange={handleHoraChange}
        // defaultValue={initialValuesHora}
      className="selectores-dash-hora"
        
      />
      <Tooltip title='Si se quiere ver el horario por defecto poner 00:00 a 23:59'>
      <AiFillInfoCircle/>
      </Tooltip>
      </div>
    </div>
    <div className='filtro-texto'>
    

      <Select
        placeholder="Serie"
        onChange={handleSeriesChange}
        allowClear // Habilitar la funcionalidad de borrado
        {...selectPropsSerie}
        className="selectores-dash-eventos"
      >
        {seriesArray.map((serie, index) => (
          <Select.Option key={index} value={serie}>
            {serie}
          </Select.Option>
        ))}
      </Select>


      
      <Select
        placeholder="Subserie"
        className="selectores-dash-eventos"
        onChange={handleSubSeriesChange}
        allowClear // Habilitar la funcionalidad de borrado
        disabled={subSeriesArray.length === 0}
        {...selectPropsSub}
      >
        {subSeriesArray.map((subserie, index) => (
          <Select.Option key={index} value={subserie}>
            {subserie}
          </Select.Option>
        ))}
      </Select>

      </div>


    
      <div className='filtro-texto'>
    <Select
      placeholder="Polaridad"
      className="selectores-dash-eventos"
      onChange={handlePolaridadChange}
      allowClear
      {...selectPropsPolaridad}
    >
      <Select.Option value="neutro" allowClear>Neutro</Select.Option>
      <Select.Option value="positivo" allowClear>Positivo</Select.Option>
      <Select.Option value="negativo" allowClear>Negativo</Select.Option>
    </Select>
    
  


   
   {tweetsFiltrados.length > 0 ? 
    
    <Select
      placeholder="Categorias"
      className="selectores-dash-eventos"
      onChange={handleCategoriaChange}
      {...selectProps}
    >
      {categorias.map(categoria => (
        <Select.Option key={categoria} value={categoria} allowClear>
          {categoria}
        </Select.Option>
      ))}
    </Select>
  
    
    
    : <TreeSelect {...tProps} /> }


</div>



   <div className='filtro-texto'>
   <Select placeholder="Filtro por palabra/autor/hashtag/mención" className="selectores-dash-eventos"  allowClear onChange={handleFiltroCumpleChange}  >
       <Select.Option value="Eventos que cumplen" allowClear>Eventos que cumplen</Select.Option>
       <Select.Option value="Eventos que no cumplen" allowClear>Eventos que no cumplen</Select.Option>
       
     </Select>
      <Tooltip placement="top" title='Agregar filtro' >
     <Button type="primary" shape="circle" onClick={handleButtonClick} className='subtitulo-boton'>
     +
     </Button>
     </Tooltip> 
    
     <Input
        placeholder="Texto/Autor/Hashtag/Mención"
        allowClear
        onBlur={(e) => handleFiltrarEventos(e.target.value, 0)}
        onChange={(e) => handleInputChange(0, e.target.value)}
        value={inputValues[0] ? inputValues[0].valor : ''}
      /> 

     </div> 

     

    {renderCode()} 
    <Checkbox onChange={onChangeCheck}>Añadir filtro con datos anidados</Checkbox>
    <Button type='primary' onClick={sendFilter} className='subtitulo-boton'>Filtrar</Button>
   </div>
   </div>
  )
}
