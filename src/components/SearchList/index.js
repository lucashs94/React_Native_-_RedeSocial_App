import React from 'react'

import { useNavigation } from '@react-navigation/native'

import { Container, Title } from './styles'


export default function SearchList({ user }) {

  const navigation = useNavigation()

  return (
    <Container
      onPress={ () => navigation.navigate('PostsUser', { title: user?.name, userId: user?.id })}
    >
      <Title>{user?.name}</Title>
    </Container>
  )
}