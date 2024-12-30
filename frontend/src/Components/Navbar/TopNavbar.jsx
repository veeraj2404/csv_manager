import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './TopNavbar.css';
import LoginForm from './LoginForm/LoginForm';
import { fetchDataCount } from './NavbarService';
import UploadFile from '../UploadFile/UploadFile';

export default function TopNavbar() {

  const [showExcelComponent, setShowExcelComponent] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [show, setShow] = useState(false);
  const [count, setCount] = useState({});
  const [apiCall, setApiCall] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginForm = () => setShow(true);

  const fetchData = async () => {
    // console.log("counting...")
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    const userId = user.user_id;
    const data = await fetchDataCount(userId)
    setCount(data)
    if(count){
      setApiCall(true)
    }
  }

  const openExcel = (file) => {
    // console.log("file: ", file)
    setSelectedFile(file.file_id);
    setShowExcelComponent(false);
    setTimeout(() => {
      setShowExcelComponent(true);
    }, 50);
  }
  
  useEffect(() => {
    if(localStorage.getItem("user")){
      fetchData()
      setIsLoggedIn(true)
    } else{
        setIsLoggedIn(false)
    }
  }, [apiCall])
  

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary" style={{maxHeight: "56px"}}>
      <Container fluid>
        <Navbar.Brand href="#">File Editor</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">About Us</Nav.Link>
            {isLoggedIn && <NavDropdown title="Files" id="navbarScrollingDropdown">

              {
                Object.values(count).map((file, index) => (
                  <React.Fragment key={index}>
                  <NavDropdown.Item href="#action4" onClick={() => openExcel(file)} key={index}>{file.filename}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  </React.Fragment>
                ))
              }

            </NavDropdown>}
          </Nav>
          <Button variant="outline-success" onClick={loginForm}>{isLoggedIn? "Log Out": "Log In"}</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    {show &&
      <LoginForm show = {show} setShow = {setShow} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    }

    {showExcelComponent &&
      <UploadFile selectedFile={selectedFile}/>
    }
    </>
  )
}
