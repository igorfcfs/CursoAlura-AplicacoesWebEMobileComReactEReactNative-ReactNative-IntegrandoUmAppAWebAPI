import { VStack, Image, Text, Box, Link, useToast } from 'native-base'
import { TouchableOpacity } from 'react-native';
import Logo from './assets/Logo.png'
import { Botao } from './components/Botao';
import { EntradaTexto } from './components/EntradaTexto';
import { Titulo } from './components/Titulo';
import { useEffect, useState } from 'react';
import { fazerLogin } from './services/AutenticacaoServico';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { NavigationProps } from './@types/navigation';

export default function Login({ navigation }: NavigationProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(true);
  const toast = useToast();

  useEffect(() => { //executado sempre q a tela e carregada
    // AsyncStorage.removeItem('token');
    async function verificarLogin(){
      const token = await AsyncStorage.getItem('token');
      if (token){
        navigation.replace('Tabs');
      }
      setCarregando(false);
    }
    verificarLogin();
  }, []);

  async function login(){
    const resultado = await fazerLogin(email, senha);
    if (resultado){
      const { token } = resultado;
      AsyncStorage.setItem('token', token);
      const tokenDecodificado = jwtDecode(token) as any;
      const pacienteId = tokenDecodificado.id;
      AsyncStorage.setItem('pacienteId', pacienteId)
      navigation.replace('Tabs');
    } else {
      // console.log('erro');
      toast.show({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        backgroundColor: "red.500"
      })
    }
  }

  if (carregando) return null;

  return (
    <VStack flex={1} alignItems="center" justifyContent="center" p={5}>
      <Image source={Logo} alt="Logo Voll" />

      <Titulo>
        Faça login em sua conta
      </Titulo>
      <Box>
        <EntradaTexto
          label="Email"
          placeholder="Insira seu endereço de e-mail"
          value={email}
          onChangeText={setEmail}
        />
        <EntradaTexto
          label="Senha"
          placeholder="Insira sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
      </Box>
      <Botao onPress={login}>Entrar</Botao>

      <Link href='https://www.alura.com.br' mt={2}>
        Esqueceu sua senha?
      </Link>

      <Box w="100%" flexDirection="row" justifyContent="center" mt={8}>
        <Text>Ainda não tem cadastro? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text color="blue.500">
            Faça seu cadastro!
          </Text>
        </TouchableOpacity>
      </Box>
    </VStack>
  );
}