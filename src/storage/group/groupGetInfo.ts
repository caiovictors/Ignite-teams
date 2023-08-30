import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";
import { GroupDTO } from "./groupStorageDTO";

export async function groupGetInfo(groupName: string) {
  try {
    const storedGroups = await groupsGetAll();

    const filteredGroup = storedGroups.filter(
      (group) => group.name === groupName
    );

    if (!filteredGroup) throw new AppError("Não existe grupo com esse nome");

    return filteredGroup[0];
  } catch (error) {
    throw error;
  }
}
