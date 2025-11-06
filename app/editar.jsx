import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { editarLocalizacao, listarLocalizacoes } from "../utils/storage";

export default function Editar() {
  const { index } = useLocalSearchParams();
  const [local, setLocal] = useState(null);
  const router = useRouter();

  useEffect(() => {
    listarLocalizacoes().then((lista) => setLocal(lista[index]));
  }, []);

  async function salvarEdicao() {
    await editarLocalizacao(index, local);
    Alert.alert("Localização atualizada!");
    router.back();
  }

  if (!local) return <Text>Carregando...</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Editar Localização</Text>
      <TextInput value={local.nome} onChangeText={(t) => setLocal({ ...local, nome: t })} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput value={local.latitude.toString()} onChangeText={(t) => setLocal({ ...local, latitude: parseFloat(t) })} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput value={local.longitude.toString()} onChangeText={(t) => setLocal({ ...local, longitude: parseFloat(t) })} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 20, padding: 8 }} />

      <Button title="Salvar Alterações" onPress={salvarEdicao} />
    </View>
  );
}
