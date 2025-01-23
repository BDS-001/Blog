import { Outlet } from 'react-router-dom'
import './App.css'
import { AuthProvider } from '../provider/AuthProvider';
import Header from '../components/Header/Header';

function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet/>
      </main>
    </AuthProvider>
  )
}

export default App