import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

// Informe A
import resumen from './Informe_A/01_resumen_urrmat.md?raw'
import sqli from './Informe_A/02_sqli_urrmat.md?raw'
import xss from './Informe_A/03_xss_urrmat.md?raw'
import comandos from './Informe_A/04_comandos_urrmat.md?raw'

// Informe B
import activos from './Informe_B/05_activos_urrmat.md?raw'
import matriz from './Informe_B/06_matriz_urrmat.md?raw'
import controles from './Informe_B/07_controles_urrmat.md?raw'
import recuperacion from './Informe_B/08_recuperacion_urrmat.md?raw'

// Transversal
import prompts from './Transversal/09_prompts_urrmat.md?raw'

// Imágenes
import sqliImg from './Informe_A/img_urrmat/sqli_urrmat.png'
import xssImg from './Informe_A/img_urrmat/xss_urrmat.png'
import comandosImg from './Informe_A/img_urrmat/comandos_urrmat.png'

// Mapa de imágenes por nombre de archivo
const imagenes = {
  'sqli_urrmat.png': sqliImg,
  'xss_urrmat.png': xssImg,
  'comandos_urrmat.png': comandosImg,
}

const secciones = [
  { id: 'resumen',      label: '01 Resumen',         contenido: resumen },
  { id: 'sqli',         label: '02 SQL Injection',    contenido: sqli },
  { id: 'xss',          label: '03 XSS',              contenido: xss },
  { id: 'comandos',     label: '04 Cmd Injection',    contenido: comandos },
  { id: 'activos',      label: '05 Activos',          contenido: activos },
  { id: 'matriz',       label: '06 Matriz de Riesgo', contenido: matriz },
  { id: 'controles',    label: '07 Controles',        contenido: controles },
  { id: 'recuperacion', label: '08 Recuperación',     contenido: recuperacion },
  { id: 'prompts',      label: '09 Bitácora IA',      contenido: prompts },
]

function App() {
  const [activa, setActiva] = useState('resumen')
  const seccionActual = secciones.find(s => s.id === activa)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Sidebar */}
      <nav style={{
        width: '220px',
        minWidth: '220px',
        background: '#1e1e2e',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ color: '#cdd6f4', fontWeight: 'bold', padding: '0 16px 16px', fontSize: '14px', borderBottom: '1px solid #313244' }}>
          ⚡ EnergíaViva<br />
          <span style={{ fontWeight: 'normal', fontSize: '12px', color: '#a6adc8' }}>Auditoría E22</span>
        </div>

        {secciones.map(s => (
          <button
            key={s.id}
            onClick={() => setActiva(s.id)}
            style={{
              background: activa === s.id ? '#313244' : 'transparent',
              color: activa === s.id ? '#cba6f7' : '#cdd6f4',
              border: 'none',
              textAlign: 'left',
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              borderLeft: activa === s.id ? '3px solid #cba6f7' : '3px solid transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Contenido */}
      <main style={{
        flex: 1,
        padding: '40px',
        background: '#f8f8f8',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ lineHeight: '1.7', color: '#333' }}>
            <ReactMarkdown
              components={{
                // Resolver imágenes desde el mapa
                img: ({ src, alt }) => {
                  const nombreArchivo = src.split('/').pop()
                  const srcResuelto = imagenes[nombreArchivo] || src
                  return (
                    <img
                      src={srcResuelto}
                      alt={alt}
                      style={{ width: '100%', borderRadius: '6px', border: '1px solid #ddd', margin: '16px 0' }}
                    />
                  )
                },
                h1: ({ node, ...props }) => <h1 style={{ color: '#1a1a2e', borderBottom: '2px solid #cba6f7', paddingBottom: '8px' }} {...props} />,
                h2: ({ node, ...props }) => <h2 style={{ color: '#313244', marginTop: '32px' }} {...props} />,
                h3: ({ node, ...props }) => <h3 style={{ color: '#45475a' }} {...props} />,
                table: ({ node, ...props }) => (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }} {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => <th style={{ background: '#1e1e2e', color: '#cdd6f4', padding: '8px 12px', textAlign: 'left' }} {...props} />,
                td: ({ node, ...props }) => <td style={{ border: '1px solid #ddd', padding: '8px 12px' }} {...props} />,
                tr: ({ node, ...props }) => <tr style={{ borderBottom: '1px solid #eee' }} {...props} />,
                code: ({ node, inline, ...props }) => inline
                  ? <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: '#e64553' }} {...props} />
                  : <code style={{ display: 'block', background: '#1e1e2e', color: '#cdd6f4', padding: '16px', borderRadius: '6px', overflowX: 'auto', fontSize: '13px', lineHeight: '1.5' }} {...props} />,
                pre: ({ node, ...props }) => <pre style={{ background: '#1e1e2e', borderRadius: '6px', padding: '0', margin: '16px 0' }} {...props} />,
                blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid #cba6f7', margin: '16px 0', padding: '8px 16px', background: '#f5f0ff', color: '#555' }} {...props} />,
              }}
            >
              {seccionActual.contenido}
            </ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
