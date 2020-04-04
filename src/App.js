import React from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignInWithGoogle = () => {

    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;

        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        console.log(email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  };

  const handleSignOut = () => {
    console.log("Sign Out Clicked");
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          password: '',
          error: '',
          isValid: false,
          existingUser: false,
        }
        setUser(signedOutUser);
      })

      .catch(err => {

      })

  };
  const userSignIn = (event) => {


    if (user.isValid) {
      console.log("User Sign In Successful");
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }

    else {
      console.log("Invalid submit");
    }


    event.preventDefault();
    event.target.reset();

  };

  const createAccount = (event) => {

    if (user.isValid) {
      console.log("User Created");
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }

    else {
      console.log("Invalid submit");
    }

    event.preventDefault();
    event.target.reset();

  };

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };

    let isValid = true;
    if (e.target.name === "email") {
      isValid = isValidMail(e.target.value);
      console.log(e.target.value, " Email", isValid);

    }
    if (e.target.name === 'password') {

      isValid = isValidPassword(e.target.value);
      // isValid = e.target.value.length > 8;
      console.log(e.target.value, " Password", isValid);

    }


    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };

  const isValidMail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  // for upper lower and nums
  // const isValidPassword = password => /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,})$/.test(password);

  //for char and nums
  const isValidPassword = password => /^(?=.*[0-9])(?=.*([a-z] || [A-Z] ))([a-zA-Z0-9!@#$%^&*.,;:'"+/-]{8,})$/.test(password);

  const switchForm = (event) => {

    const createdUser = { ...user };
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);

  };




  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>
          : <button onClick={handleSignInWithGoogle}>Sign In with Google</button>

      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="userphoto" />
        </div>
      }
      <br/>
      <br/>
      <br/>

      <input type="checkbox" name="switchForm" onChange={switchForm} />
      <label htmlFor="switchForm">Has an account already?</label>
      <br/>
      <br/>

      <form style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>

        <h1>Sign Up</h1>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required />
        <br />
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value="Create Account" />

      </form>
      


      <form style={{display: user.existingUser ? 'block' : 'none'}}  onSubmit={userSignIn}>

        <h1>Sign In</h1>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value="Sign In" />

      </form>

      {
        user.error && <p style={{ color: 'red' }}> <b>{user.error}</b> </p>
      }







    </div>
  );
}

export default App;
