//importa componentes essenciais do React Native para estruturar a tela de carregamento
import { View, Text, ActivityIndicator } from 'react-native'
//importa React para criar componentes funcionais
import React from 'react'

//função do componente que exibe uma tela inicial com um indicador de carregamento
export default function StartPage() {
    return (
        //View principal com estilo de flexboxpara centralizar o conteudo na tela
        <View style={{flex: 1, justifyContent: 'center'}}>
            {/*exibe um indicador de atividade circular, mostrando ao usuário que algo está carregando*/}
            <ActivityIndicator size="large" color="gray" />
        </View>
    )
}