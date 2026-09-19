import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { items } from '../data/items'

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetail'>

export default function ItemDetailScreen({ route, navigation }: Props) {
  const { id } = route.params
  const item = items.find((item) => item.id === id)

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Item not found</Text>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Text style={styles.link}>Back to Home</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.body}>{item.description}</Text>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text style={styles.link}>Back to Home</Text>
      </Pressable>
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
    marginBottom: 16,
  },
  link: {
    fontSize: 15,
    color: '#0066cc',
  },
})
