import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { user, token } = await AuthService.login(email, password);

      console.log(user, token);
      // Navigate to main app
      router.replace("/(tabs)"); // or wherever your main app is
    } catch (error) {
      Alert.alert("Login Failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/slu-logo.png")} // Your custom asset
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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
    fontFamily: "SFPro",
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
    fontFamily: "SFPro",
    fontSize: 18,
    fontWeight: "bold",
  },
});
