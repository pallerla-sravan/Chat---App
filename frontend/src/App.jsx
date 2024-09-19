import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./components/Login"
import Chat from "./components/Chat"
import Registration from "./components/Registration";



function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat/>} />
      <Route path="/registration" element={<Registration/>} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App