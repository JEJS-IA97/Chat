import { useState } from 'react';
import { ChatPage } from "../src/pages/chatPage";
import { AuthPage } from "../src/pages/authPage";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("chat-token") || "");
  const [miUsuario, setMiUsuario] = useState(() => {
      const guardado = localStorage.getItem("chat-user-data");
      return guardado ? JSON.parse(guardado) : null;
  });

  const handleLoginSuccess = (nuevoToken, datosUsuario) => {
      setToken(nuevoToken);
      setMiUsuario(datosUsuario);
      localStorage.setItem("chat-token", nuevoToken);
      localStorage.setItem("chat-user-data", JSON.stringify(datosUsuario));
  };

  const handleCerrarSesion = () => {
      setToken("");
      setMiUsuario(null);
      localStorage.removeItem("chat-token");
      localStorage.removeItem("chat-user-data");
  };

  return (
    <>
      {!token ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatPage 
          token={token} 
          miUsuario={miUsuario} 
          onCerrarSesion={handleCerrarSesion} 
        />
      )}
    </>
  )
}

export default App