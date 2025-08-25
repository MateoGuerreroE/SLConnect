import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { ControllerResponse } from "@/types";
import { FontFamilies } from "@/utils/fonts";
import { ConversationRecord } from "@slchatapp/shared";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function GroupsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const [groups, setGroups] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: response } = await api.get<
        ControllerResponse<ConversationRecord[]>
      >("/conversation?type=GROUP");
      if (response.isSuccess) {
        setGroups(response.data || []);
      } else {
        throw new Error(response.error);
      }
    } catch (e) {
      console.error(e);
      setError("Error fetching groups");
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGroupItem = ({ item }: { item: ConversationRecord }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => router.push(`/conversation/${item.conversationId}` as any)}
    >
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDescription}>
          Creada el {new Date(item.createdAt).toLocaleDateString("es-ES")}
        </Text>
        <Text style={styles.memberCount}>Miembros: {item._count?.Users}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001B13" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <IconSymbol name="ellipsis" size={24} color="#01D694" />
        </TouchableOpacity>
        <Text style={styles.title}>Grupos</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#01D694" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          placeholderTextColor="#01D694"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {user?.role !== "USER" && (
        <TouchableOpacity style={styles.newGroupButton}>
          <IconSymbol name="plus.circle.fill" size={20} color="white" />
          <Text style={styles.newGroupText}>Nuevo grupo</Text>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#01D694" />
            <Text style={styles.loadingText}>Cargando grupos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchGroups}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : filteredGroups.length > 0 ? (
          <FlatList
            data={filteredGroups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.conversationId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.groupsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <IconSymbol name="message.fill" size={60} color="#001B13" />
            </View>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No se encontraron grupos"
                : "No tienes grupos aun"}
            </Text>
            <Text style={styles.emptyDescText}>
              {searchQuery
                ? "Intenta con una búsqueda diferente"
                : user?.role === "USER"
                ? "Aun no has sido agregado a un grupo. Comunicate con el instructor de tu materia para que puedas ser añadido"
                : "Puedes crear un grupo presionando el botón de arriba."}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001B13",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 8,
  },
  menuButton: {
    padding: 5,
    height: 34,
    width: 34,
    borderRadius: 18,
    backgroundColor: "#07553D",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    fontFamily: FontFamilies.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontFamily: FontFamilies.primary,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#01D694",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontFamily: FontFamilies.primary,
    fontWeight: "500",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    fontFamily: FontFamilies.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07553D",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontFamily: FontFamilies.primary,
  },
  newGroupButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07553D",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  newGroupText: {
    fontSize: 16,
    fontWeight: "400",
    color: "white",
    fontFamily: FontFamilies.primary,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    gap: 20,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    fontFamily: FontFamilies.primary,
    fontWeight: "500",
  },
  emptyDescText: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
    fontFamily: FontFamilies.primary,
    textAlign: "center",
    maxWidth: 250,
  },
  groupsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  groupItem: {
    backgroundColor: "#07553D",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(1, 214, 148, 0.2)",
    width: "100%",
  },
  groupInfo: {
    gap: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    fontFamily: FontFamilies.primary,
  },
  groupDescription: {
    fontSize: 14,
    color: "#01D694",
    fontFamily: FontFamilies.primary,
  },
  memberCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: FontFamilies.primary,
  },
});
