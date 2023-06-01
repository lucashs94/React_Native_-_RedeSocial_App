import styled from "styled-components/native";


export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #36393f;
  justify-content: center;
  align-items: center;
`

export const Title = styled.Text`
  color: #fff;
  font-size: 55px;
  font-weight: bold;
  font-style: italic;
`

export const Input = styled.TextInput`
  width: 80%;
  background-color: #FFF;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  height: 45px;
  font-size: 15px;
  align-items: center;
`

export const Button = styled.TouchableOpacity`
  width: 80%;
  background-color: #4CAF50;
  border-radius: 8px;
  margin-top: 10px;
  padding: 10px;
  align-items: center;
  justify-content: center;
`

export const ButtonText = styled.Text`
  color: #FFF;
  font-size: 20px;
`

export const SignUpButton = styled.TouchableOpacity`
  width: 100%;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`

export const SignUpText = styled.Text`
  color: #DDD;
  font-size: 15px;
`