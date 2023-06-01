import { ActivityIndicator, Text } from 'react-native'
import React, { useState } from 'react'

import { Container, Title, Input, Button, ButtonText, SignUpButton, SignUpText } from './styles'
import useAuthContext from '../../contexts/AuthContext'

export default function Login() {

  const { AuthSignUp, AuthSignIn, loading } = useAuthContext()

  const [login, setLogin] = useState(true)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')


  function handleToggle(){
    setLogin(!login)

    setNome('')
    setEmail('')
    setSenha('')
  }


  async function handleSignIn(email, senha){
    
    if(email === ''|| senha === ''){
      alert('Preencha todos os campos!')
      return 
    }

    await AuthSignIn(email, senha)

    setEmail('')
    setSenha('')
  }


  async function handleSignUp(nome, email, senha){
    
    if(email === ''|| senha === '' || nome === ''){
      alert('Preencha todos os campos!')
      return
    }

    await AuthSignUp(nome, email, senha)
    
    setNome('')
    setEmail('')
    setSenha('')
  }


  if(login){
    return (
      <Container>
        <Title>
          App<Text style={{color: '#e52246'}}>Post</Text>
        </Title>
  
        <Input 
          placeholder='Seu email'
          value={email}
          onChangeText={setEmail}
        />
  
        <Input 
          placeholder='*************'
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />
  
        <Button
          onPress={ () => handleSignIn(email, senha)}
        >
          {loading ? 
          <ActivityIndicator color="#FFF"/> 
          : 
          <ButtonText>Acessar</ButtonText>
          }
        </Button>
  
        <SignUpButton
          onPress={handleToggle}
        >
          <SignUpText>Criar uma conta</SignUpText>
        </SignUpButton>
  
      </Container>
    )
  }

  return (
    <Container>
      <Title>
        App<Text style={{color: '#e52246'}}>Post</Text>
      </Title>

      <Input 
        placeholder='Seu nome'
        value={nome}
        onChangeText={setNome}
      />

      <Input 
        placeholder='Seu email'
        value={email}
        onChangeText={setEmail}
      />

      <Input 
        placeholder='*************'
        value={senha}
        onChangeText={setSenha} 
        secureTextEntry={true}
      />

      <Button
        onPress={ () => handleSignUp(nome, email, senha)}
      >
        {loading ? 
          <ActivityIndicator color="#FFF"/> 
          : 
          <ButtonText>Criar conta</ButtonText>
        }
        
      </Button>

      <SignUpButton
        onPress={handleToggle}
      >
        <SignUpText>Já tem uma conta? Clique aqui</SignUpText>
      </SignUpButton>

    </Container>
  )
}