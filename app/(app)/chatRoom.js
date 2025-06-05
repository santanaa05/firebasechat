//importa componente do react native para estruturar a interface e interatividade
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
//importa React, hooks de estado e referencias para gerenciar os inputs e estado de carregamento
import React, {useEffect, useRef, useState } from 'react'
//importa o contexto de autenticação para gerenciar o login
import { useLocalSearchParams, useRouter } from 'expo-router';
//importa o componente StatusBar para controlar a barra de status
import { StatusBar } from 'expo-status-bar';
//importa componentes personalizados usados na tela de chat
import ChatRoomHeader from '../../components/ChatRoomHeader'; //Cabelhaço personalizado da sala de chat
import MessageList from '../../components/MessageList'; //Componente para listar mensagens
//importa funções para criar layouts responsivos com base no tamanho da tela
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//importa o ícone 'send' da biblioteca Feather Icons, utilizado no botão de envio de mensagem
import { Feather } from '@expo/vector-icons';
//Componente que ajusta a interface do teclado
import CustomKeyboardView from '../../components/CustomKeyboardView';
//importa o contexto de autenticação para gerenciar o login
import { useAuth} from '../context/authContext';
//importa uma função utilitaria que retorna um ID de sala único com base nos usuários envolvidos
import { getRoomId } from '../../utils/conmon';
//importa funções do Firebase Firestore para buscar documentos e realizar consultas, para lidar com o banco de dados e manipular documentos e coleções
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
//referencia a coleção de usuarios no Firestore configurada no arquivo firebaseconfig
import { db } from '../../firebaseConfig';

export default function ChatRoom() {
    //Pega os parametros de navegação, neste caso, o usuário com quem o chat está acontecendo
    const item = useLocalSearchParams(); // segundo usuário
    //Acessa o usuário logado através do contexto de autenticação
    const { user } = useAuth(); //usuário logado
    const router = useRouter(); //hook que permite navegação programatica
    //Estado para armazenar as mensagens do chat
    const [messages, setMessages] = useState([]);
    //referencias para armazenar o texto da mensagem, o campo de input, e a lista de mensagens
    const textRef = useRef(''); //armazena o conteudo digitado pelo usuário
    const inputRef = useRef(null); //referencia para o campo de input (caixa de texto)
    const scrollViewRef = useRef(null); //referencia para a scrollView (lista de mensagens)

    //useEffect que é executado ao carregar o componente, inicializando o chat e configurando o listener para novas mensagens
    useEffect(()=> {
        createRoomIfNotExists(); // cria a sala de chat se ela não existir

        //gera um ID único para a sala com base no ID dos dois usuários
        let roomId = getRoomId(user?.userId, item?.userId);
        //refere-se ao documento da sala no Firestore
        const docRef = doc(db, "rooms", roomId);
        //refere-se á coleção de mensagens dentro dessa sala
        const messagesRef = collection(docRef, "messages");
        //cria uma query para ordenar as mensagens por data de criação (ascendente)
        const q = query(messagesRef, orderBy('createdAt', 'asc0'));

        //Listener em tempo real par atualizações na coleção de mensagens
        let unsub = onSnapshot(q, (snapshot)=> {
            //mapeia os documentos retornados para extrair os dados de cada mensagem
            let allMessages = snapshot.docs.map(doc=> {
                return doc.data();
            });
            //atualiza o estado com as novas mensagens
            setMessages([...allMessages]);
        });

        //adiciona um listener para eventos de exibição do teclado, e atualiza a lista de mensagens
        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScroolView
        )

        //Cleanup: remove o listener de mensagens e do teclado ao desmontar o componente
        return () => {
            unsub();
            KeyboardDidShowListener.remove();
        }

    }, []);

    //useEffect que é executado sempre que há uma mudança na lista de mensagens para atualizar a ScrollView
    useEffect(() => {
        updateScroolView();
    }, [messages])

    //função que rola a lista de mensagens para o final quando uma nova mensagem é adicionada ou teclado aparece
    const updateScroolView = ()=> {
        setTimeout(() => {
            scrollViewRef?.current?.scroolToEnd({animated: true}) // rola lista de mensagens até o fim
        },100)
    }

    //função que cria a sala de chat no firestore se ela ainda não existir
    const createRoomIfNotExists = async ()=>{
        //Gera um ID único para a sala com base nos dois usuários
        let roomId = getRoomId(user?.userId, item?.userId);
        //Cria um documento na coleção 'rooms' com o ID da sala e a data de criação
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    //função para enviar uma nova mensagem
    const handleSendMessage = async ()=>{
        if(!message) return; // se a mensagem estiver vazia, a função é encerrada
        try{
            //gera id da sala
            let roomId = getRoomId(user?.userId, item?.userId);
            //refere-se ao documento de sala na firestore
            const docRef = doc(db, 'rooms', roomId);
            //refere-se a coleção de mensagens dessa sala
            const messagesRef = collection (docRef, "messages");
            //limpa o campo de texto
            textRef.current = "";
            if(inputRef) inputRef?.current?.clear();
            //adiciona a nova mensagem a coleção de mensagens no firestore
            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId, //ID do usuario que enviou a mensagem
                text: message, //conteudo da mensagem
                profileUrl: user?.profileUrl, //URL da foto de perfil do usuário
                senderName: user?.username, //nome do remetente
                createdAt: Timestamp.fromDate(new Date()) // data de envio da mensagem
            });  
            //console.log('new message id: ', newDoc.Id); //(comentado) log para verificar o ID da mensagem
        } catch (err) {
            //Mostra um alerta caso ocorra algum erro ao enviar a mensagem
            Alert.alert('Message', err.message);
        }
    }
}