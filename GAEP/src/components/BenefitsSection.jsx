// src/components/Home/BenefitsSection.jsx
import React from 'react';
import benef01 from '../assets/images/img-benef01.png';
import benef02 from '../assets/images/img-benef02.png';
import benef03 from '../assets/images/img-benef03.png';
import benef04 from '../assets/images/img-benef04.png';
import benef05 from '../assets/images/img-benef05.png';

const BenefitsSection = () => {
    return (
        <section className="beneficios" id='beneficios'>
            <div className="beneficios-grid">
                <div className="beneficio-item" data-aos="fade-right" data-aos-delay="100">
                    <h3>Estas son algunas razones para que te nos unas...</h3>
                    <p>Únete ahora y disfruta de los siguientes beneficios que tenemos para ti por ser miembro.</p>
                </div>
                
                <BenefitCard 
                    image={benef01}
                    title="Acceso a actividades exclusivas"
                    description="Participación preferente en actividades culturales, deportivas y académicas organizadas por la asociación, fortaleciendo el sentido de pertenencia y la unión entre sus miembros."
                    type="1"
                    delay="200"
                />
                
                <BenefitCard 
                    image={benef02}
                    title="Descuentos en eventos sociales"
                    description="Acceso a descuentos y facilidades para participar en eventos sociales organizados por la asociación. Además, se fomenta la colaboración con empresas de exalumnos y socios estratégicos a través de convenios vigentes."
                    type="2" 
                    delay="300"
                />
                
                <BenefitCard 
                    image={benef03}
                    title="Red de contactos y oportunidades laborales"
                    description="Acceso a una base de datos exclusiva de asociados para facilitar la conexión laboral entre miembros, fomentando oportunidades de trabajo y colaboraciones profesionales."
                    type="1"
                    delay="400"
                />
                
                <BenefitCard 
                    image={benef04}
                    title="Apoyo en salud y bienestar"
                    description="Convenios exclusivos con clínicas y farmacias que ofrecen descuentos especiales en servicios médicos y medicamentos para los socios y sus familias."
                    type="2"
                    delay="500"
                />
                
                <BenefitCard 
                    image={benef05}
                    title="Promoción de emprendimientos de exalumnos"
                    description="Espacios dedicados a promover empresas y emprendimientos liderados por exalumnos, fortaleciendo la comunidad y generando más visibilidad para sus proyectos."
                    type="1"
                    delay="600"
                />
            </div>
        </section>
    );
};

const BenefitCard = ({ image, title, description, type, delay }) => {
    return (
        <div className={`beneficio-item${type}`} data-aos="fade-up" data-aos-delay={delay}>
            <img src={image} alt={title} />
            <div className="contentbenf">
                <div className="beneficio-text">
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default BenefitsSection;