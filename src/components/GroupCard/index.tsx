import { TouchableOpacityProps } from "react-native";
import { Container, GroupIcon, Score, Title } from "./styles";
import { DEFAULT_SCORE } from "@storage/group/groupStorageDTO";

type Props = TouchableOpacityProps & {
  title: string;
  score: Array<string>;
};

export function GroupCard({ title, score = DEFAULT_SCORE, ...rest }: Props) {
  return (
    <Container {...rest}>
      <GroupIcon />
      <Title>{title}</Title>
      <Score>
        {score[0]} x {score[1]}
      </Score>
    </Container>
  );
}
