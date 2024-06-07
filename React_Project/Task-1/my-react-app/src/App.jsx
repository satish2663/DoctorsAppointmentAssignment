import SignUpForm from './registerAndLogin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import LogInForm from './login';

function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<SignUpForm />}></Route>
      <Route path='/login' element={<LogInForm />}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;