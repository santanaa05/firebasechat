// Importações necessárias do React Native e outras bibliotecas
import { View, Text, Platform } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // Para adaptar dimensões à tela
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Para respeitar áreas seguras (notch, barra superior, etc.)
import { Image } from 'expo-image'; // Imagem com carregamento otimizado e placeholder
import { blurhash } from '../utils/common'; // Imagem codificada usada como placeholder durante carregamento
import { useAuth } from '../context/authContext'; // Hook de contexto de autenticação

// Componentes do menu pop-up
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// Item customizado do menu
import { MenuItem } from './CustomMenuItems';

// Ícones do Expo
import { AntDesign, Feather } from '@expo/vector-icons';

// Detecta se o sistema operacional é iOS
const ios = Platform.OS == 'ios';

// Componente principal do cabeçalho da Home
export default function HomeHeader() {
  // Obtém o usuário autenticado e a função de logout
  const { user, logout } = useAuth();

  // Obtém as margens seguras (safe areas) do dispositivo
  const { top } = useSafeAreaInsets();

  // Função chamada ao clicar em "Profile" (ainda vazia)
  const handleProfile = () => {
    // Futuramente pode redirecionar o usuário para a tela de perfil
  }

  // Função chamada ao clicar em "Sign Out"
  const handleLogout = async () => {
    await logout(); // Executa o logout do usuário
  }

  return (
    <View
      // Define o estilo do cabeçalho: padding superior baseado na área segura
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row justify-between px-5 bg-indigo-400 pb-6 rounded-b-3xl shadow"
    >
      {/* Título do cabeçalho */}
      <View>
        <Text style={{ fontSize: hp(3) }} className="font-medium text-white">Chats</Text>
      </View>

      {/* Menu do usuário (imagem que abre o menu) */}
      <View>
        <Menu>
          <MenuTrigger
            customStyles={{
              triggerWrapper: {
                // Espaço reservado para customizações no botão de abrir o menu
              }
            }}
          >
            {/* Imagem de perfil do usuário */}
            <Image
              style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
              source={user?.profileUrl} // URL da imagem de perfil
              placeholder={blurhash} // Imagem de loading codificada
              transition={500} // Tempo da transição de imagem
            />
          </MenuTrigger>

          {/* Opções do menu ao clicar na imagem */}
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: 'continuous',
                marginTop: 40,
                marginLeft: -30,
                backgroundColor: 'white',
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 0 },
                width: 160 // Largura do menu
              }
            }}
          >
            {/* Item "Profile" do menu */}
            <MenuItem
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
            />

            {/* Linha divisória */}
            <Divider />

            {/* Item "Sign Out" do menu */}
            <MenuItem
              text="Sign Out"
              action={handleLogout}
              value={null}
              icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  )
}

// Componente auxiliar para criar uma linha divisória entre os itens do menu
const Divider = () => {
  return (
    <View className="p-[1px] w-full bg-neutral-200" />
  )
}