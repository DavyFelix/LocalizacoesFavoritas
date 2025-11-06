import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Mapa" }} />
      <Stack.Screen name="adicionar" options={{ title: "Nova Localização" }} />
      <Stack.Screen name="lista" options={{ title: "Localizações Favoritas" }} />
      <Stack.Screen name="editar" options={{ title: "Editar Localização" }} />
    </Stack>
  );
}
