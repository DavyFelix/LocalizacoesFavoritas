import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "LOCALIZACOES_FAVORITAS";

export async function salvarLocalizacao(localizacao) {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    const lista = dados ? JSON.parse(dados) : [];
    lista.push(localizacao);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (error) {
    console.error("Erro ao salvar localização:", error);
  }
}

export async function listarLocalizacoes() {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error("Erro ao carregar localizações:", error);
    return [];
  }
}

export async function editarLocalizacao(index, novaLoc) {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    const lista = dados ? JSON.parse(dados) : [];
    lista[index] = novaLoc;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (error) {
    console.error("Erro ao editar localização:", error);
  }
}

export async function removerLocalizacao(index) {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    const lista = dados ? JSON.parse(dados) : [];
    lista.splice(index, 1);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (error) {
    console.error("Erro ao remover localização:", error);
  }
}
