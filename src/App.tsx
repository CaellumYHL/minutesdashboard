import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

function App() {
  const [githubToken, setGithubToken] = useState<string | null>(null);

  if (!githubToken) {
    return <Login setToken={setGithubToken} />;
  }

  return (
    <div className="flex min-h-screen bg-[#07080a]">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10 min-w-0">
        <Dashboard token={githubToken} />
      </main>
    </div>
  );
}

export default App;
