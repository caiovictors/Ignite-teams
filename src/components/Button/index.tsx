import { ActivityIndicator, TouchableOpacityProps } from "react-native";
import { ButtonTypeStyleProps, Container, Title } from "./styles";
import { Loading } from "@components/Loading";

type Props = TouchableOpacityProps & {
  title: string;
  type?: ButtonTypeStyleProps;
  disabled?: boolean;
  isLoading?: boolean;
};

export function Button({
  title,
  type = "PRIMARY",
  disabled = false,
  isLoading = false,
  ...rest
}: Props) {
  return (
    <Container type={type} disabled={disabled} {...rest}>
      {isLoading ? <ActivityIndicator /> : <Title>{title}</Title>}
    </Container>
  );
}
