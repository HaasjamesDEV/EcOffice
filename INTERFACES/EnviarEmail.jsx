//import { auth } from "./firebase/firebaseConfig";

export function EnviarEmail(email) {
  const authentication = getAuth(auth);
  return sendPasswordResetEmail(authentication, email)
    .then(() => {
      alert("Se ha enviado un correo para restablecer tu contraseña.");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
