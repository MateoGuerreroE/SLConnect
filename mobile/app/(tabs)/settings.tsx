import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { FontFamilies } from "@/utils/fonts";
import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout();
      return;
    }
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", style: "destructive", onPress: logout },
      ]
    );
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "Estudiante";
      case "TEACHER":
        return "Profesor";
      case "ADMIN":
        return "Administrador";
      default:
        return role;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001B13" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <IconSymbol name="ellipsis.circle" size={24} color="#01D694" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <IconSymbol name="person.fill" size={40} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{user?.emailAddress}</Text>
            <Text style={styles.profileRole}>
              {getRoleDisplayName(user?.role || "")}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Cuenta</Text>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <IconSymbol name="person.fill" size={20} color="#01D694" />
              </View>
              <Text style={styles.settingText}>Editar Perfil</Text>
              <IconSymbol name="chevron.right" size={16} color="#01D694" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <IconSymbol name="gear.circle.fill" size={20} color="#01D694" />
              </View>
              <Text style={styles.settingText}>Preferencias</Text>
              <IconSymbol name="chevron.right" size={16} color="#01D694" />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Soporte</Text>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <IconSymbol name="magnifyingglass" size={20} color="#01D694" />
              </View>
              <Text style={styles.settingText}>Ayuda</Text>
              <IconSymbol name="chevron.right" size={16} color="#01D694" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <IconSymbol name="message.fill" size={20} color="#01D694" />
              </View>
              <Text style={styles.settingText}>Contactar Soporte</Text>
              <IconSymbol name="chevron.right" size={16} color="#01D694" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001B13",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuButton: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    fontFamily: FontFamilies.primary,
    flex: 1,
    textAlign: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#07553D",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#01D694",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    fontFamily: FontFamilies.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#01D694",
    fontFamily: FontFamilies.primary,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: "#A0A0A0",
    fontFamily: FontFamilies.primary,
  },
  content: {
    paddingHorizontal: 16,
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#01D694",
    fontFamily: FontFamilies.primary,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#07553D",
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(1, 214, 148, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontFamily: FontFamilies.primary,
  },
  logoutButton: {
    backgroundColor: "#FDB924",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001B13",
    fontFamily: FontFamilies.primary,
  },
});
