import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router'
import { MIS_ANIMES } from '../../Data/animes'
import './HomeScreen.css'
import homeBanner from '../../Asent/home-banner.png'

export const HomeScreen = () => {
  const { isLogged, logout, userData } = useContext(AuthContext)
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleInteraccion(accion) {
    if (!isLogged) {
      navigate('/login');
    } 
  }

  // 🔍 Filtro para la barra de búsqueda central
  const animesFiltrados = MIS_ANIMES.filter(anime => 
    anime.titulo.toLowerCase().includes(busqueda.toLowerCase())
  )

  // 📊 Filtros para separar las listas del panel derecho
  const topAiring = MIS_ANIMES.filter(a => a.estado === 'airing').sort((a, b) => b.ranking - a.ranking);
  const topUpcoming = MIS_ANIMES.filter(a => a.estado === 'upcoming');
  const topPopular = MIS_ANIMES.filter(a => a.estado === 'popular');

  return (
    <div className="mal-container">
      
      {/* 🔹 HEADER ACTUALIZADO (Con buscador y botones) */}
      <header className="mal-header">
        <div className="header-logo" onClick={() => navigate('/home')}>
          <h1 className="logo-title">
    Ani<span>Track</span>
</h1>
        </div>

        {/* 🔍 BARRA DE BÚSQUEDA CENTRAL */}
        <div className="header-search-container">
          <input 
            type="text" 
            placeholder="Search Anime..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="header-search-input"
          />
        </div>

        <div className="header-user">
          {isLogged ? (
            <>
              <span className="username">@{userData?.nombre || "usuario"}</span>
              <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <div className="auth-buttons-group">
              <button className="btn-login-header" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </button>
              <button className="btn-register-header" onClick={() => navigate('/register')}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 🔹 CUERPO PRINCIPAL */}
      <div className="mal-layout">
        
        {/* Columna Izquierda: Catálogo dinámico */}
        <main className="mal-main-content">
          <div className="welcome-banner" style={{
        backgroundImage: `url(${homeBanner})`
    }}>

    <div className="banner-overlay"></div>

    <div className="welcome-content">

        <span className="season-badge">
            ✨ Summer 2026
        </span>

        <h2>
            {isLogged
                ? `Welcome back, ${userData?.nombre}!`
                : "Welcome to AniTrack"}
        </h2>

        <p>
            Discover the most popular anime,
            continue watching your favorites
            and build your personal collection.
        </p>

        <div className="hero-buttons">

            <button className="hero-btn-primary">
                Explore Anime
            </button>

            <button className="hero-btn-secondary" onClick={() => navigate('/register')}>
                My List
            </button>

        </div>

    </div>

</div>

          <div className="anime-grid">
            {animesFiltrados.length > 0 ? (
              animesFiltrados.map((anime) => (
                <div key={anime.id} className="anime-card glass-card">
  <div className="card-rank-box">
    <span className="rank-label">RANK</span>
    <span className="rank-value">{anime.ranking !== "N/A" ? anime.ranking : "-"}</span>
  </div>
  
  {/* 1. Agregamos el clic a la imagen del póster */}
  <img 
    src={anime.imagen} 
    alt={anime.titulo} 
    className="anime-poster" 
    onClick={() => navigate(`/anime/${anime.id}`)}
    style={{ cursor: 'pointer' }}
  />

  <div className="anime-details">
    {/* 2. El título ya tiene el navigate, le sumamos color de link para que se note el cambio */}
    <h3 
      className="anime-title-link" 
      onClick={() => navigate(`/anime/${anime.id}`)}
      style={{ cursor: 'pointer', color: '#7294e3' }}
    >
      {anime.titulo}
    </h3>
    
    <p className="anime-synopsis-text">{anime.sinopsis}</p>
    
    <div className="anime-meta-row">
      <span className="meta-badge">{anime.tipo}</span>
      <span className="meta-eps">{anime.episodios} eps</span>
      <span className="meta-members">👥 {anime.miembros} members</span>
      
      <button 
        className="btn-primary"
        onClick={() => handleInteraccion("agregar este anime a tu lista")}
      >
        + Add to List
      </button>
    </div>
  </div>
</div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6a6f8a', marginTop: '20px' }}>No se encontraron animes con ese nombre.</p>
            )}
          </div>
        </main>

        {/* Columna Derecha: Bloques Apilados */}
        <aside className="mal-sidebar">
          
          {/* Bloque 1: Top Airing */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Top Airing Anime</h3>
            <ul className="top-anime-list">
              {topAiring.map((anime, index) => (
  <li 
    key={anime.id} 
    className="top-anime-item" 
    onClick={() => navigate(`/anime/${anime.id}`)} 
    style={{ cursor: 'pointer' }}
  >
    <span className="top-index">{index + 1}</span>
    <img src={anime.imagen} alt={anime.titulo} className="top-mini-img" />
    <div className="top-info">
      <h4 className="sidebar-anime-title">{anime.titulo}</h4>
      <p>Score: {anime.ranking}</p>
    </div>
  </li>
))}
            </ul>
            <div className="sidebar-footer">
    View all →
</div>
          </div>

          {/* Bloque 2: Top Upcoming (Abajo del anterior) */}
          <div className="sidebar-section" style={{ marginTop: '30px' }}>
            <h3 className="sidebar-title">Top Upcoming Anime</h3>
            <ul className="top-anime-list">
              {topUpcoming.map((anime, index) => (
                <li key={anime.id} className="top-anime-item">
                  <span className="top-index">{index + 1}</span>
                  <img src={anime.imagen} alt={anime.titulo} className="top-mini-img" />
                  <div className="top-info">
                    <h4>{anime.titulo}</h4>
                    <p>Eps: {anime.episodios}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="sidebar-footer">
    View all →
</div>
          </div>

          <div className="sidebar-section" style={{ marginTop: '30px' }}>
            <h3 className="sidebar-title">Top Popular Anime</h3>
            <ul className="top-anime-list">
              {topPopular.map((anime, index) => (
                <li key={anime.id} className="top-anime-item">
                  <span className="top-index">{index + 1}</span>
                  <img src={anime.imagen} alt={anime.titulo} className="top-mini-img" />
                  <div className="top-info">
                    <h4>{anime.titulo}</h4>
                    <p>Eps: {anime.episodios}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="sidebar-footer">
    View all →
</div>
          </div>

        </aside>

      </div>
    </div>
  )
}