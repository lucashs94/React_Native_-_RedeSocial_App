import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import firestore from '@react-native-firebase/firestore'

import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Container, Name, Header, Avatar, ContentView, Content, 
         Actions, Like, LikeButton, TimePost } from './styles'



export default function PostItem({ data, userId }) {

  const navigation = useNavigation()
  const [likesPosts, setLikesPosts] = useState(data?.likes)


  async function handleLikePost(id, likes){
    const docId = `${userId}_${id}`

    const doc = await firestore().collection('likes')
    .doc(docId).get()

    // Like já existe, precisamos remover
    if(doc.exists){
      await firestore().collection('posts').doc(id)
      .update({
        likes: likes - 1
      })

      await firestore().collection('likes').doc(docId)
      .delete()
      .then(() => {
        setLikesPosts(likes - 1)
      })
      return
    }

    // Não existe o like, precisar criar
    await firestore().collection('likes').doc(docId)
    .set({
      postId: id,
      userId: userId,
    })

    await firestore().collection('posts').doc(id)
    .update({
      likes: likes + 1
    })
    .then(() => {
      setLikesPosts(likes + 1)
    })
  }


  function formatTimePost(){
     const datePost = new Date(data?.created.seconds * 1000)

     return formatDistance(
      new Date(), 
      datePost, 
      {
        locale: ptBR
      }
     )
  }


  return (
    <Container>
      <Header
        onPress={ () => navigation.navigate('PostsUser', { title: data?.autor, userId: data?.userId }) }
      >
        {data.avatarUrl ? (
          <Avatar  
            source={{ uri: data.avatarUrl }} 
          />
        ) : (
          <Avatar  
            source={require('../../assets/avatar.png')} 
          />
        )}
        <Name
          numberOfLines={1}
        >{data?.autor}</Name>
      </Header> 

      <ContentView>
        <Content>{data?.content}</Content>
      </ContentView>

      <Actions>
        <LikeButton
          onPress={ () => handleLikePost(data.id, likesPosts) }
        >
          <MaterialCommunityIcons 
            name={likesPosts === 0 ? 'heart-plus-outline' : 'cards-heart'}
            size={20}
            color='#e52246'
          />
          <Like>
            {likesPosts === 0 ? '' : likesPosts }
          </Like>
        </LikeButton>

        <TimePost>
          {formatTimePost()}
        </TimePost>
      </Actions>

    </Container>
  )
}