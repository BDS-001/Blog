import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../provider/AuthProvider';
import Header from '../components/Header/Header'
import './App.css'

function App() {
  return (
    <>
    <AuthProvider>
      <Header />
      <main>
        <Outlet/>
      </main>
    </AuthProvider>
    </>
  )
}

export default App