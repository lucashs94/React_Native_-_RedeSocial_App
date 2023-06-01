import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import AuthRoutes from '../routes/auth.routes'
import AppRoutes from '../routes/app.routes'
import useAuthContext from '../contexts/AuthContext'

export default function Routes() {
  const { signed, loadingStorage } = useAuthContext()

  if(loadingStorage){
    return(
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#36393f'}}>
        <ActivityIndicator size={50} color="#E52246"/>
      </View>
    )
  }

  return (
    signed ? <AppRoutes /> : <AuthRoutes />
  )
} 