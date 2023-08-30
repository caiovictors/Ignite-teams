import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";

export async function groupScoreSaveByGroupName(
  groupName: string,
  score: Array<string>
) {
  try {
    const storedGroups = await groupsGetAll();

    const filteredGroups = storedGroups.filter(
      (group) => group.name !== groupName
    );

    const updatedGroup = {
      name: groupName,
      score,
    };

    const storage = JSON.stringify([...filteredGroups, updatedGroup]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}
