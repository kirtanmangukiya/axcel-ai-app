// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation, useFocusEffect} from '@react-navigation/native';
// import axios from 'axios';
// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Modal,
//   Button,
//   Image,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';

// const DrawerContent = props => {
//   const [bots, setBots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAll, setShowAll] = useState(false);
//   const [isToken, setisToken] = useState('');
//   const navigation = useNavigation();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBotData, setSelectedBotData] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const getToken = async () => {
//       try {
//         const storedToken = await AsyncStorage.getItem('userToken');
//         if (storedToken) {
//           const userToken = JSON.parse(storedToken);
//           console.log('Token:', userToken.token);
//           setisToken(userToken.token);
//         }
//       } catch (error) {
//         console.error('Error retrieving token:', error);
//       }
//     };
//     getToken();
//   }, []);

//   const checkAdminStatus = async () => {
//     try {
//       const storedToken = await AsyncStorage.getItem('userToken');
//       if (storedToken) {
//         const userToken = JSON.parse(storedToken);
//         console.log('Token in checkAdminStatus:', userToken.token);
//         setisToken(userToken.token);

//         if (userToken.status === true && userToken.data?.is_admin === 1) {
//           setIsAdmin(true);
//         } else {
//           console.log('Normal user detected');
//         }
//       }
//     } catch (error) {
//       console.error('Error parsing token:', error);
//     }
//   };

//   useEffect(() => {
//     checkAdminStatus();
//   }, []);

//   const fetchBotsData = useCallback(async () => {
//     if (!isToken) {
//       console.log('Token is not set, aborting fetch');
//       return;
//     }

//     try {
//       const response = await axios.get(
//         'https://aitutor.schoolmgmtsys.com/api/chatbots',
//         {
//           headers: {
//             Authorization: `Bearer ${isToken}`,
//           },
//         },
//       );
//       setBots(response.data);
//       // console.log('Bots data:', response.data);
//     } catch (error) {
//       console.error('Error fetching bot data:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [isToken]);

//   const fetchSelectedBotsData = useCallback(
//     async bot_id => {
//       if (!isToken) {
//         console.log('Token is not set, aborting fetch');
//         return;
//       }

//       try {
//         console.log(
//           'Fetching data for bot ID:',
//           bot_id,
//           'with token:',
//           isToken,
//         );

//         const response = await fetch(
//           'https://aitutor.schoolmgmtsys.com/api/save-bot',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${isToken}`,
//             },
//             body: JSON.stringify({bot_id}),
//           },
//         );

//         if (!response.ok) {
//           throw new Error(
//             'Error fetching selected bot data: ' + response.statusText,
//           );
//         }

//         const data = await response.json();
//         // console.log('Selected bot data:', data);

//         setSelectedBotData(data);
//         setShowModal(true);

//         setTimeout(() => {
//           navigation.navigate('SplashScreen');
//           setShowModal(false);
//         }, 2000);
//       } catch (error) {
//         console.error('Error fetching selected bot data:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [isToken, navigation],
//   );

//   useFocusEffect(
//     useCallback(() => {
//       if (isToken) {
//         setLoading(true);
//         fetchBotsData();
//       }
//     }, [fetchBotsData, isToken]),
//   );

//   // Listen for drawer open event
//   useEffect(() => {
//     const unsubscribe = props.navigation.addListener('drawerOpen', () => {
//       fetchBotsData(); // Fetch data when the drawer opens
//     });

//     return unsubscribe; // Cleanup the listener on unmount
//   }, [fetchBotsData, props.navigation]);

//   const handleShowMore = () => {
//     setShowAll(!showAll);
//   };

//   const displayedBots = showAll ? bots : bots.slice(0, 3);

//   const handleRefresh = () => {
//     setLoading(true);
//     fetchBotsData();
//   };
//   console.log('bot profile ', displayedBots[0]?.bot_profile);

//   const Base_url_showImgage = 'https://aitutor.schoolmgmtsys.com/storage/';
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.button} onPress={handleRefresh}>
//           <Icon name="refresh" size={30} color="#000" />
//           <Text style={styles.buttonText}>Refresh</Text>
//         </TouchableOpacity>

//         {isAdmin && (
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => navigation.navigate('CreateNewBot')}>
//             <Icon name="add-circle-outline" size={30} color="#000" />
//             <Text style={styles.buttonText}>Create bot</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView style={styles.container}>
//         <View style={styles.botsContainer}>
//           {loading ? (
//             <ActivityIndicator size="large" color="#0000ff" />
//           ) : (
//             <>
//               {displayedBots.map(bot => (
//                 <TouchableOpacity
//                   key={bot.id}
//                   style={styles.botItem}
//                   onPress={() => {
//                     if (isAdmin) {
//                       navigation.navigate('EditProfile', {botData: bot});
//                     } else {
//                       fetchSelectedBotsData(bot.id);
//                     }
//                   }}>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-evenly',
//                       paddingRight: '20%',
//                     }}>
//                     <Image
//                       source={{uri: `${Base_url_showImgage}${bot.bot_profile}`}}
//                       style={{height: 50, width: 50,borderRadius:20}}
//                     />
//                     <Text style={styles.botName}>{bot.bot_name}</Text>
//                   </View>

//                   {/* <Text style={styles.createdAt}>
//                     {new Date(bot.created_at).toLocaleDateString()}
//                   </Text>
//                   <Text style={styles.greetingMessage}>
//                     {bot.greeting_message}
//                   </Text> */}
//                 </TouchableOpacity>
//               ))}

//               {bots.length > 3 && (
//                 <TouchableOpacity
//                   style={styles.showMoreButton}
//                   onPress={handleShowMore}>
//                   <Text style={styles.showMoreText}>
//                     {showAll ? 'Show Less' : 'Show More'}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}
//         </View>
//       </ScrollView>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showModal}
//         onRequestClose={() => setShowModal(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Bot Selected Successfully!</Text>
//             <Text style={{color: 'black'}}>
//               Bot selected successfully! We are excited to have you on board.
//               Your selection has been confirmed.
//             </Text>
//             {/* <Button title="Close" onPress={() => setShowModal(false)} /> */}
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   button: {
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 12,
//     color: '#000',
//   },
//   botsContainer: {
//     paddingVertical: 10,
//   },
//   botItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   botName: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     color: '#000',
//   },
//   createdAt: {
//     fontSize: 14,
//     color: '#000',
//   },
//   greetingMessage: {
//     fontSize: 14,
//     color: '#000',
//   },
//   showMoreButton: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   showMoreText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalView: {
//     width: 300,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
// });

// export default DrawerContent;
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const DrawerContent = props => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isToken, setIsToken] = useState('');
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [selectedBotData, setSelectedBotData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // State for chat history
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          const userToken = JSON.parse(storedToken);
          setIsToken(userToken.token);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        const userToken = JSON.parse(storedToken);
        if (userToken.status === true && userToken.data?.is_admin === 1) {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const fetchBotsData = useCallback(async () => {
    if (!isToken) {
      return;
    }

    try {
      const response = await axios.get(
        'https://aitutor.schoolmgmtsys.com/api/chatbots',
        {
          headers: {
            Authorization: `Bearer ${isToken}`,
          },
        },
      );
      setBots(response.data);
    } catch (error) {
      console.error('Error fetching bot data:', error);
    } finally {
      setLoading(false);
    }
  }, [isToken]);

  const fetchChatHistory = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    const userToken = JSON.parse(storedToken);

    try {
      setLoading(true);
      const response = await fetch(
        'https://aitutor.schoolmgmtsys.com/api/chat-summaries',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      setChatHistory(data.summaries);
      // console.log('summerires -------------------------', data.summaries);/
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const fetchSelectedBotsData = useCallback(
    async bot_id => {
      if (!isToken) {
        console.log('Token is not set, aborting fetch');
        return;
      }

      try {
        console.log(
          'Fetching data for bot ID:',
          bot_id,
          'with token:',
          isToken,
        );

        const response = await fetch(
          'https://aitutor.schoolmgmtsys.com/api/save-bot',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${isToken}`,
            },
            body: JSON.stringify({bot_id}),
          },
        );

        if (!response.ok) {
          throw new Error(
            'Error fetching selected bot data: ' + response.statusText,
          );
        }

        const data = await response.json();
        console.log('Selected bot data:', data);

        setSelectedBotData(data);
        setShowModal(true);

        setTimeout(() => {
          navigation.navigate('SplashScreen');
          setShowModal(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching selected bot data:', error);
      } finally {
        setLoading(false);
      }
    },
    [isToken, navigation],
  );

  useFocusEffect(
    useCallback(() => {
      if (isToken) {
        setLoading(true);
        fetchBotsData();
      }
    }, [fetchBotsData, isToken]),
  );

  // Fetch chat history when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBotsData();
      fetchChatHistory();
    }, [fetchBotsData]),
  );

  // Refresh control handler for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchChatHistory();
  };

  const unescapeText = text => {
    // Unescape special characters to revert JSON formatting issues
    return text
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\"/g, '"') // Unescape double quotes
      .replace(/\\n/g, '\n') // Unescape new lines
      .replace(/\\'/g, "'"); // Unescape single quotes if needed
  };

  // Render chat history item
  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('ChatHistoryScreen', {chatId: item.chat_id})
      }>
      {/* Apply unescapeText to item.label before displaying */}
      <Text style={styles.chatMessage}>{unescapeText(item.label)}</Text>
    </TouchableOpacity>
  );
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  const displayedBots = showAll ? bots : bots.slice(0, 3);

  const handleRefresh = () => {
    setLoading(true);
    fetchBotsData();
  };

  const Base_url_showImgage = 'https://aitutor.schoolmgmtsys.com/storage/';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Icon name="refresh" size={30} color="#000" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CreateNewBot')}>
            <Icon name="add-circle-outline" size={30} color="#000" />
            <Text style={styles.buttonText}>Create bot</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.botsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {displayedBots.map(bot => (
                <TouchableOpacity
                  key={bot.id}
                  style={styles.botItem}
                  onPress={() => {
                    if (isAdmin) {
                      navigation.navigate('EditProfile', {botData: bot});
                    } else {
                      // Call the function to handle fetching selected bot data here
                      fetchSelectedBotsData(bot.id);
                    }
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      paddingRight: '20%',
                    }}>
                    <Image
                      source={{uri: `${Base_url_showImgage}${bot.bot_profile}`}}
                      style={{height: 50, width: 50, borderRadius: 20}}
                    />
                    <Text style={styles.botName}>{bot.bot_name}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {bots.length > 3 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={handleShowMore}>
                  <Text style={styles.showMoreText}>
                    {showAll ? 'Show Less' : 'Show More'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Chat History Section */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Chat History</Text>
        {/* <TouchableOpacity
          style={styles.chatItem}
          onPress={() => navigation.navigate('SplashScreen')}
          // onPress={() => console.log(item.chat_id)}
        >
          <Text style={styles.chatMessage}>New Tab</Text>
        </TouchableOpacity> */}
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={chatHistory}
            keyExtractor={item => item.chat_id.toString()}
            renderItem={renderChatItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Bot Selected Successfully!</Text>
            <Text style={{color: 'black'}}>
              Bot selected successfully! We are excited to have you on board.
              Your selection has been confirmed.
            </Text>

            {/* OK Button to close the modal */}
            {/* <TouchableOpacity
              style={styles.okButton} // Add styles to this button
              onPress={() => setShowModal(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: '#000',
  },
  botsContainer: {
    paddingVertical: 10,
  },
  botItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  botName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  showMoreButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  showMoreText: {
    fontSize: 16,
    color: '#000',
  },
  historyContainer: {
    padding: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  listContainer: {
    paddingBottom: 20,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatMessage: {
    fontSize: 16,
    color: 'grey',
  },
  chatResponse: {
    fontSize: 14,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default DrawerContent;
