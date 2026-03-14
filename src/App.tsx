import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0c]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
