import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { listarLocalizacoes } from "../utils/storage";

export default function Lista() {
  const [locais, setLocais] = useState([]);

  // Atualiza a lista quando voltar da tela de edição ou adição
  useFocusEffect(
    useCallback(() => {
      listarLocalizacoes().then(setLocais);
    }, [])
  );

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
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Ionicons name="location-sharp" size={22} color={item.cor || "#E53935"} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardCoords}>
                    ({item.latitude.toFixed(5)}, {item.longitude.toFixed(5)})
                  </Text>
                </View>
              </View>

              <Link href={`/editar?index=${index}`} asChild>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* 🔹 Botão fixo no fim da tela */}
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
    paddingBottom: Platform.OS === "android" ? 40 : 20, // mais espaço no Android
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
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
