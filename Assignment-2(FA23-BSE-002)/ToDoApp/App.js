import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  StatusBar,
  SafeAreaView
} from 'react-native';
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, { id: Date.now().toString(), text: task }]);
    setTask('');
  };
  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />     
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>To Do App</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Type a task here..."
            placeholderTextColor="#888"
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskText}>{item.text}</Text>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Your list is empty.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', 
  }, 
  headerBar: {
    backgroundColor: '#FFFFFF',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2, 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  inputArea: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    color: '#000',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2196F3', 
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  deleteButtonText: {
    color: '#D32F2F', 
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 14,
  },
});