import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { listarLocalizacoes } from "../utils/storage";

export default function Mapa() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const mapRef = useRef(null); // 👈 referência pro mapa

  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState(null);
  const [localizacoes, setLocalizacoes] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const animacao = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  async function carregarLocalizacoes() {
    const lista = await listarLocalizacoes();
    setLocalizacoes(lista || []);
  }

  useFocusEffect(
    useCallback(() => {
      carregarLocalizacoes();
    }, [])
  );

  async function localizarUsuario() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const local = await Location.getCurrentPositionAsync({});
    const novaRegiao = {
      latitude: local.coords.latitude,
      longitude: local.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(novaRegiao);
    mapRef.current?.animateToRegion(novaRegiao, 1000);
  }

  // ✅ Centraliza quando vier da lista
  useEffect(() => {
    if (params.latitude && params.longitude) {
      const lat = parseFloat(params.latitude);
      const lon = parseFloat(params.longitude);
      const novaRegiao = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(novaRegiao);
      setMarker({ latitude: lat, longitude: lon });
      // anima até o ponto
      mapRef.current?.animateToRegion(novaRegiao, 1000);
    }
  }, [params.latitude, params.longitude]);

  function alternarMenu() {
    const toValue = menuAberto ? 0 : 1;
    setMenuAberto(!menuAberto);
    Animated.spring(animacao, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }

  const estiloBotao1 = {
    transform: [
      { scale: animacao },
      { translateY: animacao.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) },
    ],
    opacity: animacao,
  };
  const estiloBotao2 = {
    transform: [
      { scale: animacao },
      { translateY: animacao.interpolate({ inputRange: [0, 1], outputRange: [0, -160] }) },
    ],
    opacity: animacao,
  };
  const estiloBotao3 = {
    transform: [
      { scale: animacao },
      { translateY: animacao.interpolate({ inputRange: [0, 1], outputRange: [0, -240] }) },
    ],
    opacity: animacao,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={(e) => setMarker(e.nativeEvent.coordinate)}
      >
        {marker && <Marker coordinate={marker} pinColor="blue" />}
        {localizacoes.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.nome}
            pinColor={loc.cor || "red"}
          />
        ))}
      </MapView>

      {/* Menu flutuante */}
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.fabOption, estiloBotao1]}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => {
              alternarMenu();
              router.push("/adicionar");
            }}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.fabOption, estiloBotao2]}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#2196F3" }]}
            onPress={() => {
              alternarMenu();
              router.push("/lista");
            }}
          >
            <Ionicons name="list" size={25} color="#fff" />
            {localizacoes.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{localizacoes.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.fabOption, estiloBotao3]}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#FF9800" }]}
            onPress={localizarUsuario}
          >
            <Ionicons name="locate" size={26} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.fabButton, styles.fabMain]}
          onPress={alternarMenu}
        >
          <Ionicons name={menuAberto ? "close" : "menu"} size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },
  fabOption: { position: "absolute" },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 6,
  },
  fabMain: {
    backgroundColor: "#E53935",
    width: 70,
    height: 70,
    borderRadius: 35,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2196F3",
  },
});
