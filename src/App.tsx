import { useState } from 'react';

import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

function App() {
  const [githubToken, setGithubToken] = useState<string | null>(null);

  if (!githubToken) {
    return <Login setToken={setGithubToken} />;
  }

  return (
    <div className="flex min-h-screen bg-[#07080a]">
      <main className="flex-1 min-w-0 overflow-y-auto w-full">
        <Dashboard token={githubToken} />
      </main>
    </div>
  );
}

export default App;
