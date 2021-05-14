import React, { useState, useEffect} from 'react';
import axios from 'axios';

var productos = [];

function App() {
  const [productoId, setProductoId] = useState(-1);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(0);
  const [arrProductos, setProductos] = useState([]);
  const [consulta, setConsulta] = useState(0);

  const [comentario, setComentario] = useState('');
  
  const limpiar = () => {
    setNombre("");
    setPrecio(0);
    setProductoId(-1);
    
  }
  const guardar = () => {
    var method = 'post';
    var url = 'http://localhost/productos/public/api/productos/agregar';
    if(productoId === -1) {
      method = 'post';
      url = 'http://localhost/productos/public/api/productos/agregar';
    }else{
      method = 'put';
      url = 'http://localhost/productos/public/api/productos/'+productoId;
    }
    axios({
      method: method,
      url: url,
      data: {
        nombre: nombre,
        precio: precio
      }
    })
      .then(function (response) {
        setConsulta(0);
     
    });
        
  }
  const eliminarProducto = (id) => {
    axios({
      method: 'delete',
      url: 'http://localhost/productos/public/api/productos/'+id,
      
    })
      .then(function (response) {
        
        setConsulta(0);
       
    });
  }
  const guardarComentario = (productoId, index) => {
   const comentario = document.getElementById('producto'+index).value;
    
    axios({
      method: 'post',
      url: 'http://localhost/productos/public/api/comentariosProductos/agregarComentario',
      data : {
        productoId: productoId,
        comentario: comentario,
      }
    })
      .then(function (response) {
        setConsulta(0);
        document.getElementById('producto'+index).value = "";
    });
  }
  const cargarProducto = (id) => {
    axios({
      method: 'get',
      url: 'http://localhost/productos/public/api/productos/'+id,
      
    })
      .then(function (response) {
        const producto = response.data.producto;
        setProductoId(producto.id);
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        
    });
  }

  useEffect(() => {
    if(consulta === 0){

      setConsulta(1);
      axios({
        method: 'get',
        url: 'http://localhost/productos/public/api/comentariosProductos',
        
      })
        .then(function (response) {
          productos = response.data;
          setProductos(productos);
          setComentario(Array());
      });
    }
    
  });
  return (
    <div className="container">
      <div className="row">
        <h3>Productos</h3>
        <hr/>

      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="nombre">Nombre producto</label>
            <input type="text" id="nombre" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio producto</label>
            <input type="text" id="precio"  className="form-control"value={precio}  onChange={e => setPrecio(e.target.value)}/>
          </div>
          <div className="form-group mt-2 ">
            <button className="btn btn-primary" onClick={()=>guardar()}>Guardar</button>
            <button className="btn btn-primary ms-2" onClick={()=>limpiar()}>Limpiar</button>
          </div>
        </div>
      </div>
      <h3 className="mt-5">Listado de productos</h3>
      <hr/>
      <div className="row" id="contendorProductos">
      
        {arrProductos.map((item,index) => 
        <div className="card mt-2" key={index}>
            <div className="card-body">
              <p>
                <strong><label>Producto: </label></strong> {item.nombre}
              </p>
              <p>
                <strong><label>Precio: </label></strong> {item.precio}
              </p>
              <button className="btn btn-link"  onClick={()=> cargarProducto(item.id)}>Editar</button>
              <button className="btn btn-link" onClick={()=> eliminarProducto(item.id)}>Eliminar</button>
              <div className=" d-grid gap-2">
                <input id={'producto'+index} className="form-control" />
                <button className="btn btn-primary" onClick={()=>guardarComentario(item.id,index)}>Agregar comentario</button>
              </div>
              
            </div>
            <div>
              <b>{item.comentarios.length === 0 ? 'Sin comentario' : 'Comentarios' }</b>
              {item.comentarios.map((comentario,index) => <li key={'comentario'+index}>{comentario.comentario}</li>)}
            </div>
            
            
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
