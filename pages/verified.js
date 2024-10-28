// pages/verified.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Verified() {
  const router = useRouter();
  const { name, email, token } = router.query;

  useEffect(() => {
    if (name && email && token) {
      // Guardar el token y datos del usuario en sessionStorage
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('authToken', token); // Nuevo almacenamiento del token

      // Redirigir al chat solo si la verificación es exitosa
      router.push('/chat');
    }
  }, [name, email, token, router]);

  return (
    <div>
      <p>Verifying...</p>
    </div>
  );
}
