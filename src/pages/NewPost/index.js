import React, { useLayoutEffect, useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import { Container, Input, Button, ButtonText } from './styles'
import useAuthContext from '../../contexts/AuthContext'

export default function NewPost() {

  const { user } = useAuthContext()

  const navigation = useNavigation()
  const [inputText, setInputText] = useState('')

  useLayoutEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => handlePost()}
        >
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      )
    })

  }, [navigation, inputText])


  async function handlePost(){
    if(inputText === ''){
      alert('Digite algo para compartilhar...')
      return
    }

    let avatarUrl = null

    try{
      let response = await storage().ref('users').child(user?.uid).getDownloadURL()
      avatarUrl = response
    }catch(error){
      avatarUrl = null
    }

    await firestore().collection('posts')
    .add({
      created: new Date(),
      content: inputText,
      autor: user?.name,
      userId: user?.uid,
      likes: 0,
      avatarUrl: avatarUrl,
    })
    .then(() => {
      setInputText('')
      navigation.navigate('Home')
    })
    .catch((error) => console.log(error))
  }


  return (
    <Container>
      <Input 
        placeholder="O que está acontecendo?"
        value={inputText}
        onChangeText={setInputText}
        autoCorrect={false}
        multiline={true}
        placeholderTextColor='#aaa'
        maxLength={200}
      />
    </Container>
  )
}