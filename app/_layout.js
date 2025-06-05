//importa os componentes View text da biblioteca "react-native", que são fundamentais para criar interfaces no React Native
import { View, Text } from 'react-native'
//importa o modulo React, que é necessario para construir componentes funcionais no React Native
import React from 'react'
//importa o componente Stack da bilbioteca 'expo-router', que é responsavel por gerenciar a navegação entre telas no aplicativo 
import { Stack } from 'expo-router'
//importa o componente personalizado HomeHeader do diretório de componentes, que será utilizado como cabeçalho na tela inicial do aplicativo
import HomeHeader from '../../components/HomeHeader'

//Define a função _layout que é exportada como padrão. Esta função representa a estrutura proncipal de layout da aplicação
export default function _layout() {
    return (
        //o componente Stack organiza as telas em uma planilha de navegação
        //isso permite alternar entre diferentes telas dentro da aplicação, mantendo o historico de navegação 
        <Stack>
            {/* Define uma nova tela dentro da pilha de navegação.
            A tela é chamada de "home" e possui uma configuração personalisada para o cabeçalho. */}
            <Stack.Screen
            name="home" //nome da tela, que pode ser usada para referencia em outras partes do código, como navegação 
            options={{
                //o header da tela é personalisado para usar o componente HomeHeader em vez do cabeçalho padrão.
                //isso permite um controle completo sobre o design e comportamento do cabeçalho.
                header: () => <HomeHeader />
                }}
                />
        </Stack>
    )
}