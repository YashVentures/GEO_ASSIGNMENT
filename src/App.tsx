import { SelectionProvider } from './hooks';
import { Dashboard } from './components';
import './App.css';

function App() {
  return (
    <SelectionProvider>
      <Dashboard />
    </SelectionProvider>
  );
}

export default App;
