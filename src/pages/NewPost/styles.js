import styled from "styled-components/native";


export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #404349;
`

export const Input = styled.TextInput`
  flex: 1;
  background-color: transparent;
  margin: 10px;
  color: #FFF;
  font-size: 20px;
  position: absolute;
  top: 0;
`

export const Button = styled.TouchableOpacity`
  margin-right: -8px;
  padding: 6px 12px;
  background-color: #418cfd;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`

export const ButtonText = styled.Text`
  color: #FFF;
`