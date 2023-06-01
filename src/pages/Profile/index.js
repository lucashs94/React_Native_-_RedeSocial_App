import React, { useEffect, useState } from 'react'
import { Modal, Platform, TouchableWithoutFeedback } from 'react-native'

import { Feather } from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import { launchImageLibrary } from 'react-native-image-picker'

import useAuthContext from '../../contexts/AuthContext'
import Header from '../../components/Header'

import { Container, Name, Email, Button, ButtonText, UploadButton, UploadText, Avatar,
        ModalContainer, BackButton, Input } from './styles'


export default function Profile() {

  const { AuthSignOut, user, setUser, storageUser } = useAuthContext()

  const [nome, setNome] = useState(user?.name)
  const [url, setUrl] = useState(null)
  const [open, setOpen] = useState(false)


  useEffect(() => {
    let isActive = true
    async function loadAvatar(){
      try {
        if(isActive){
          let response = await storage().ref('users').child(user?.uid).getDownloadURL()
          setUrl(response)
        }
      } catch (error) {
        console.log(error)     
      }
    }
    loadAvatar()

    return () => isActive = false
  }, [])


  async function handleSignOut(){
    await AuthSignOut()
  }

  async function updateProfileName(){
    if(nome === ''){
      return
    }

    await firestore().collection('users').doc(user?.uid)
    .update({
      name:  nome,
    })

    const postsDocs = await firestore().collection('posts')
    .where('userId', '==', user?.uid).get()

    postsDocs.forEach( async doc => {
      await firestore().collection('posts').doc(doc.id)
      .update({
        autor: nome, 
      })
    })

    let data = {
      uid: user.uid,
      name: nome,
      email: user.email,
    }

    setUser(data)
    storageUser(data)
    setOpen(false)
  }

  async function uploadFile(){
    const options = {
      noData: true,
      mediaType: 'photo',
    }

    launchImageLibrary(options, response => {
      if(response.didCancel){
        console.log('Cancelouu')
      }else if(response.errorCode){
        console.log('Houve algum erro')
      }else{
        sendPhotoFirebase(response)
        .then(() => {
          uploadAvatar()
        })

        setUrl(response.assets[0].uri)
      }
    })
  }

  function getFileLocalPath(response){
    return response.assets[0].uri
  }

  async function sendPhotoFirebase(response){
    const fileSource = getFileLocalPath(response)
    const storageRef = storage().ref('users').child(user?.uid)

    return await storageRef.putFile(fileSource)
  }

  async function uploadAvatar(){
    const storageRef = storage().ref('users').child(user?.uid)
    await storageRef.getDownloadURL()
    .then(async (image) => {
      const postDocs = await firestore().collection('posts').where('userId', '==', user.uid).get()

      postDocs.forEach( async doc => {
        await firestore().collection('posts').doc(doc.id)
        .update({
          avatarUrl: image,
        })
      })
    })
    .catch( error =>  console.log(error))
  }
  

  return (
    <Container style={{alignItems: 'center'}}>
      <Header />

      { url ? (
        <UploadButton onPress={ () => uploadFile() }>
          <UploadText>+</UploadText>
          <Avatar
            source={{ uri: url }}
          />
        </UploadButton>
      ) : (
        <UploadButton onPress={ () => uploadFile() }>
          <UploadText>+</UploadText>
        </UploadButton>
      )}

      <Name>{user?.name}</Name>
      <Email>{user?.email}</Email>

      <Button bg='#428cfd' onPress={() => setOpen(true)}>
        <ButtonText color='#FFF'>Atualizar perfil</ButtonText>
      </Button>

      <Button bg='#DDD' onPress={handleSignOut}>
        <ButtonText color='#353840'>Sair</ButtonText>
      </Button>

        <Modal visible={open}animationType='slide' transparent={true} >
          <ModalContainer enabled behavior={Platform.OS === 'android' ? '' : 'padding'}>

            <BackButton onPress={() => setOpen(false)}>
              <Feather 
                name='arrow-left' 
                size={22}
                color='#121212'
              />
              <ButtonText color='#121212'>Voltar</ButtonText>
            </BackButton>

            <Input 
              placeholder={user?.name}
              value={nome}
              onChangeText={setNome}
            />
            <Button bg='#428cfd'onPress={updateProfileName}>
              <ButtonText color='#FFF'>Salvar</ButtonText>
            </Button> 

          </ModalContainer>
        </Modal>

    </Container>
  )
}