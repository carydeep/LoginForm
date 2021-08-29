import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Header from './components/header/index';
import Harsh from './features/harsh/index';
import Gatcha from './features/gatcha/index';
import FaceID from './features/faceID/index';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  // const [userName, setUsername] = useState([]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const reponse = await UserApi.get(1);
  //       console.log(reponse);
  //     } catch (error) {
  //       console.log('Failed :', error);
  //     }
  //   }

  //   fetchUser();
  // }, []);

  return (
    <div className="App">
      <Suspense fallback={<div>Loading .. </div>}>
        <BrowserRouter>
          <Header></Header>

          <Switch>
            <Route path="/harsh" component={Harsh} />
            <Route path='/gatcha' component={Gatcha} />
            <Route path='/faceID' component={FaceID} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
