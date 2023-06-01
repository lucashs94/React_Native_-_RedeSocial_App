import { View, Text, ActivityIndicator } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore'

import useAuthContext from '../../contexts/AuthContext'
import PostItem from '../../components/PostItem'

import { Container, ListPosts } from './styles'


export default function PostsUser() {

  const route = useRoute()
  const navigation = useNavigation()
  const { user } = useAuthContext()

  const [title, setTitle] = useState(route.params?.title)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)


  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === '' ? '': title,
    })
  }, [navigation, title])


  useFocusEffect(
    useCallback( () => {
      let isActive = true

      firestore().collection('posts')
      .where('userId', '==', route.params?.userId)
      .orderBy('created', 'desc')
      .get()
      .then((snapshot) => {
        const postList = []
        
        snapshot.docs.map( u => {
          postList.push({
            ...u.data(),
            id: u.id,
          })
        })

        if(isActive){
          setPosts(postList)
          setLoading(false)
        }
      })

      return () => {isActive = false}
    }, [])
  )


  return (
    <Container>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
          <ActivityIndicator size={50} color='#e52246' />
        </View>
      ): (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={ ({ item }) => (
            <PostItem 
              data={item}
              userId={user.uid}
            />
          )}
        />
      )}
    </Container>
  )
}