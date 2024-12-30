import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {Toaster, toast} from 'react-hot-toast';
import * as service from './LoginService.js'

export default function LoginForm({show, setShow, isLoggedIn, setIsLoggedIn}) {

    const[task, setTask] = useState(true);
    const[passwordChange, setPasswordChange] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: ''
    });
    const [isValidEmail, setIsValidEmail] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    };

    const handleUpload = async () => {
        
        if (isLoggedIn){
            localStorage.clear()
            setShow(false)
            setIsLoggedIn(false)
        }else {
            if (validateEmail(formData.email)) {
                setIsValidEmail(true);
                // You can proceed to server-side validation here
              } else {
                setIsValidEmail(false);
                console.log('Please enter a valid email address.');
                return ;
              }
            if(task){
                const login = await service.fetchUser(formData)
                const userString = JSON.stringify(login.user); // Convert the object to a string using JSON.stringify()
                localStorage.setItem("user", userString) // Store the string in localStorage under the key "user"
                setShow(false);
                setIsLoggedIn(true);
                toast.success('Successfully LogIn!')
            }else{
                const register = await service.registerUser(formData);
                const userString = JSON.stringify(register.user); // Convert the object to a string using JSON.stringify()
                localStorage.setItem("user", userString) // Store the string in localStorage under the key "user"
                setShow(false);
                setIsLoggedIn(true);
                toast.success('Successfully Register!')
            }
        }
    }

    const handlePassowrdChange = () => {
        setPasswordChange(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTask = () => {
        setTask(!task)
        setFormData({
            userName: '',
            email: '',
            password: ''
        })
    }
    
    const handleClose = () => {
        setShow(false);
    }

    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{isLoggedIn? "Log Out" : passwordChange? "Forgot Password" : task? "Log In" : "Register"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    isLoggedIn ? 
                        <Form.Text>
                            Are you sure, you want to logout?
                        </Form.Text> :

                        passwordChange? 
                            <Form.Text>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name='email'
                                        placeholder="name@example.com"
                                        autoFocus
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    </Form.Group>
                                    {/* <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        id="inputPassword5"
                                        aria-describedby="passwordHelpBlock"
                                        value={formData.password}
                                        onChange={handleChange}
                                    /> */}
                            </Form.Text> :
                        task ? 
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name='email'
                                    placeholder="name@example.com"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                </Form.Group>
                                <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="inputPassword5"
                                    aria-describedby="passwordHelpBlock"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Form.Text muted>
                                    <div style={{display: "contents", cursor: "pointer", fontStyle: "italic"}} onClick={handlePassowrdChange}>
                                        Forgot Password?
                                    </div>
                                </Form.Text>
                                <br />
                                <Form.Text>
                                    Dont have an account? 
                                    <div style={{display: "contents", cursor: "pointer", fontWeight: "bold", color: "#0d6efd"}} onClick={handleTask}> Register</div>
                                </Form.Text>
                            </Form> :
                            <Form>
                                <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                </Form.Group>
                                <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="inputPassword5"
                                    aria-describedby="passwordHelpBlock"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Form.Text muted>
                                    Your password must be 8-20 characters long, contain letters and numbers,
                                    and must not contain spaces, special characters, or emoji.
                                </Form.Text>
                                <br />
                                <Form.Text>
                                    Already have an account? 
                                    <div style={{display: "contents", cursor: "pointer", fontWeight: "bold", color: "#0d6efd"}} onClick={handleTask}> Log In</div>
                                </Form.Text>
                            </Form>         
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleUpload}>
                {isLoggedIn? "Log Out" : task? "Log In" : "Register"}
            </Button>
            </Modal.Footer>
        </Modal>
        <Toaster/>
        
        </>
    );

}
