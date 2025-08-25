import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { ControllerResponse, ConversationWithRelations } from "@/types";
import { FontFamilies } from "@/utils/fonts";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function ChatsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<
    ConversationWithRelations[]
  >([]);
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filters = ["Todos", "Privados", "Grupos"];

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      setError(null);

      const { data: response } = await api.get<
        ControllerResponse<ConversationWithRelations[]>
      >("/conversation?includeLastMessage=1");

      if (response.isSuccess) {
        setConversations(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (e) {
      console.error(e);
      setError("Error fetching conversations");
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    switch (activeFilter) {
      case "Grupos":
        return matchesSearch && conv.type === "GROUP";
      case "Privados":
        return matchesSearch && conv.type === "PRIVATE";
      default:
        return matchesSearch;
    }
  });

  const renderConversationItem = ({
    item,
  }: {
    item: ConversationWithRelations;
  }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/conversation/${item.conversationId}` as any)}
    >
      <View style={styles.conversationAvatar}>
        <IconSymbol
          name={item.type === "GROUP" ? "person.3.fill" : "person.fill"}
          size={24}
          color="white"
        />
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.updatedAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })}
          </Text>
        </View>
        <Text style={styles.lastMessage}>
          {item.type === "GROUP"
            ? `${item._count?.Users || 0} miembros`
            : item.Messages && item.Messages.length > 0
            ? item.Messages[0].content
            : "Sin mensajes"}
        </Text>
        <Text style={styles.conversationType}>
          {item.type === "GROUP" ? "Grupo" : "Chat privado"}
        </Text>
      </View>
      {item.Messages &&
        item.Messages.length > 0 &&
        item.Messages[0].senderId !== user?.userId && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}></Text>
          </View>
        )}
    </TouchableOpacity>
  );

  const renderFilterPill = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterPill,
        activeFilter === filter && styles.filterPillActive,
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === filter && styles.filterTextActive,
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001B13" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#01D694" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversaciones"
          placeholderTextColor="#01D694"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Pills */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={({ item }) => renderFilterPill(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Conversations List */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#01D694" />
            <Text style={styles.loadingText}>Cargando conversaciones...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchConversations}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : filteredConversations.length > 0 ? (
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.conversationId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.conversationsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <IconSymbol name="message.fill" size={60} color="#001B13" />
            </View>
            <Text style={styles.emptyText}>
              {activeFilter !== "Todos"
                ? "No se encontraron conversaciones"
                : "No tienes conversaciones"}
            </Text>
            <Text style={styles.emptyDescText}>
              {activeFilter !== "Todos"
                ? "Intenta con una búsqueda diferente o cambia el filtro"
                : "Cuando alguien te escriba o te agreguen a un grupo, aparecerán aquí"}
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
    ...(Platform.OS === "web" && {
      outlineStyle: "none" as any,
    }),
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterPill: {
    backgroundColor: "#07553D",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterPillActive: {
    backgroundColor: "#FDB924",
  },
  filterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: FontFamilies.primary,
  },
  filterTextActive: {
    color: "#001B13",
  },
  content: {
    flex: 1,
  },
  // Loading and error states
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
  // Conversations list
  conversationsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07553D",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(1, 214, 148, 0.2)",
    width: "100%",
  },
  conversationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#01D694",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    fontFamily: FontFamilies.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: FontFamilies.primary,
  },
  lastMessage: {
    fontSize: 14,
    color: "#01D694",
    fontFamily: FontFamilies.primary,
  },
  conversationType: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: FontFamilies.primary,
    fontStyle: "italic",
  },
  unreadBadge: {
    backgroundColor: "#FDB924",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  unreadCount: {
    color: "#001B13",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: FontFamilies.primary,
  },
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
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
    textAlign: "center",
  },
  emptyDescText: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
    fontFamily: FontFamilies.primary,
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 20,
  },
});
