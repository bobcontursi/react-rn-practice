import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { items } from '../data/items'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React / React Native Practice Build</Text>
      <Text style={styles.body}>
        A small, spec-driven practice project for hands-on React, React Native, and CI/CD
        skill-building.
      </Text>

      <Text style={styles.heading}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
          >
            <Text style={styles.rowText}>{item.name}</Text>
          </Pressable>
        )}
      />

      <Pressable onPress={() => navigation.navigate('About')}>
        <Text style={styles.link}>About this project</Text>
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
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8884',
  },
  rowText: {
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    fontSize: 15,
    color: '#0066cc',
  },
})
