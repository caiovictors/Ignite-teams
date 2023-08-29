import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function groupRemoveByName(groupToRemove: string) {
  try {
    const storedGroups = await groupsGetAll();
    const groups = storedGroups.filter((group) => group !== groupToRemove);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
    await AsyncStorage.removeItem(`${GROUP_COLLECTION}-${groupToRemove}`);
  } catch (error) {
    throw error;
  }
}
