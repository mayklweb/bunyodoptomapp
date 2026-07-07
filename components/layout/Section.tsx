import { View } from 'react-native';
import Container from './Container';

export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <View style={{marginTop: 24}}>
      <Container>{children}</Container>
    </View>
  );
}
