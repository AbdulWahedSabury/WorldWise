import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import NavPage from "../components/NavPage";
import { useAuth } from "../contexts/FakeAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const {logIn,isAuthenticated} = useAuth();
  const navigate = useNavigate();
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("wahed@example.com");
  const [password, setPassword] = useState("qwerty");

  useEffect(function(){
    if(isAuthenticated === true) navigate('/app',{replace:true})
  },[isAuthenticated,navigate])

  function handleLogin(e){
    e.preventDefault();
    logIn(email,password)
  }
  return (
    <main className={styles.login}>
      <NavPage />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type='primary' onClick={handleLogin}>Login</Button>
        </div>
      </form>
    </main>
  );
}
