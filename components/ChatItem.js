//importa componente do react native para estruturar a interface e interatividade
import { View, Text, TouchableOpacity } from 'react-native'
//importa React, hooks de estado e referencias para gerenciar os inputs e estado de carregamento
import React, {useEffect, useState } from 'react'
//importa funções para criar layouts responsivos com base no tamanho da tela
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
//importa o componente de imagem otimizada da biblioteca Expo Image
import { Image } from 'expo-image';
//importa funções auxiliares do projeto, como gerar o hash da imagem borrada, formatar a data e obter o ID da sala de chat
import { blurhash, formatDate, getRoomId } from '../utils/commom';
//importa funções do Firebase Firestore para manipular e realizar função de listening dos dados em tempo real
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
//importa a instância do banco de dados configurado (db)
import { db } from '../firebaseConfig'

//define o componente ChatItem como padrão (default)
export default function ChatItem({item, router, noBorder, currentUser}) {

    //Estado que guarda a última mensagem recebida na conversa
    const [lastMessage, setLastMessage] = useState(undefined);

    //useEffect é usado para buscar a última mensagem assim que o componente for montado
    useEffect(()=>{
        //gera o ID da sala de chat combinando o ID do usuário atual com o do outro usuário
        let roomId = getRoomId(currentUser?.userId, item?.userId);

        //obtém a referência do documento da sala no Firestore
        const docRef = doc(db, "rooms", roomId);

        //obtém a subcoleção de mensagens dentro da sala
        const messagesRef = collection(docRef, "messages");

        //cria uma consulta ordenando as mensagens por data de criação (do mais novo ao mais antigo)
        const q = query(messagesRef, orderBy('createAt', 'desc'));

        //inscreve um listener que verifica atualizações em tempo real da coleção de mensagens
        let unsub = onSnapshot(q, (snapshot)=>{
            //mapeia os documentos retornados e extrai apenas os dados de cada mensagem
            let allMessages = snapshot.docs.map(doc=>{
                return doc.data();
            });

            //armazena a última mensagem (a mais recente, pois está ordenado decrescentemente)
            setLastMessage(allMessages[0]? allMessages[0]: null);
        });

        //retorna a função de cancelamento (unsub) quando o componente for desmontado
        return unsub;
},[]);//o array vazio indica que o efeito roda apenas uma vez quando o componente é montado

    //função chamada quando o usuário clica no item do chat
    const openChatRoom = ()=>{
        //redireciona para a tela de chatRoom, passando dos dados do usuário selecionado via parâmetros
        router.push({pathname: '/chatRoom', params: item});
    }

    //função para renderizar a data/hora da última mensagem
    const renderTime = ()=>{
        if(lastMessage){
            //pega a data da última mensagem (no formato Firebase Timestamp) e formata para exibição
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds = 1000));
        }
    }

    //função para renderizar o texto da última mensagem recebida
    const renderLastMessage = ()=>{
        //se ainda estiver carregando os dados
        if(typeof lastMessage == 'undefined') return 'Loading...';

        if(lastMessage) {
            //se a última mensagem foi enviada pelo usuário atual, mostra "Você: "
            if(currentUser?.userId == lastMessage?.userId) return "Você: "+lastMessage?.text;

            //senão, mostra apenas o texto da mensagem
            return lastMessage?.text;
        }else {
            //se não houver mensagens ainda, mostra uma saudação inicial
            return 'Diga Olá! 👋👋';
        }
    }

    // Retorno do JSX (interface visual do componente)
    return (
        // TouchableOpacity torna o componente clicável, e define os estilos com Tailwind (classes utilitárias)
        <TouchableOpacity 
            onPress={openChatRoom} 
            className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder? '': 'border-b border-b-neutral-200'}`}
        >

            {/* Componente de imagem do perfil do usuário, com efeito de transição e imagem borrada como placeholder */}
            <Image
                style={{height: hp(6), width: hp(6), borderRadius: 100}} // Tamanho e borda redonda
                source={item?.profileUrl} // URL da imagem do perfil
                placeholder={blurhash}    // Imagem borrada enquanto carrega
                transition={500}          // Tempo de transição (em milissegundos)
            />

            {/* Área com nome e última mensagem */}
            <View className="flex-1 gap-1">
                {/* Linha com nome do usuário e horário da última mensagem */}
                <View className="flex-row justify-between">
                    <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-800">
                        {item?.username}
                    </Text>
                    <Text style={{fontSize: hp(1.6)}} className="font-medium text-neutral-500">
                        {renderTime()}
                    </Text>
                </View>

                {/* Texto da última mensagem */}
                <Text style={{fontSize: hp(1.6)}} className="font-medium text-neutral-500">
                    {renderLastMessage()}
                </Text>
            </View>
        </TouchableOpacity>
    )
}