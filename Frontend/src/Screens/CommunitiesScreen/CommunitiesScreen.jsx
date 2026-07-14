import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Asegura que esta ruta sea la correcta

export function CommunitiesScreen() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { isLogged } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyWorkspaces = async () => {
      try {
        if (!isLogged) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('auth_token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://anitrack-back.vercel.app/api/workspace', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        const result = await response.json();
        console.log("ESTO LLEGA DEL BACKEND:", result);

        if (result.ok) {
          // Guardamos directamente la lista procesada por tu repositorio
          // que viene en result.data.workspaces
          const list = result.data.workspaces || [];
          setWorkspaces(list);
        } else {
          setError(result.message || 'Error al cargar tus comunidades');
        }
      } catch (err) {
        console.error("Error cargando comunidades:", err);
        setError('Error de conexión al servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyWorkspaces();
  }, [navigate, isLogged]);

  if (loading) {
    return (
      <div className="communities-loading">
        <p>Cargando comunidades de anime...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="communities-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="communities-container">
      <header className="communities-header">
        <button className="btn-back-home" onClick={() => navigate('/home')}>
          ← Volver al Inicio
        </button>
        <h1>Mis Comunidades</h1>
        <p>Explora y debate en tus mundos de anime favoritos</p>
      </header>

      {workspaces.length === 0 ? (
        <div className="communities-empty">
          <p>Aún no te has unido a ninguna comunidad de anime.</p>
        </div>
      ) : (
        <div className="communities-grid">
          {workspaces.map((ws) => (
            <div 
              key={ws.workspace_id} // 🟢 Usamos 'workspace_id' mapeado del backend
              className="community-card"
              onClick={() => navigate(`/workspace/${ws.workspace_id}`)} // 🟢 Navega usando 'workspace_id'
              style={{ cursor: 'pointer' }}
            >
              <div className="community-card-body">
                <h3>{ws.workspace_nombre}</h3> {/* 🟢 Usamos 'workspace_nombre' */}
                <p>{ws.workspace_descripcion || 'Sin descripción disponible.'}</p> {/* 🟢 Usamos 'workspace_descripcion' */}
              </div>
              <div className="community-card-footer">
                <span>Entrar al portal →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}