import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleAuthCallback } from '../services/auth'

function CallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Authentication error:', error)
      navigate('/')
      return
    }

    if (code) {
      handleAuthCallback(code).then(() => {
        navigate('/')
      }).catch((err) => {
        console.error('Callback error:', err)
        navigate('/')
      })
    }
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl mb-4">認証中...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto"></div>
      </div>
    </div>
  )
}

export default CallbackPage