function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-green-500">
          Spotify Sheet Player
        </h1>
        <p className="text-xl mb-8">
          Spotifyと連携して楽譜を自動生成します
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg">
          Spotifyと連携
        </button>
      </div>
    </div>
  )
}

export default App