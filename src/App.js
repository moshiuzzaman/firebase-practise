import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';


firebase.initializeApp(firebaseConfig);
function App() {
  const provider = new firebase.auth.GoogleAuthProvider();

  const [isNewUser,setIsNewUser] =useState(false)
  const [user,setUser]=useState({
    isSingIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
  })

  const singInHandler =()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName, photoURL, email}=res.user;
      const singedIn={
        isSingIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(singedIn);
    })
    .catch(function(error) {
      // Handle Errors here.
      console.log(error.code)
      console.log(error.message)
      // The email of the user's account used.
      console.log(error.email)
      // The firebase.auth.AuthCredential type that was used.
      console.log(error.credentia)
      // ...
    });
  }

  const singOutHandler=()=>{
    firebase.auth().signOut()
    .then(res=>{
      const singedOut={
        isSingIn: false,
        success:false,
        name: '',
        email: '',
        photo: '',
        error: "",

      }
      setUser(singedOut);
    })
  }
  const onBlur = (e) => {
    const fildName = e.target.name;
    const fildValue = e.target.value

    let isFildValid=true;
    if(fildName ==='email'){
       isFildValid =/\S+@\S+\.\S+/.test(fildValue)
      
    }
    if(fildName ==='password'){
       const isPasswordLengthValid = fildValue.length >5;
       const isPaaawordHasNumber=/\d{1}/.test(fildValue);
       isFildValid=isPasswordLengthValid && isPaaawordHasNumber ;
    }
   
    if(isFildValid){
      const newUser ={...user}
      newUser[fildName]=fildValue
      setUser(newUser)
    }
  }
  
  const submitHandler=(e)=>{
     if (isNewUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const userinfo = {...user};
       userinfo.success = true;
       userinfo.error="";
      setUser(userinfo);
      updateUserName(user.name);
      console.log(user.name);
      
      })
      .catch(error=> {
       const userinfo = {...user};
       userinfo.error=error.message
       userinfo.success = false;
      setUser(userinfo)
      });
     }
     else if(!isNewUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const userinfo = {...user};
       userinfo.success = true;
       userinfo.error="";
      setUser(userinfo);
      console.log(res.user);
      })
      .catch(function(error) {
        const userinfo = {...user};
        userinfo.error=error.message
        userinfo.success = false;
       setUser(userinfo)
      });
     }
     e.preventDefault()
  }

 const updateUserName =name=>{
  const user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name,
  }).then(function() {
    console.log('updated');
  }).catch(function(error) {
    console.log(error.message);
  });
 }
  return (
  <div className='App'>
   <div>
     {
       user.isSingIn ? <button onClick={singOutHandler}>Sign Out By Google</button> : <button onClick={singInHandler}>Sign in With Google</button>
     }
     {
       user.isSingIn && <div>
         <h1>Your name: {user.name}</h1>
         <h4>Your email: {user.email}</h4>
         <img src={user.photo} alt=""/>
       </div>
     }
   </div>
   <div>
     <input type="checkbox" onChange={()=>setIsNewUser(!isNewUser)} name="" id=""/>
     <label htmlFor="newUser">Newuser </label>
     <form action="">
       {isNewUser &&<input type="text" onBlur={onBlur} name="name" id="" placeholder="name"/>}
       <br/>
       <input type="text" onBlur={onBlur} name="email" id="" placeholder="email"/>
       <br/>
       <input type="password" onBlur={onBlur} name="password" id="" placeholder="pass" />
       <br/>
       <input type="submit" onClick={submitHandler} value={isNewUser ? "Sing Up" : "sing in"}/>
     </form>
     <p style={{color:"red"}}>{user.error}</p>
     {
       user.success && <p style={{color:"green"}}>Successfully {isNewUser ? 'Created': "login"}{console.log(isNewUser)}</p>
     }
   </div>
  </div>
  );
}

export default App;
