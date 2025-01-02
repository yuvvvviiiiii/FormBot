import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FormDashBoard, FormPage, FormResponsePage, LandingPage, Login, Register, Settings, WorkSpaceArea } from './pages';
import { Toaster } from 'react-hot-toast';
import ProtectRoute from './components/ProtectRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/form/:id' element={<FormPage/>}/>
          {/* Protect Route */}
          <Route element={<ProtectRoute/>}/>
          <Route path='/formDashboard/:id' element={<FormDashBoard/>} />
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/workspace-area/:id' element={<WorkSpaceArea/>}/>
          <Route path='/form-response/:id' element={<FormResponsePage/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
