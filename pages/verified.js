import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Verified() {
  const router = useRouter();
  const { name, email } = router.query;

  useEffect(() => {
    if (name && email) {
      // Store the user's name and email in sessionStorage
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userEmail', email);

      // Redirect the user to the chat page
      router.push('/chat');
    }
  }, [name, email, router]);

  return (
    <div>
      <p>Verifying...</p>
    </div>
  );
}
