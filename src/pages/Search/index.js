import React, { useCallback, useEffect, useState } from 'react'

import { Feather } from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'

import { Container, AreaInput, Input, List } from './styles'
import SearchList from '../../components/SearchList'
import { useFocusEffect } from '@react-navigation/native'

export default function Search() {

  const [searchInput, setSearchInput] = useState('')
  const [users, setUsers] = useState([])

  useFocusEffect(
    useCallback(() => {
      setSearchInput('')

      return
    }, [])
  )


  useEffect(() => {

    if(searchInput === '' || searchInput === undefined){
      setUsers([])
      return 
    }

    const subscribers = firestore().collection('users')
    .where('name', '>=', searchInput)
    .where('name', '<=', searchInput + '\uf8ff') 
    .onSnapshot( snapshot => {
      const listUsers = []

      snapshot.forEach( doc => {
        listUsers.push({
          ...doc.data(),
          id: doc.id,
        })
      })

      setUsers(listUsers)
    })
    
    return () => subscribers()

  }, [searchInput])


  return (
    <Container>
      
      <AreaInput>
        <Feather 
          name='search'
          size={20}
          color='#e52246'
        />

        <Input 
          placeholder='Procurando alguém?'
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </AreaInput>

      <List 
        data={users}
        renderItem={ ({ item })=> (
          <SearchList 
            user={item}
          />
        ) }
      />

    </Container>
  )
}