import { useState, useEffect } from 'react'
import SpotifyAuth from '../components/SpotifyAuth/SpotifyAuth'
import Player from '../components/Player/Player'
import { getAccessToken } from '../services/auth'

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = getAccessToken()
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-spotify-green">
        Spotify Sheet Player
      </h1>
      
      {!isAuthenticated ? (
        <div className="flex flex-col items-center">
          <p className="text-xl mb-8">Spotifyと連携して楽譜を自動生成します</p>
          <SpotifyAuth />
        </div>
      ) : (
        <Player />
      )}
    </div>
  )
}

export default HomePage