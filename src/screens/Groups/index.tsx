import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { GroupCard } from "@components/GroupCard";
import { FlatList } from "react-native";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { Container, HeadingContainer, Text } from "./styles";
import { groupsGetAll } from "@storage/group/groupsGetAll";
import { Loading } from "@components/Loading";
import { GroupDTO } from "@storage/group/groupStorageDTO";

export function Groups() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<GroupDTO[]>();

  function handleNewGroup() {
    navigation.navigate("new");
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);

      const groupsData = await groupsGetAll();
      setGroups(groupsData);
    } catch (error) {
      console.log(error);
      Alert.alert("Grupos", "Não foi possível carregar as turmas");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate("players", { group });
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="Jogue com a sua turma" />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <HeadingContainer>
            <Text>Turma</Text>
            <Text>Placar</Text>
          </HeadingContainer>

          <FlatList
            data={groups}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <GroupCard
                title={item.name}
                score={item.score}
                onPress={() => handleOpenGroup(item.name)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={!groups?.length && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty message="Que tal cadastrar a primeira turma?" />
            )}
          />
        </>
      )}
      <Button title="Criar nova turma" onPress={handleNewGroup} />
    </Container>
  );
}
