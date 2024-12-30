import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNavbar from './Components/Navbar/TopNavbar';
import UploadFile from './Components/UploadFile/UploadFile';
import Alert from './Components/Notifications/Alert';



function App() {

  var alertText = "Now you can view, modify and download .csv file in just few clicks."


  return (
    <>
      <TopNavbar/>
      {/* <Alert message={alertText}></Alert> */}
      <UploadFile/>
    </>
  )
}

export default App
