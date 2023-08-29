import { useState } from "react";
import { Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

import { Container, Content, Icon } from "./styles";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";

export function NewGroup() {
  const navigation = useNavigation();
  const [group, setGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleNew() {
    try {
      if (!group.trim().length)
        return Alert.alert("Nova turma", "Informe o nome da turma.");

      setIsLoading(true);
      await groupCreate(group);

      navigation.navigate("players", { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova turma", error.message);
        return;
      }

      Alert.alert("Nova turma", "Não foi possível criar a turma.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header showBackButton />
      <Content>
        <Icon />
        <Highlight
          title="Nova turma"
          subtitle="Crie uma turma para adicionar as pessoas"
        />
        <Input
          placeholder="Nome da turma"
          onChangeText={setGroup}
          onSubmitEditing={handleNew}
        />
        <Button
          title="Criar turma"
          style={{ marginTop: 20 }}
          onPress={handleNew}
          disabled={isLoading || !group.trim().length}
          isLoading={isLoading}
        />
      </Content>
    </Container>
  );
}
