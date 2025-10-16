import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface AddWatchlistModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
  theme?: any;
}

const AddWatchlistModal: React.FC<AddWatchlistModalProps> = ({
  visible,
  onClose,
  onAdd,
  theme,
}) => {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={modalStyles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={modalStyles.container}
        >
          <View
            style={[modalStyles.modal, { backgroundColor: theme.background }]}
          >

            <View style={modalStyles.header}>
              <Text style={[modalStyles.title, { color: theme.text }]}>
                Create New Watchlist
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={modalStyles.closeButton}
              >
                <Feather name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>


            <View style={modalStyles.inputSection}>
              <Text style={[modalStyles.label, { color: theme.text }]}>
                Watchlist Name
              </Text>
              <TextInput
                style={[
                  modalStyles.input,
                  {
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    borderColor: theme.secondary,
                  },
                ]}
                placeholder="Enter watchlist name..."
                placeholderTextColor={theme.secondary}
                value={title}
                onChangeText={setTitle}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
            </View>


            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[
                  modalStyles.button,
                  modalStyles.cancelButton,
                  { borderColor: theme.secondary },
                ]}
                onPress={handleClose}
              >
                <Text
                  style={[modalStyles.cancelButtonText, { color: theme.text }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  modalStyles.button,
                  modalStyles.addButton,
                  { opacity: title.trim() ? 1 : 0.5 },
                ]}
                onPress={handleAdd}
                disabled={!title.trim()}
              >
                <Feather name="plus" size={20} color="white" />
                <Text style={modalStyles.addButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#22c55e",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddWatchlistModal;
