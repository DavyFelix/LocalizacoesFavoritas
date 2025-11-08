import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { ColorPicker } from "react-native-color-picker";
import { salvarLocalizacao } from "../utils/storage";

export default function Adicionar() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cor, setCor] = useState("#FF0000");
  const [loading, setLoading] = useState(false);
  const [pickerVisivel, setPickerVisivel] = useState(false);

  async function usarLocalizacaoAtual() {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Ative a localização para continuar.");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const [endereco] = await Location.reverseGeocodeAsync(pos.coords);

      setLatitude(pos.coords.latitude.toString());
      setLongitude(pos.coords.longitude.toString());
      setNome(endereco?.street || endereco?.name || "Local sem nome");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!nome || !latitude || !longitude) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    await salvarLocalizacao({
      nome,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      cor,
    });

    Alert.alert("✅ Localização salva com sucesso!");
    router.back();
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
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center" }}>
          🗺️ Adicionar Localização
        </Text>

        <TextInput
          placeholder="Nome do local"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <TextInput
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* 🎨 Seletor de cor */}
        <Text style={{ fontWeight: "600", marginBottom: 10 }}>Cor do marcador:</Text>

        <TouchableOpacity
          style={[styles.colorPreview, { backgroundColor: cor }]}
          onPress={() => setPickerVisivel(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>🎨 Escolher cor</Text>
        </TouchableOpacity>

        <Modal visible={pickerVisivel} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: "600", marginBottom: 10 }}>Selecione a cor:</Text>
              <ColorPicker
                onColorSelected={(color) => {
                  setCor(color);
                  setPickerVisivel(false);
                }}
                style={{ flex: 1 }}
                defaultColor={cor}
              />
              <TouchableOpacity
                onPress={() => setPickerVisivel(false)}
                style={[styles.button, { backgroundColor: "#E53935", marginTop: 10 }]}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={usarLocalizacaoAtual}
          style={[styles.button, { backgroundColor: "#2196F3" }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📍 Usar minha localização</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={salvar}
          style={[styles.button, { backgroundColor: "#4CAF50", marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>💾 Salvar Localização</Text>
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    height: 400,
  },
};
