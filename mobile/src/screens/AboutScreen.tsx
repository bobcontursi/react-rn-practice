import { StyleSheet, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<RootStackParamList, 'About'>

export default function AboutScreen(_props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About this project</Text>
      <Text style={styles.body}>
        This app exists to build real, hands-on fluency with React, React Native, and a real
        CI/CD pipeline — see PRACTICE-PROJECT-SPEC.md at the repo root for the full milestone
        roadmap and rationale.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
  },
})
