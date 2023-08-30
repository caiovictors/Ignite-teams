import { useState, useEffect, useRef } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  Container,
  Form,
  HeaderList,
  Text,
  ScoreContainer,
  Title,
} from "./styles";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { X } from "phosphor-react-native";
import { useTheme } from "styled-components/native";
import { groupGetInfo } from "@storage/group/groupGetInfo";
import { DEFAULT_SCORE } from "@storage/group/groupStorageDTO";
import { groupScoreSaveByGroupName } from "@storage/group/groupScoreSaveByGroupName";
import { removeLeadingZeroes } from "@utils/Functions";

type RouteParams = {
  group: string;
};

export function Players() {
  const route = useRoute();
  const { group } = route.params as RouteParams;
  const navigation = useNavigation();

  const theme = useTheme();

  const scoreInputStyle = {
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.GREEN_500,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [score, setScore] = useState(DEFAULT_SCORE);
  const [newPlayerName, setNewPlayerName] = useState("");

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (!newPlayerName.trim().length)
      return Alert.alert(
        "Nova pessoa",
        "Informe o nome da pessoa para adicionar"
      );

    const newPlayer = {
      name: newPlayerName,
      team,
    };

    try {
      await playerAddByGroup(newPlayer, group);

      setNewPlayerName("");
      newPlayerNameInputRef?.current?.blur();

      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError)
        return Alert.alert("Nova pessoa", error.message);
      return Alert.alert("Nova pessoa", "Não foi possível adicionar a pessoa");
    }
  }

  async function fetchScoreByTeam() {
    try {
      setIsLoading(true);

      const scoreByTeam = await groupGetInfo(group);
      setScore(scoreByTeam.score);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Pessoas",
        "Não foi possível carregar as informações do placar"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);

      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert("Turmas", "Não foi possível carregar os integrantes do time");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSetScore(value: string, position: number) {
    const newScore = [...score];
    newScore[position] = value;
    setScore(newScore);
  }

  function handleFormatScores() {
    const scores = [...score];

    scores.map((score, index) => {
      scores[index] = removeLeadingZeroes(score);
    });

    if (!scores[0].trim()) scores[0] = "0";
    if (!scores[1].trim()) scores[1] = "0";

    return scores;
  }

  async function handleSaveScore() {
    try {
      setIsLoading(true);
      const scores = handleFormatScores();

      await groupScoreSaveByGroupName(group, scores);

      setScore(scores);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Alterar placar", "Não foi possível atualizar o placar");
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert("Remover pessoa", "Não foi possível remover essa pessoa");
    }
  }

  function handleRemoveGroup() {
    Alert.alert("Remover", "Deseja remover a turma?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: removeGroup },
    ]);
  }

  async function removeGroup() {
    try {
      await groupRemoveByName(group);
      navigation.navigate("groups");
    } catch (error) {
      console.log(error);
      Alert.alert("Remover grupo", "Não foi possível remover o grupo");
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  useEffect(() => {
    fetchScoreByTeam();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header showBackButton />
        <Highlight
          title={group}
          subtitle="Adicione a galera e separe os times"
        />

        <Form>
          <Input
            inputRef={newPlayerNameInputRef}
            autoCorrect={false}
            value={newPlayerName}
            placeholder="Nome da pessoa"
            onChangeText={setNewPlayerName}
            onSubmitEditing={handleAddPlayer}
            returnKeyType="done"
          />
          <ButtonIcon
            icon="add"
            onPress={handleAddPlayer}
            disabled={isLoading}
          />
        </Form>

        <HeaderList>
          <FlatList
            data={["Time A", "Time B"]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Filter
                title={item}
                isActive={item === team}
                onPress={() => setTeam(item)}
              />
            )}
            horizontal
          />

          <Text>{players.length}</Text>
        </HeaderList>

        {isLoading ? (
          <Loading />
        ) : (
          <View onStartShouldSetResponder={() => true} style={{ flex: 1 }}>
            <FlatList
              data={players}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <PlayerCard
                  name={item.name}
                  onRemove={() => handleRemovePlayer(item.name)}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[!players.length && { flex: 1 }]}
              ListEmptyComponent={() => (
                <ListEmpty message="Ainda não há pessoas nesse time." />
              )}
            />
          </View>
        )}
        <Title>Placar</Title>
        <ScoreContainer>
          <Text>TIME A</Text>
          <Input
            value={score[0]}
            inputMode="numeric"
            onChangeText={(text) => handleSetScore(text, 0)}
            textAlign="center"
            onBlur={handleSaveScore}
            style={scoreInputStyle}
          />
          <X size={24} color={theme.COLORS.GREEN_500} />
          <Input
            value={score[1]}
            inputMode="numeric"
            onChangeText={(text) => handleSetScore(text, 1)}
            textAlign="center"
            onBlur={handleSaveScore}
            style={scoreInputStyle}
          />
          <Text>TIME B</Text>
        </ScoreContainer>
        <Button
          title="Remover turma"
          type="SECONDARY"
          style={{ marginTop: 16 }}
          onPress={handleRemoveGroup}
        />
      </Container>
    </TouchableWithoutFeedback>
  );
}
