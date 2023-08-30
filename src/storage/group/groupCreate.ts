import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";
import { DEFAULT_SCORE } from "./groupStorageDTO";

export async function groupCreate(newGroupName: string) {
  try {
    const storedGroups = await groupsGetAll();
    const groupAlreadyExists = storedGroups?.find(
      (group) => group.name === newGroupName
    );

    if (groupAlreadyExists)
      throw new AppError("Já existe um grupo cadastrado com esse nome");

    const newGroup = {
      name: newGroupName,
      score: DEFAULT_SCORE,
    };

    const storage = JSON.stringify([...storedGroups, newGroup]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}
