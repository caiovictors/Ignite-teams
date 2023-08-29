import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function playerRemoveByGroup(playerName: string, group: string) {
  try {
    const storedPlayers = await playersGetByGroup(group);

    const filteredPlayers = storedPlayers.filter(
      (player) => player.name !== playerName
    );

    const players = JSON.stringify(filteredPlayers);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players);
  } catch (error) {
    throw error;
  }
}
