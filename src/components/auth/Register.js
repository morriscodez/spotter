import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { authApi, userStorageKey } from "./authSettings"
import "./Login.css"
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar"

export const Register = () => {

    const [registerUser, setRegisterUser] = useState({ firstName: "", lastName: "", email: "" })
    const [conflictDialog, setConflictDialog] = useState(false)

    const history = useHistory()

    const handleInputChange = (event) => {
        const newUser = { ...registerUser }
        newUser[event.target.id] = event.target.value
        setRegisterUser(newUser)
    }

    const existingUserCheck = () => {
        
        return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${registerUser.email}`)
            .then(res => res.json())
            .then(user => !!user.length)
    }

    const handleRegister = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: registerUser.email,
                            name: `${registerUser.firstName} ${registerUser.lastName}`
                        })
                    })
                        .then(res => res.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                sessionStorage.setItem(userStorageKey, createdUser.id)
                                history.push("/")
                            }
                        })
                }
                else {
                    setConflictDialog(true)
                }
            })

    }

    return (

        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    <img
                        src="https://i.imgur.com/lWKMaoG.png"
                        width="80"
                        height="80"
                        className="d-inline-block align-top"
                        alt="Spotter logo" />
                </Navbar.Brand>
            </Navbar>
            
            
            <div className="outer--container">
                <div className="container">
                    
                    <main style={{ textAlign: "center" }}>

                        <dialog className="dialog dialog--password" open={conflictDialog}>
                            <div>Account with that email address already exists</div>
                            <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
                        </dialog>

                        <form className="form--login" onSubmit={handleRegister}>
                            <div className="register--title">
                                <h1 className="h3 mb-3 font-weight-normal">Please Register an Account</h1>
                            </div>
                            <fieldset>
                                <label htmlFor="firstName"> First Name </label>
                                <input type="text" name="firstName" id="firstName" className="form-control" placeholder="First name" required autoFocus value={registerUser.firstName} onChange={handleInputChange} />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="lastName"> Last Name </label>
                                <input type="text" name="lastName" id="lastName" className="form-control" placeholder="Last name" required value={registerUser.lastName} onChange={handleInputChange} />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="inputEmail"> Email Address</label>
                                <input type="email" name="email" id="email" className="form-control" placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
                            </fieldset>
                            <fieldset>
                                <Button type="submit"> Sign in </Button>
                            </fieldset>
                        </form>
                    </main>
                    
                </div>
            </div>
            
        </>
    )
}

