import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { ControllerResponse } from "@/types";
import { FontFamilies } from "@/utils/fonts";
import { MessageRecord } from "@slchatapp/shared";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MessageWithSender extends MessageRecord {
  Sender: {
    firstName: string;
    lastName: string;
  };
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [conversationTitle, setConversationTitle] = useState("");
  const [conversationSubtitle, setConversationSubtitle] = useState("");

  const flatListRef = useRef<FlatList<MessageWithSender>>(null);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await api.get<
        ControllerResponse<MessageWithSender[]>
      >(`/message/conversation/${id}`);

      if (response.isSuccess) {
        setMessages(response.data || []);
        // Scroll to bottom after loading messages
        setTimeout(() => scrollToBottom(), 100);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      Alert.alert("Error", "No se pudieron cargar los mensajes");
    } finally {
      setLoading(false);
    }
  }, [id, scrollToBottom]);

  useEffect(() => {
    if (id) {
      fetchMessages();
      // TODO: You can add conversation details fetch here
      setConversationTitle("Desarrollo de Aps Móviles");
      setConversationSubtitle("COM-437ES-AV01 • 23 estudiantes");
    }
  }, [id, fetchMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const { data: response } = await api.post<ControllerResponse<string>>(
        "/message/add",
        {
          conversationId: id,
          content: messageContent,
        }
      );

      if (response.isSuccess) {
        // Refresh messages to get the new one
        await fetchMessages();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "No se pudo enviar el mensaje");
      // Restore the message content if sending failed
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMyMessage = (senderId: string) => senderId === user?.userId;

  const renderMessage = ({ item }: { item: MessageWithSender }) => {
    const isMine = isMyMessage(item.senderId);

    return (
      <View
        style={[styles.messageContainer, isMine && styles.myMessageContainer]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myMessage : styles.otherMessage,
          ]}
        >
          {!isMine && (
            <Text style={styles.senderName}>
              {item.Sender.firstName} {item.Sender.lastName}
            </Text>
          )}
          <Text style={[styles.messageText, isMine && styles.myMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{conversationTitle}</Text>
            <Text style={styles.headerSubtitle}>{conversationSubtitle}</Text>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <IconSymbol name="ellipsis" size={24} color="#01D694" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#01D694" />
              <Text style={styles.loadingText}>Cargando mensajes...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.messageId}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={scrollToBottom}
            />
          )}
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#666666"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newMessage.trim() || sending) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <IconSymbol name="paperplane.fill" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  // Only use TouchableWithoutFeedback on mobile platforms for keyboard dismissal
  if (Platform.OS === "web") {
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
    backgroundColor: "#001B13",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#07553D",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    fontFamily: FontFamilies.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#01D694",
    fontFamily: FontFamilies.primary,
    marginTop: 2,
  },
  menuButton: {
    padding: 4,
    marginLeft: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#01D694",
    fontSize: 16,
    fontFamily: FontFamilies.primary,
    marginTop: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: "#FDB924",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: "#07553D",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#01D694",
    fontFamily: FontFamilies.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: "white",
    fontFamily: FontFamilies.primary,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#001B13",
  },
  messageTime: {
    fontSize: 11,
    color: "#A0A0A0",
    fontFamily: FontFamilies.primary,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myMessageTime: {
    color: "#001B13",
    opacity: 0.7,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#07553D",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#07553D",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontFamily: FontFamilies.primary,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#01D694",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
