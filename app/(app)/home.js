//importa componente do react native para estruturar a interface e interatividade
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
//importa React, hooks de estado e referencias para gerenciar os inputs e estado de carregamento
import React, {useEffect, useState } from 'react'
//importa o contexto de autenticação para gerenciar o login
import { useAuth } from '../context/authContext';
//importa o componente StatusBar para controlar a barra de status
import { StatusBar } from 'expo-status-bar';
//importa funções para criar layouts responsivos com base no tamanho da tela
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
//importa um componente personalizado que renderiza a lista de chats disponiveis
import ChatList from '../../components/ChatList'
//importa um componente de carregametno personalizado
import Loading from '../../components/Loading'; 
//importa funções do FIrebase Firestore para buscar documentos a realizar consultas
import { getDocs, query, where } from 'firebase/firestore'
//referencia a coleção de usuários no Firestore configurada no arquivo  firebaseconfig
import { usersRef } from '../../firebaseConfig';

export default function Home () {
    //Desestrutua funções e dados do contexto de autenticação 
    //'logout' : função para deslogar o usuario  
    //'user' : dados do usuario atualmente 
    const { logout, user } = useAuth();

    //estado local para armazenar a lista de usuários que serão exibidos na lista de chats
    const [users, setUsers] = useState ([]);

    //hook useEffect que é executado quando o componente é montado 
    //verifica se o ID do usuário está disponível e então chama a função para buscar os outros usuários 
    useEffect (() =>{
    if(user?.uid)
    getUsers();
}, [])

//função assincrona para buscar os outros usuarios no firestore, exceto o usuario logado
const getUsers = async () => {
//cria uma query para buscar todos o susuarios cujo 'userId' seja diferente do ID do usuario logado
const q = query(userRef, where('userId', '!=', user?.uid));

//executa a query no Firestore e obtem os documentos correspondentes 
const querySnapshot = await getDocs(q);
//array temporario para armazenar os dados dos usuarios 
let data = [];
//itera sobre cada documento retormando e extrai os dados
querySnapshot.forEach(doc=>{
    data.push({...doc.data()});
    });

    //atualiza o estado com lista de usuarios obtida
    setUsers(data);
}

return (
        // View principal que define a estrutura visual da tela Home
        <View className="flex-1 bg-white">
        {/* Configura a barra de status com um tema claro */}
        <StatusBar style="light" />
  
        {
          // Se a lista de usuários não estiver vazia, renderiza o componente ChatList com a lista de usuários
          users.length>0? (
              <ChatList currentUser={user} users={users} />
          ) : (
              // Caso contrário, exibe um indicador de carregamento enquanto a lista de usuários é buscada
              <View className="flex items-center" style={{top: hp(30)}}>
                  {/* Exibe um spinner de carregamento (ActivityIndicator) */}
                  <ActivityIndicator size="large" />
                  {/* <Loading size={hp(10)} /> */}
                  {/* Comentado: Loading é um componente customizado que poderia ser usado para exibir animação de carregamento */}
              </View>
          )
        }
        
      </View>
)
}