import React from 'react'

const About = () => {
  return (
    <section id="sobre-mi" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">Sobre Mí</h2>
            <p className="about-intro">
              Soy Daniel Cortés, fundador de Stratek, especializado en crear soluciones digitales innovadoras que impulsan el crecimiento de los negocios.
            </p>
            <p>
              Con experiencia en desarrollo full-stack y especialización en inteligencia artificial,
              combino conocimientos técnicos sólidos con una visión estratégica para entregar
              proyectos que no solo funcionan perfectamente, sino que también generan resultados medibles.
            </p>

            <div className="skills-section">
              <h3>Tecnologías que domino</h3>
              <div className="skills-grid">
                <div className="skill-category">
                  <h4><i className="fas fa-code"></i> Frontend</h4>
                  <div className="skill-tags">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Vue.js</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">TypeScript</span>
                    <span className="skill-tag">HTML5</span>
                    <span className="skill-tag">CSS3</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h4><i className="fas fa-server"></i> Backend</h4>
                  <div className="skill-tags">
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">Python</span>
                    <span className="skill-tag">PHP</span>
                    <span className="skill-tag">MongoDB</span>
                    <span className="skill-tag">MySQL</span>
                    <span className="skill-tag">PostgreSQL</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h4><i className="fas fa-robot"></i> IA & Machine Learning</h4>
                  <div className="skill-tags">
                    <span className="skill-tag">OpenAI API</span>
                    <span className="skill-tag">Claude</span>
                    <span className="skill-tag">TensorFlow</span>
                    <span className="skill-tag">Langchain</span>
                    <span className="skill-tag">RAG Systems</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h4><i className="fas fa-tools"></i> DevOps & Tools</h4>
                  <div className="skill-tags">
                    <span className="skill-tag">Docker</span>
                    <span className="skill-tag">Git</span>
                    <span className="skill-tag">AWS</span>
                    <span className="skill-tag">Vercel</span>
                    <span className="skill-tag">CI/CD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-profile">
            <div className="profile-card">
              <img 
                src="/img/developer.jpg" 
                alt="Daniel Cortés - Fundador de Stratek" 
                className="profile-image"
                loading="lazy"
                decoding="async"
              />
              <div className="profile-info">
                <h3>Daniel Cortés</h3>
                <p>Full Stack Developer & AI Specialist</p>
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/daniel-cort%C3%A9s-890423324/" target="_blank"><i className="fab fa-linkedin"></i></a>
                  <a href="https://github.com/danielcortes2" target="_blank"><i className="fab fa-github"></i></a>
                  <a href="mailto:danielcortescasadas6@gmail.com"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About