import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { FontFamilies } from "../utils/fonts";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      console.log("Login successful, redirecting...");
      // The navigation will be handled automatically by _layout.tsx
      // when the user state changes in AuthContext
    } catch (error) {
      console.log(error);
      Alert.alert("Login Failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/slu-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#666666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => router.push("/resetPassword")}
      >
        <Text style={styles.forgotPasswordText}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // Only use TouchableWithoutFeedback on mobile platforms
  if (Platform.OS === 'web') {
    return renderContent();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {renderContent()}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#001B13",
    paddingLeft: 40,
    paddingRight: 40,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 5,
  },
  forgotPasswordText: {
    color: "#FDB924",
    fontSize: 14,
    fontFamily: FontFamilies.primary,
    textAlign: "right",
  },
  logoContainer: {
    alignSelf: "center",
    justifyContent: "center",
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
  },
  input: {
    backgroundColor: "#D9D9D9",
    fontFamily: FontFamilies.primary,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FDB924",
    paddingVertical: 15,
    maxWidth: "60%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    fontFamily: FontFamilies.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
