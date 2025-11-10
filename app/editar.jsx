import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { editarLocalizacao, listarLocalizacoes } from "../utils/storage";

export default function Editar() {
  const { index } = useLocalSearchParams();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pickerVisivel, setPickerVisivel] = useState(false);
  const router = useRouter();

  const cores = [
    "#FF0000", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0",
    "#E91E63", "#009688", "#795548", "#607D8B", "#000000",
  ];

  useEffect(() => {
    listarLocalizacoes().then((lista) => {
      setLocal(lista[index]);
      setLoading(false);
    });
  }, []);

  async function salvarEdicao() {
    try {
      setSalvando(true);
      await editarLocalizacao(index, local);
      Alert.alert("✅ Localização atualizada com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao salvar as alterações");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  if (!local) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nenhuma localização encontrada.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 25,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          ✏️ Editar Localização
        </Text>

        <TextInput
          placeholder="Nome"
          value={local.nome}
          onChangeText={(t) => setLocal({ ...local, nome: t })}
          style={styles.input}
        />

        <TextInput
          placeholder="Latitude"
          value={local.latitude.toString()}
          onChangeText={(t) => setLocal({ ...local, latitude: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Longitude"
          value={local.longitude.toString()}
          onChangeText={(t) => setLocal({ ...local, longitude: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* 🎨 seletor de cor */}
        <Text style={{ fontWeight: "600", marginBottom: 10 }}>Cor do marcador:</Text>

        <TouchableOpacity
          style={[styles.colorPreview, { backgroundColor: local.cor }]}
          onPress={() => setPickerVisivel(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>🎨 Escolher cor</Text>
        </TouchableOpacity>

        {/* Modal do seletor */}
        <Modal visible={pickerVisivel} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                Escolha uma cor
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {cores.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setLocal({ ...local, cor: c })}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: c,
                        borderWidth: local.cor === c ? 3 : 1,
                        borderColor: local.cor === c ? "#000" : "#ccc",
                      },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setPickerVisivel(false)}
                style={[styles.button, { backgroundColor: "#2196F3" }]}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={salvarEdicao}
          style={[styles.button, { backgroundColor: "#4CAF50", marginTop: 10 }]}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  colorPreview: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
};
