import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore'

import useAuthContext from '../../contexts/AuthContext'
import { Container, ButtonPost, ListPosts } from './styles'
import Header from '../../components/Header'
import PostItem from '../../components/PostItem'

export default function Home() {

  const { user } = useAuthContext()
  const navigation = useNavigation()

  const [posts, setPosts]  = useState([])
  const [loading, setLoading]  = useState(true)
  
  const [loadingRefresh, setLoadingRefresh]  = useState(false)
  const [lastItem, setLastItem]  = useState('')
  const [emptyList, setEmptyList]  = useState(false)


  useFocusEffect(
    
    useCallback(() => {
      let isActive = true

      async function loadPosts() {
        await firestore().collection('posts')
        .orderBy('created', 'desc')
        .limit(5)
        .get()
        .then( (snapshot) => {
          if(isActive){
            const postList = []
            setPosts([])

            snapshot.docs.map( u => {
              postList.push({
                ...u.data(),
                id: u.id,
              })
            })

            setEmptyList(!!snapshot.empty)
            setPosts(postList)
            setLastItem(snapshot.docs[snapshot.docs.length - 1])
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
        })
      }
      loadPosts()

      return () => { isActive = false }
    }, [navigation])
  )

  // Atualizar posts ao puxar a lista para baixo
  async function handleRefreshPosts(){
    setLoadingRefresh(true)

    await firestore().collection('posts')
    .orderBy('created', 'desc')
    .limit(5)
    .get()
    .then( (snapshot) => {
      const postList = []
      setPosts([])

      snapshot.docs.map( u => {
        postList.push({
          ...u.data(),
          id: u.id,
        })
      })

      setEmptyList(false)
      setPosts(postList)
      setLastItem(snapshot.docs[snapshot.docs.length - 1])
      setLoading(false)
    })
    .catch((error) => {
      console.log(error)
      setLoading(false)
      setLoadingRefresh(false)
    })

    setLoadingRefresh(false)  
  }

  // Buscar mais posts ao chegar no final da lista
  async function getListPosts(){

    if(emptyList){
      setLoading(false)
      return null
    }

    if(loading) return

    await firestore().collection('posts')
    .orderBy('created', 'desc')
    .limit(5)
    .startAfter(lastItem)
    .get()
    .then( (snapshot) => {
      const postList = []

      snapshot.docs.map( u => {
        postList.push({
          ...u.data(),
          id: u.id,
        })
      })

      setEmptyList(!!snapshot.empty)
      setLastItem(snapshot.docs[snapshot.docs.length - 1])
      setPosts(oldPosts => [...oldPosts, ...postList])
      setLoading(false)
    })
  }


  return (
    <Container>
      <Header />

      {loading ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={50} color='#e52246'/>
        </View> 
      ):
      (
        <ListPosts  
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={ ({ item }) => (<PostItem data={item} userId={user?.uid}/>) }

          refreshing={loadingRefresh}
          onRefresh={ handleRefreshPosts }

          onEndReached={getListPosts}
          onEndReachedThreshold={0.1}
        />
      )}

      <ButtonPost 
        activeOpacity={0.8}
        onPress={ () => navigation.navigate('NewPost')}
      >
        <Feather name='edit-2' color='#FFF' size={25}/>
      </ButtonPost> 

    </Container>
  )
}