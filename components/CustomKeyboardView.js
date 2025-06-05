// importação de componetes básicos do react native
import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from "react-native"
// Importação do React
import React from 'react'
import { FullWindowOverlay } from "react-native-screens";

//Detecta se o dispositivo esta rodando no ios
//esta verificação é importatnte porque o comportamento do teclado é diferente entre ios e android
const ios = Platform.OS == "ios";

/**
 * Componente CustomKeyboardView
 * 
 * Este componente resolve o problema comum do teclado virtual sobrepondo elementos da interface
 * envolve o conteudo em um keyboardAvoidngView e ScrollView para garantir que o usuário 
 * possa acessar todos os elementos mesmo quando o teclado está visível
 * 
 * @param {React.ReactNode} children -Componentes filhos a serem renderizados dentro do CustomKeyboardView
 * @param {boolean} inChat - Flag que indica se o componente está sendo usado na tela de chat, 
 *                            o que requer configurações específicas
 * @returns {JSX.Element} Componente que ajuda a visualização para lidar com o teclado
 */
export default function CustomKeyboardView({children, inChat}) {
    //Configurações condicionais baseadas no conteudo de uso (chat ou outras telas)
    let kavConfig = {};
    let ScrollViewConfig = {};

    //Aplica configurações  especificas se estiver na tela de chat
    if(inChat) {
        //Adiciona deslocamento vertical para o teclado na tela de chat
        //Isso evita que o teclado cubra a caixa de texto de entrada de mensagens
        kavConfig = {KeyboardVerticalOffset: 90};

        //Define flex: 1 para garantir que o ScrollView ocupe todo o espaço disponível
        //Importante para que o conteudo seja corretamente posicionado na tela de chat
        ScrollViewConfig = {contentContainerStyle: {flex: 1}};
    }

    return (
        // KeyboardAvoidingView é um componente que automaticamente ajusta seu height/position
        // quando o teclado aparece para evitar que ele cubra os inputs
        <KeyboardAvoidingView
            // Define comportamentos diferentes para iOS e Android:
            // - 'padding' (iOS): adiciona padding na parte inferior igual à altura do teclado
            // - 'height' (Android): altera a altura do componente para acomodar o teclado
            behavior={ios? 'padding': 'height'}
            // flex: 1 faz com que o componente ocupe todo o espaço disponível
            style={{flex: 1}}
            // Aplica as configurações adicionais se estiver na tela de chat
            {...kavConfig}
        >
            {/* 
            ScrollView permite que o conteúdo seja rolável
            Isso é essencial para formulários longos ou quando o teclado reduz
            o espaço disponível na tela
            */}
            <ScrollView
                // flex: 1 faz com que o ScrollView ocupe todo o espaço disponível
                style={{flex: 1}}
                // Desativa o efeito de "bounce" ao rolar além dos limites do conteúdo
                bounces={false}
                // Oculta a barra de rolagem vertical para uma interface mais limpa
                showsVerticalScrollIndicator={false}
                // Aplica as configurações adicionais se estiver na tela de chat
                {...scrollViewConfig}
            >
                {/* 
                Renderiza os componentes filhos passados para CustomKeyboardView
                Mantém a estrutura hierárquica da interface
                */}
                {
                    children
                }
            </ScrollView>
        </KeyboardAvoidingView>

    )
}