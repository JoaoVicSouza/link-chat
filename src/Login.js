import React, { useState } from "react";
import "./Login.css";
import { getFirestore, collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

// Função para gerar um GUID simples
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const defaultAvatar = 'https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.600.jpg';

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() !== "" && password.trim() !== "") {
      // Verifica se já existe usuário com esse nome
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Usuário já existe
        const userDoc = querySnapshot.docs[0].data();
        if (userDoc.password === password) {
          localStorage.setItem("user", JSON.stringify({ id: userDoc.id, name: userDoc.name, avatar: userDoc.avatar }));
          setError("");
          onLogin({
            id: userDoc.id,
            name: userDoc.name,
            avatar: userDoc.avatar,
            password: userDoc.password
          });
        } else {
          setError("Senha incorreta.");
        }
      } else {
        // Novo usuário
        const id = generateGuid();
        await setDoc(doc(db, 'users', id), { 
          id, 
          name, 
          password, 
          avatar: defaultAvatar 
        });
        localStorage.setItem("user", JSON.stringify({ id, name, avatar: defaultAvatar }));
        setError("");
        onLogin({
          id,
          name,
          avatar: defaultAvatar,
          password
        });
      }
    } else {
      setError("Preencha nome e senha.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Bem-vindo</h2>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}