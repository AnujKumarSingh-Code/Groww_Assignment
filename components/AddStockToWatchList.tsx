import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import { useWatchlistStore } from "@/store/watchlistStore";

interface AddStockToWatchListProps {
  theme: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  stock: {
    symbol: string;
    name: string;
    low: string;
    high: string;
  };
}

const AddStockToWatchList = ({
  theme,
  isModalVisible,
  setIsModalVisible,
  stock,
}: AddStockToWatchListProps) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");

  const { watchlists, addWatchlist, addStockToWatchlist } = useWatchlistStore();

  const handleWatchlistSelect = (watchlistId: string) => {
    const selectedWatchlist = watchlists.find((w) => w.id === watchlistId);
    if (!selectedWatchlist) return;
    addStockToWatchlist(selectedWatchlist.id, stock);
    Alert.alert("Success", `Added ${stock.name} to ${selectedWatchlist?.name}`);
    setIsModalVisible(false);
  };

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      addWatchlist(newWatchlistName);
      setNewWatchlistName("");
      setIsCreatingNew(false);
      Alert.alert(
        "Success",
        `Created watchlist "${newWatchlistName}"`
      );
      setIsModalVisible(false);
    }
  };
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Add to Watchlist
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <AntDesign name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.watchlistContainer}>
            {!isCreatingNew ? (
              <>
                {watchlists.map((watchlist) => (
                  <TouchableOpacity
                    key={watchlist.id}
                    style={[
                      styles.watchlistItem,
                      { borderBottomColor: theme.secondary + "30" },
                    ]}
                    onPress={() => handleWatchlistSelect(watchlist.id)}
                  >
                    <Text style={[styles.watchlistName, { color: theme.text }]}>
                      {watchlist.name}
                    </Text>
                    <AntDesign name="right" size={16} color={theme.secondary} />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    styles.createNewButton,
                    { borderColor: theme.primary },
                  ]}
                  onPress={() => setIsCreatingNew(true)}
                >
                  <AntDesign name="plus" size={20} color={theme.primary} />
                  <Text
                    style={[styles.createNewText, { color: theme.primary }]}
                  >
                    Create New Watchlist
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.createWatchlistForm}>
                <Text style={[styles.formLabel, { color: theme.text }]}>
                  Watchlist Name
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.secondary + "50",
                      color: theme.text,
                    },
                  ]}
                  value={newWatchlistName}
                  onChangeText={setNewWatchlistName}
                  placeholder="Enter watchlist name"
                  placeholderTextColor={theme.secondary}
                  autoFocus
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      { borderColor: theme.secondary },
                    ]}
                    onPress={() => {
                      setIsCreatingNew(false);
                      setNewWatchlistName("");
                    }}
                  >
                    <Text
                      style={[
                        styles.cancelButtonText,
                        { color: theme.secondary },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={handleCreateWatchlist}
                  >
                    <Text style={styles.createButtonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddStockToWatchList;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  watchlistContainer: {
    marginBottom: 20,
  },
  watchlistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  watchlistName: {
    fontSize: 16,
    flex: 1,
  },
  createNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 16,
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: "dashed",
  },
  createNewText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  createWatchlistForm: {
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
