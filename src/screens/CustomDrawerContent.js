// src/components/CustomDrawerContent.js
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CustomDrawerContent = props => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/SideBarBg.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>John Doe</Text>
      </View>

      <View style={styles.menuItems}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TestOne')}>
          <Text style={styles.menuItemText}>Test One</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TestTwo')}>
          <Text style={styles.menuItemText}>Test Two</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TestThree')}>
          <Text style={styles.menuItemText}>Test Three</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => alert('Logout')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
