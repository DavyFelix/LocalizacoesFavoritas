import * as Location from "expo-location";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Mapa() {
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState(null);

  async function localizarUsuario() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const local = await Location.getCurrentPositionAsync({});
    setRegion({
      ...region,
      latitude: local.coords.latitude,
      longitude: local.coords.longitude,
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={(e) => setMarker(e.nativeEvent.coordinate)}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <View style={styles.buttons}>
        <Button title="📍 Minha Localização" onPress={localizarUsuario} />
        <Link href="/adicionar" asChild>
          <Button title="➕ Adicionar Localização" />
        </Link>
        <Link href="/lista" asChild>
          <Button title="📋 Ver Favoritos" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
  buttons: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    gap: 10,
  },
});
