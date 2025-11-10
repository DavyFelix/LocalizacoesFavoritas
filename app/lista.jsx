import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { listarLocalizacoes, removerLocalizacao } from "../utils/storage";

export default function Lista() {
  const [locais, setLocais] = useState([]);
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      listarLocalizacoes().then(setLocais);
    }, [])
  );

  async function excluirLocalizacao(index) {
    Alert.alert(
      "Excluir Localização",
      "Tem certeza que deseja excluir esta localização?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await removerLocalizacao(index);
            const atualizada = await listarLocalizacoes();
            setLocais(atualizada);
          },
        },
      ]
    );
  }

  function irParaMapa(local) {
    // 👇 Envia as coordenadas como parâmetros para a tela do mapa
    router.push({
      pathname: "/",
      params: {
        latitude: local.latitude,
        longitude: local.longitude,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Localizações Favoritas</Text>

      {locais.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma localização salva ainda.</Text>
      ) : (
        <FlatList
          data={locais}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => irParaMapa(item)} // 👉 ao tocar, vai para o mapa
            >
              <View style={styles.cardInfo}>
                <Ionicons
                  name="location-sharp"
                  size={22}
                  color={item.cor || "#E53935"}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardCoords}>
                    ({item.latitude.toFixed(5)}, {item.longitude.toFixed(5)})
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <Link href={`/editar?index=${index}`} asChild>
                  <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </Link>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirLocalizacao(index)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <Link href="/" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Voltar ao Mapa</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: Platform.OS === "android" ? 40 : 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardCoords: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C757D",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 15,
    marginBottom: Platform.OS === "android" ? 15 : 5,
    elevation: 3,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
