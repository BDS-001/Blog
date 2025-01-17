import { Outlet } from 'react-router-dom'
import './App.css'
import { AuthProvider } from '../provider/AuthProvider';

function App() {
  return (
     <AuthProvider>
        <main>
          <Outlet/>
        </main>
    </AuthProvider>
  )
}

export default App