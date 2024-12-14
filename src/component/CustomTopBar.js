import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

const CustomTopBar = ({ navigation, title, onSearchPress, onRefreshPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightButtons}>
        <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onRefreshPress} style={styles.iconButton}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6200ea',
    justifyContent: 'space-between',
  },
  menuButton: {
    marginRight: 15,
  },
  title: {
    color: 'white',
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
};

export default CustomTopBar;
