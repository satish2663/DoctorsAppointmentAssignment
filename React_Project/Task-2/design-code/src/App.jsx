import Sidebar from './sidebar';
import Content from './content';
import ArtistsList from './Artists';
import './App.css';

const App = () => {
  return (
    <div className="app" id='root'>
      <Sidebar />
      <Content />
      <ArtistsList />
    </div>
  );
};

export default App;
