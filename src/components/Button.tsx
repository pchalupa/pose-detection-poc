import { Pressable, Text } from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export const Button = ({ text, onPress: handlePress }: ButtonProps) => {
  return (
    <Pressable onPress={handlePress}>
      <Text>{text}</Text>
    </Pressable>
  );
};
