import { createContext } from "react";
import { useContext, useReducer } from "react";

const FakeAuthContext = createContext();

const initialValue = {
  user: null,
  isAuthenticated: false,
};

const FAKE_USER = {
    name: "Abdul Wahed",
    email: "wahed@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

function reducer(state, action) {
  switch (action.type) {
    case "logIn":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logOut":
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}
function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialValue
  );
 
  function logIn(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "logIn", payload: FAKE_USER });
  }
  function logOut() {
    dispatch({ type: "logOut" });
  }

  return (
    <FakeAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        logIn,
        logOut,
      }}
    >
      {children}
    </FakeAuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(FakeAuthContext);
  if (context === null)
    throw new Error("AuthContext has used out side of the provider");
  return context;
}
export { AuthProvider, useAuth };
