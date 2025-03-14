import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyCookiesPage = () => {
    return (
        <>
            <Navbar />
            <PageContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Container>
                    <Header>Política de Privacidad y Cookies</Header>

                    <LastUpdated>Última actualización: 13 de marzo de 2025</LastUpdated>

                    <Section>
                        <SectionTitle>1. Introducción</SectionTitle>
                        <Paragraph>
                            Bienvenido a GAEP. Respetamos su privacidad y nos comprometemos a proteger sus datos personales.
                            Esta política de privacidad explica cómo recopilamos, utilizamos y protegemos su información cuando
                            visita nuestro sitio web y utiliza nuestros servicios.
                        </Paragraph>
                    </Section>

                    <Section>
                        <SectionTitle>2. Información que Recopilamos</SectionTitle>
                        <Paragraph>
                            <strong>Información Personal:</strong> Podemos recopilar información personal que usted proporciona
                            voluntariamente, como nombre, dirección de correo electrónico, número de teléfono y cualquier otra
                            información que elija proporcionar cuando:
                        </Paragraph>
                        <List>
                            <ListItem>Se contacta con nosotros a través del sitio web</ListItem>
                            <ListItem>Se suscribe a nuestro boletín</ListItem>
                            <ListItem>Se registra para eventos o webinars</ListItem>
                            <ListItem>Solicita información sobre nuestros servicios</ListItem>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle>3. Cómo Utilizamos su Información</SectionTitle>
                        <Paragraph>
                            Utilizamos la información que recopilamos para varios propósitos, incluyendo:
                        </Paragraph>
                        <List>
                            <ListItem>Proporcionar, mantener y mejorar nuestros servicios</ListItem>
                            <ListItem>Comunicarnos con usted sobre nuestros servicios</ListItem>
                            <ListItem>Responder a sus consultas y solicitudes</ListItem>
                            <ListItem>Enviar avisos técnicos y actualizaciones</ListItem>
                            <ListItem>Analizar patrones de uso para mejorar la experiencia del usuario</ListItem>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle>4. Política de Cookies</SectionTitle>
                        <Paragraph>
                            Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Las cookies son
                            pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.
                        </Paragraph>

                        <SubSection>
                            <SubTitle>Tipos de Cookies que Utilizamos:</SubTitle>
                            <CookieTable>
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Propósito</th>
                                        <th>Duración</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Cookies Esenciales</td>
                                        <td>Necesarias para el funcionamiento del sitio web</td>
                                        <td>Sesión / Persistente</td>
                                    </tr>
                                    <tr>
                                        <td>Cookies Analíticas</td>
                                        <td>Ayudan a entender cómo interactúan los visitantes</td>
                                        <td>Hasta 2 años</td>
                                    </tr>
                                    <tr>
                                        <td>Cookies Funcionales</td>
                                        <td>Permiten funcionalidades y personalización mejoradas</td>
                                        <td>Hasta 1 año</td>
                                    </tr>
                                    <tr>
                                        <td>Cookies de Marketing</td>
                                        <td>Utilizadas para seguimiento entre sitios web</td>
                                        <td>Hasta 2 años</td>
                                    </tr>
                                </tbody>
                            </CookieTable>
                        </SubSection>
                    </Section>

                    <Section>
                        <SectionTitle>5. Seguridad de Datos</SectionTitle>
                        <Paragraph>
                            Implementamos medidas de seguridad apropiadas para proteger su información personal contra
                            acceso, alteración, divulgación o destrucción no autorizada. Sin embargo, ninguna transmisión
                            por Internet o método de almacenamiento electrónico es 100% seguro.
                        </Paragraph>
                    </Section>

                    <Section>
                        <SectionTitle>6. Sus Derechos</SectionTitle>
                        <Paragraph>
                            Dependiendo de su ubicación, puede tener ciertos derechos sobre su información personal, incluyendo:
                        </Paragraph>
                        <List>
                            <ListItem>Derecho de acceso a su información personal</ListItem>
                            <ListItem>Derecho a rectificar información inexacta</ListItem>
                            <ListItem>Derecho a eliminar su información personal</ListItem>
                            <ListItem>Derecho a restringir el procesamiento de sus datos</ListItem>
                            <ListItem>Derecho a la portabilidad de datos</ListItem>
                            <ListItem>Derecho a oponerse al procesamiento</ListItem>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle>7. Cambios en esta Política</SectionTitle>
                        <Paragraph>
                            Podemos actualizar esta política de privacidad periódicamente. La versión actualizada se
                            indicará mediante una fecha de "Última actualización" actualizada y la versión actualizada
                            será efectiva tan pronto como sea accesible.
                        </Paragraph>
                    </Section>

                    <Section>
                        <SectionTitle>8. Contáctenos</SectionTitle>
                        <Paragraph>
                            Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de datos,
                            contáctenos en:
                        </Paragraph>
                        <ContactInfo>
                            <p><strong>Email:</strong> gaepjpb@gmail.com</p>
                            <p><strong>Dirección:</strong> Chincha Alta, Perú</p>
                            <p><strong>Teléfono:</strong> +51 956647620</p>
                        </ContactInfo>
                    </Section>

                    <ReturnLink>
                        <Link to="/">Volver a la Página Principal</Link>
                    </ReturnLink>
                </Container>
            </PageContainer>
            <Footer />
        </>
    );
};

// Styled Components
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 80px 0;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 5rem auto 0;
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Header = styled.h1`
  font-size: 36px;
  color: #1a202c;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 700;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: #718096;
  margin-bottom: 40px;
  font-size: 14px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #2d3748;
  margin-bottom: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
`;

const SubSection = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const SubTitle = styled.h3`
  font-size: 20px;
  color: #4a5568;
  margin-bottom: 12px;
  font-weight: 500;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 16px;
`;

const List = styled.ul`
  margin-left: 24px;
  margin-bottom: 24px;
`;

const ListItem = styled.li`
  color: #4a5568;
  margin-bottom: 8px;
  line-height: 1.6;
`;

const CookieTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  
  th, td {
    border: 1px solid #e2e8f0;
    padding: 12px;
    text-align: left;
  }
  
  th {
    background-color: #f7fafc;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f9fafb;
  }
`;

const ContactInfo = styled.div`
  background-color: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 16px;
  
  p {
    margin-bottom: 8px;
  }
`;

const ReturnLink = styled.div`
  text-align: center;
  margin-top: 40px;
  
  a {
    color: #4299e1;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
    
    &:hover {
      color: #2b6cb0;
      text-decoration: underline;
    }
  }
`;

export default PrivacyCookiesPage;