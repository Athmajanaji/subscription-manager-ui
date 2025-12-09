export function login({ email, password }) {
  // basic fake validation to mimic server response delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject({ message: 'Email and password required' });
      } else {
        resolve({ token: 'fake-jwt-token', user: { email } });
      }
    }, 600);
  });
}
