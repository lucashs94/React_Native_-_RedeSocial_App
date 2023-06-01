import { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


export const AuthContext = createContext({})

export function AuthProvider({ children }){

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStorage, setLoadingStorage] = useState(true)


  useEffect(() => {
    async function loadStorageUser(){
      const storageUser = await AsyncStorage.getItem('@user')

      if(storageUser){
        setUser(JSON.parse(storageUser))
        setLoadingStorage(false)
      }
      setLoadingStorage(false)
    }
    loadStorageUser()

  }, [])


  async function AuthSignUp(name, email, password){
    setLoading(true)

    await auth().createUserWithEmailAndPassword(email, password)
    .then( async (data) => {
      let uid = data.user.uid

      await firestore().collection('users').doc(uid).set({
        name: name,
        createdAt: new Date(),
      })
      .then(() => {
        let userData = {
          uid: uid,
          name: name,
          email: data.user.email,
        }

        setUser(userData)
        storageUser(userData)
      })
    })
    .catch( (error) => console.log(error))
    .finally( () => setLoading(false))
  }


  async function AuthSignIn(email, password){
    setLoading(true)

    await auth().signInWithEmailAndPassword(email, password)
    .then( async (data) => {
      let uid = data.user.uid

      const profile = await firestore().collection('users').doc(uid).get()

      let userData = {
        uid: uid,
        name: profile.data().name,
        email: data.user.email,
      }

      setUser(userData)
      storageUser(userData)
    })
    .catch( (error) => console.log(error))
    .finally(() => setLoading(false))
  }


  async function AuthSignOut(){
    await auth().signOut()
    await AsyncStorage.clear()
    .then( () => {
      setUser(null)
    })
  }


  async function storageUser(data){
    await AsyncStorage.setItem('@user', JSON.stringify(data))
  }


  return(
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        loadingStorage,
        AuthSignUp,
        AuthSignIn,
        AuthSignOut,
        setUser,
        storageUser,
      }}
    > 
      {children}
    </AuthContext.Provider>
  )
}

// Custom Context Hook
export default function useAuthContext(){
  return(
    useContext(AuthContext)
  )
}