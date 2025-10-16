import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AddWatchlistModal from "@/components/AddWatchlistModal";
import { useWatchlistStore } from "@/store/watchlistStore";

type Stock = {
  symbol: string;
  name: string;
};

interface WatchList {
  id: string;
  name: string;
  stocks: Stock[];
}

const WatchList = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { watchlists, addWatchlist, removeWatchlist } = useWatchlistStore();

  const router = useRouter();

  const filteredWatchlists = watchlists.filter((watchlist) =>
    (watchlist.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedItems([]);
  };

  const handleItemSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = () => {
    selectedItems.forEach((id) => {
      if (removeWatchlist) {
        removeWatchlist(id);
      }
    });
    setSelectedItems([]);
    setIsDeleteMode(false);
  };

  const handleAddWatchlist = (name: string) => {
    if (addWatchlist) {
      addWatchlist(name);
    }
  };

  const WatchListCard = ({ id, name }: { id: string; name: string }) => {
    const isSelected = selectedItems.includes(id);

    return (
      <TouchableOpacity
        style={[
          styles.stockCard,
          {
            backgroundColor: theme.cardBackground
          },
        ]}
        onPress={() => {
          if (isDeleteMode) {
            handleItemSelect(id);
          } else {
            router.push(`/watchlist/${id}`);
          }
        }}
      >
        {isDeleteMode && (
          <View style={styles.checkbox}>
            <View
              style={[
                styles.checkboxInner,
                {
                  backgroundColor: isSelected ? "#22c55e" : "transparent",
                  borderColor: isSelected ? "#22c55e" : theme.secondary,
                },
              ]}
            >
              {isSelected && <Feather name="check" size={16} color="white" />}
            </View>
          </View>
        )}

        <View style={[styles.stockInfo, { marginLeft: isDeleteMode ? 12 : 0 }]}>
          <View style={styles.stockHeader}>
            <Text style={[styles.stockSymbol, { color: theme.text }]}>
              {name || "Unnamed Watchlist"}
            </Text>
          </View>
        </View>

        <View style={styles.priceInfo}>
          {!isDeleteMode && (
            <AntDesign name="arrowright" size={24} color={theme.secondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Watchlist</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleDeleteToggle}>
            <Feather
              name={isDeleteMode ? "x" : "trash-2"}
              size={24}
              color={isDeleteMode ? "#ef4444" : theme.text}
            />
          </TouchableOpacity>
          {!isDeleteMode && (
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Feather name="plus" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>


      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <Feather name="search" size={20} color={theme.secondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search watch list..."
          placeholderTextColor={theme.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>


      <ScrollView style={styles.stockList} showsVerticalScrollIndicator={false}>
        {filteredWatchlists.map((item, index) => (
          <WatchListCard key={item.id} id={item.id} name={item.name} />
        ))}

        {filteredWatchlists.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.secondary }]}>
              No watchlists found
            </Text>
          </View>
        )}
      </ScrollView>


      {isDeleteMode && selectedItems.length > 0 && (
        <View
          style={[
            styles.deleteButtonContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color="white" />
            <Text style={styles.deleteButtonText}>
              Delete {selectedItems.length} item
              {selectedItems.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <AddWatchlistModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddWatchlist}
        theme={theme}
      />
    </View>
  );
};

export default WatchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  stockList: {
    flex: 1,
    paddingBottom: 20,
  },
  stockCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stockInfo: {
    flex: 1,
  },
  stockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stockName: {
    fontSize: 14,
    opacity: 0.7,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  deleteButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
