import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { salvarLocalizacao } from "../utils/storage";

export default function Adicionar() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  async function salvar() {
    if (!nome || !latitude || !longitude) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    await salvarLocalizacao({
      nome,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    Alert.alert("Salvo com sucesso!");
    router.back();
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Adicionar Localização</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 20, padding: 8 }} />

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}
