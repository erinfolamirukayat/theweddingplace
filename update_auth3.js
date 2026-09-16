const fs = require('fs');

let c = fs.readFileSync('client/context/AuthContext.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\s*if \(token\) \{\s*try \{\s*const payload = JSON\.parse\([\s\S]*?\}, \[token\]\);/;

const replacementString = `useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getMe();
          if (isMounted) {
            setUser(userData);
          }
        } catch {
          if (isMounted) {
            setUser(null);
            setRegistries([]);
            clearToken();
            setToken(null);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setRegistries([]);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [token]);`;

c = c.replace(regex, replacementString);
fs.writeFileSync('client/context/AuthContext.tsx', c);