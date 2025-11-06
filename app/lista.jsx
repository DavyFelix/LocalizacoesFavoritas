import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { listarLocalizacoes } from "../utils/storage";

export default function Lista() {
  const [locais, setLocais] = useState([]);

  useEffect(() => {
    listarLocalizacoes().then(setLocais);
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Localizações Favoritas</Text>

      <FlatList
        data={locais}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>📍 {item.nome}</Text>
            <Text>
              ({item.latitude}, {item.longitude})
            </Text>

            <Link href={`/editar?index=${index}`} asChild>
              <Button title="Editar" />
            </Link>
          </View>
        )}
      />

      <Link href="/" asChild>
        <Button title="Voltar ao Mapa" />
      </Link>
    </View>
  );
}
