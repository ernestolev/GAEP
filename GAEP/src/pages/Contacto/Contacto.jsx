import React from 'react';
import './Contacto.modules.css';

const Contacto = () => {
  return (
    <div className="contacto">
      <h1>Contacto</h1>
      <form>
        <label>Nombre:</label>
        <input type="text" placeholder="Ingresa tu nombre" />
        <label>Correo:</label>
        <input type="email" placeholder="Ingresa tu correo" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Contacto;
