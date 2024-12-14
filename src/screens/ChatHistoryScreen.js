import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  AppState,
} from 'react-native';
import {readFile} from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../constants/GlobalStyles';
import Voice from '@react-native-voice/voice';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {SettingsContext} from '../../App';
const screenWidth = Dimensions.get('window').width;

const ChatHistoryScreen = ({route}) => {
  const scrollViewRef = useRef(); // Reference to ScrollView
  const {chatId} = route.params || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isToken, setIsToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micColor, setMicColor] = useState('white');
  const [appState, setAppState] = React.useState(AppState.currentState);
  const navigation = useNavigation();
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const appStateRef = useRef(AppState.currentState);
  const [showOptions2, setShowOptions2] = useState(false);
  const [isBot, setBotData] = useState();
  const settings = useContext(SettingsContext);
  const [loading, setLoading] = useState(true);
  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // Load token from AsyncStorage
  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        const {token} = JSON.parse(storedToken);
        setIsToken(token); // Set the token to your state
      }
    } catch (error) {
      console.error('Error loading the token:', error);
    }
  };

  useEffect(() => {
    loadToken(); // Load the token when the component mounts
  }, []);
  const unescapeText = text => {
    if (!text) return ''; // If text is null or undefined, return an empty string
    return text
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\"/g, '"') // Unescape double quotes
      .replace(/\\n/g, '\n') // Unescape new lines
      .replace(/\\'/g, "'"); // Unescape single quotes if needed
  };

  // Fetch conversation history
  const fetchConversation = async () => {
    try {
      const url = `https://aitutor.schoolmgmtsys.com/api/full-conversation/${chatId}`;
      // console.log('Fetching URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isToken}`, // Use token from state
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`,
        );
      }

      const data = await response.json();
      // console.log('------------------', data?.conversation);
      if (data && data.conversation) {
        const escapedMessages = data.conversation.map(msg => {
          return {
            ...msg,
            text: unescapeText(msg.text), // Safely escape text using unescapeText
          };
        });

        setMessages(escapedMessages); // Reverse to maintain chat order
      }
    } catch (error) {
      console.error('Error fetching conversation:', error.message); // Log the error message
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
    setMicColor('red');
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    setMicColor('white');
  };

  const onSpeechResults = event => {
    if (event.value && event.value.length > 0) {
      const spokenText = event.value[0];
      setNewMessage(spokenText);
      stopListening();
    }
  };

  const onSpeechError = event => {
    setIsListening(false);
    setMicColor('white');
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      Alert.alert('Error', 'Failed to start voice recognition.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      Alert.alert('Error', 'Failed to stop voice recognition.');
    }
  };

  const handleMicPress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    fetchConversation(); // Fetch conversation only once on component mount
  }, [chatId, isToken]);

  const convertImageToBase64 = async imageUri => {
    try {
      console.log('Converting image to Base64. Image URI:', imageUri);

      const filePath =
        Platform.OS === 'android' ? imageUri.replace('file://', '') : imageUri;
      const base64String = await readFile(filePath, 'base64');

      console.log(
        'Image converted to Base64 successfully:',
        base64String.slice(0, 50),
        '...',
      );
      return `data:image/jpeg;base64,${base64String}`; // Return in proper data URL format
    } catch (error) {
      console.error('Error converting image to Base64:', error);
      return null;
    }
  };

  const pickImage = () => {
    setShowOptions(false);
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick the image.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const base64Image = await convertImageToBase64(asset.uri); // Convert image to Base64
        setSelectedFile({
          uri: asset.uri,
          base64: base64Image, // Store the base64 string of the image
          type: asset.type || 'image/jpeg',
          name: asset.fileName || asset.uri.split('/').pop(),
        });
      }
    });
  };

  const handleSendMessage = async () => {
    // Check if there's either a message or a selected file
    if (!newMessage.trim() && !selectedFile) {
      Alert.alert(
        'Empty Message',
        'Please enter a message or select a file to send.',
      );
      return; // Exit the function if both are empty
    }

    try {
      setIsLoading(true); // Set loading state to true

      const userMsg = {
        _id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        image: selectedFile ? selectedFile.uri : null, // Image URI for display in chat
        text: newMessage.trim() || null, // If there's no message, set to null
        user: {_id: 1, name: 'User'},
      };

      setMessages(prevMessages => [...prevMessages, userMsg]);
      setNewMessage(''); // Clear the input after sending
      setSelectedFile(null); // Clear the selected file after sending

      // Add a "Processing..." message
      const processingMessage = {
        _id: Math.random().toString(),
        text: 'Processing...',
        createdAt: new Date().toISOString(),
        user: {_id: 2, name: 'Bot'},
      };

      // Append the "Processing..." message
      setMessages(prevMessages => [...prevMessages, processingMessage]);

      const formData = new FormData();

      // Only append text if it exists
      if (newMessage.trim()) {
        formData.append('text', newMessage.trim());
      }

      // Only append the selected file if it exists
      if (selectedFile) {
        formData.append('file', {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
        });
      }

      const response = await fetch(
        'https://aitutor.schoolmgmtsys.com/api/upload-file',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${isToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${errorMessage}`);
      }

      const botData = await response.json();

      // Update the "Processing..." message with the actual bot response
      const botMsg = {
        _id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        image: null, // Assuming bot responses don't include images
        text: botData.assistance_response || 'Sorry, something went wrong.',
        user: {_id: 2, name: 'Bot'},
      };

      // Replace the "Processing..." message with the bot's response
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(msg =>
          msg.text === 'Processing...' ? botMsg : msg,
        );
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error fetching bot response:', error);

      const botErrorMsg = {
        _id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        image: null,
        text: 'Bot is currently unavailable. Please try again later.',
        user: {_id: 2, name: 'Bot'},
      };

      setMessages(prevMessages => [...prevMessages, botErrorMsg]);
    } finally {
      setIsLoading(false); // Stop loading after process is complete
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const handleIconPress = () => {
    setShowOptions(!showOptions);
  };

  const handleCrossPress = () => {
    setShowOptions(false);
  };
  const escapeText = text => {
    // Escape special characters to prevent JSON formatting issues
    return text
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, '\\n'); // Escape new lines
  };
  const saveChatHistory = async (chatId, messages) => {
    console.log(
      'saveChatHistory function called ---------------------',
      chatId,
      messages,
    );

    // Check if there are messages to save
    if (messages.length === 0) {
      console.log('No messages to save. Exiting saveChatHistory.');
      return;
    }

    try {
      // Process the messages array: convert images to base64 if necessary
      const processedMessages = await Promise.all(
        messages.map(async message => {
          // Ensure the user object is serializable
          const user = {
            _id: message.user._id,
            name: message.user.name,
          };

          // Escape text to handle special characters
          const escapedText = escapeText(message.text || '');

          // Check if the message contains an image and if it needs to be converted to base64
          if (message.image) {
            console.log('Image found in message:', message.image);

            // If the image is already on the server, skip conversion
            if (
              message.image.startsWith(
                'https://aitutor.schoolmgmtsys.com/storage/chat_images',
              )
            ) {
              console.log(
                'Image already on server, skipping Base64 conversion:',
                message.image,
              );
              return {
                ...message,
                text: escapedText, // Use escaped text
                image: message.image, // Directly use the existing URL
                user, // Ensure user is included as an object
              };
            } else {
              try {
                const base64Image = await convertImageToBase64(message.image);
                return {
                  ...message,
                  text: escapedText, // Use escaped text
                  image: base64Image || message.image, // Fallback to original image if conversion fails
                  user, // Ensure user is included as an object
                };
              } catch (convertError) {
                console.error(
                  'Error converting image to base64:',
                  convertError,
                );
                return {...message, text: escapedText, user}; // Return the original message on conversion failure
              }
            }
          }

          // If no image, return the message with escaped text
          return {...message, text: escapedText, user};
        }),
      );

      console.log(
        'Processed Messages: --------------------------------',
        processedMessages,
      );

      const historyUrl = `https://aitutor.schoolmgmtsys.com/api/chat-history/${chatId}`;
      const historyData = {messages: processedMessages};

      console.log('History Data to be sent:', historyData);

      // Make API call if a token exists
      if (isToken) {
        console.log('Token exists. Making API call...');
        const historyResponse = await fetch(historyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${isToken}`,
          },
          body: JSON.stringify(historyData),
        });

        console.log(
          'API Response Status: -------------------------------',
          historyResponse.status,
        );

        if (!historyResponse.ok) {
          const errorText = await historyResponse.text(); // Get error response text for more details
          throw new Error(
            `Failed to save chat history: ${historyResponse.status} ${errorText}`,
          );
        }

        const historyResult = await historyResponse.json();
        console.log(
          'Chat history API response: ---------------------------',
          historyResult,
        );
      } else {
        console.log('No token available, skipping chat history API call.');
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
      Alert.alert('Error', `Failed to save chat history. ${error.message}`);
    }
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     const onFocus = () => {
  //       // When the user enters the chat screen, clear the flag.
  //       setIsSavingHistory(false);
  //       console.log('Chat screen focused');
  //     };

  //     const onBlur = () => {
  //       // Only save chat history if the app is still active, not when it goes to the background
  //       if (appStateRef.current === 'active' && !isSavingHistory) {
  //         setIsSavingHistory(true);
  //         console.log('---------------------------------------');

  //         saveChatHistory(chatId);
  //         console.log('Chat screen blurred, saving history');
  //       }
  //     };

  //     // Add the focus and blur handlers
  //     navigation.addListener('focus', onFocus);
  //     navigation.addListener('blur', onBlur);

  //     return () => {
  //       navigation.removeListener('focus', onFocus);
  //       navigation.removeListener('blur', onBlur);
  //     };
  //   }, [messages, appState, chatId]),
  // );
  // useEffect(() => {
  //   const handleAppStateChange = nextAppState => {
  //     console.log(`App state changed: ${appState} -> ${nextAppState}`);

  //     // Trigger when app moves to background or closes
  //     if (
  //       appState.match(/active/) &&
  //       nextAppState.match(/inactive|background/)
  //     ) {
  //       console.log(
  //         'App is going to background/closed. Saving chat history...',
  //       );
  // saveChatHistory(chatId, messages);
  //     }

  //     setAppState(nextAppState); // Update the app state
  //   };

  //   // Subscribe to app state changes
  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   return () => {
  //     console.log('Cleaning up AppState listener');
  //     subscription.remove(); // Cleanup listener on unmount
  //   };
  // }, [appState, messages, chatId]);

  const handleOptionSelect = option => {
    if (option === 'completeProfile') {
      navigation.navigate('SignUpScreen2');
    } else if (option === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handlePressLogout,
        },
      ]);
    }
  };

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log(`App state changed: ${appState} -> ${nextAppState}`);

      // When the app goes from active to background or inactive
      if (
        appState.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('App is going to background...');

        // Directly call the API to save chat history to the server
        saveChatHistory(chatId, messages);
      }

      // Update the current app state
      setAppState(nextAppState);
    };

    // Listen for app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      console.log('Cleaning up AppState listener');
      subscription.remove(); // Clean up the AppState listener
    };
  }, [appState, messages, chatId]);

  // Dependencies: appState, chatId, and messages

  useEffect(() => {
    console.log('Setting up blur listener');

    // Add event listener for when the screen loses focus (navigating away)
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('blur event triggered. Saving chat history...');
      saveChatHistory(chatId, messages);
    });

    return () => {
      console.log('Cleaning up blur listener');
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, [navigation, messages, chatId]);
  // useEffect(() => {
  //   console.log('Setting up blur listener'); // Log to check if listener is being set up

  //   // Add event listener for when the screen loses focus (navigating away)
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     console.log(' blur event triggered. Saving chat history...'); // Log to check if event is triggered
  //     saveChatHistory(chatId, messages); // Pass chatId when calling saveChatHistory
  //   });

  //   return () => {
  //     console.log('Cleaning up blur listener'); // Log to check cleanup
  //     unsubscribe(); // Cleanup subscription on unmount
  //   };
  // }, [navigation, messages, chatId]);
  useFocusEffect(
    useCallback(() => {
      const fetchBotData = async () => {
        if (!isToken) {
          console.log('Token is not set, aborting fetch');
          return;
        }

        try {
          console.log('Fetching selected bot data with token:', isToken);
          const response = await fetch(
            'https://aitutor.schoolmgmtsys.com/api/get-bot',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${isToken}`, // Pass token in Authorization header
              },
            },
          );

          if (!response.ok) {
            throw new Error(
              'Error fetching selected bot data: ' + response.statusText,
            );
          }

          const data = await response.json();
          // console.log('Selected bot data:', data); // Log the selected bot data
          setBotData(data);
        } catch (error) {
          console.error('Error fetching selected bot data:', error);
        } finally {
          setLoading(false); // End loading state
        }
      };

      if (isToken) {
        fetchBotData(); // Call the function only when the token is available
      }
    }, [isToken]), // Trigger the effect only when `isToken` changes
  );
  const handleThreeDotPress = () => {
    setShowOptions2(!showOptions2);
  };
  const handleOptionPress2 = option => {
    setShowOptions2(false);
    handleOptionSelect(option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginLeft: '13%'}}
          onPress={() => saveChatHistory(chatId, messages)}>
          <Text
            style={[
              styles.title,
              {
                fontSize: screenWidth * 0.05,
                paddingVertical: 5,
                paddingHorizontal: 5,
                backgroundColor: colors.mainText,
                borderRadius: 20,
              },
            ]}>
            {isBot?.bot?.bot_name ? isBot?.bot?.bot_name : 'English Tutor'}
          </Text>
        </TouchableOpacity>

        {/* Add history icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SplashScreen')}
          style={styles.historyButton}>
          <Image
            source={require('../assets/historyIcon.png')} // Make sure you have the correct path for the image
            style={styles.historyIcon}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={handleThreeDotPress}
          style={styles.threeDotButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={settings?.mainText || '#000'}
          />
        </TouchableOpacity> */}
      </View>
      {showOptions2 && (
        <View style={[styles.optionsMenu, {right: screenWidth * 0.05}]}>
          <TouchableOpacity
            onPress={() => handleOptionPress2('completeProfile')}>
            <Text style={styles.optionText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress2('logout')}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.user.name === 'User' ? styles.userMessage : styles.botMessage, // Differentiate user and bot messages
            ]}>
            {msg.user.name !== 'User' && (
              <Image
                source={{
                  uri: `https://aitutor.schoolmgmtsys.com/storage/${isBot?.bot?.bot_profile}`,
                }} // Bot avatar
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10,
                }} // Avatar styling
              />
            )}

            <View>
              {msg.image && (
                <Image
                  source={{uri: msg.image}} // Display the image if message contains one
                  style={{width: 100, height: 100, marginBottom: 5}}
                />
              )}
              <Text
                style={[
                  styles.messageText,
                  {color: msg.user.name === 'User' ? 'white' : 'black'}, // White for user, black for bot
                ]}>
                {msg.text}
              </Text>

              {/* Timestamp for both User and Bot */}
              <Text
                style={{
                  fontSize: 12,
                  color: msg.user.name === 'User' ? 'white' : 'black',
                  marginTop: 5,
                  alignSelf:
                    msg.user.name === 'User' ? 'flex-end' : 'flex-start',
                }}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
                {/* Timestamp */}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        {selectedFile ? (
          <View style={styles.selectedFileContainer}>
            <Image
              source={{uri: selectedFile.uri}}
              style={[
                styles.fileIcon,
                {width: screenWidth * 0.15, height: screenWidth * 0.15},
              ]}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleIconPress}
            style={[styles.iconButton, {right: 10}]}>
            <Ionicons name="attach-outline" size={24} color="white" />
          </TouchableOpacity>
        )}

        <View style={styles.container2}>
          <TextInput
            style={[
              styles.textInput2,
              {fontSize: screenWidth * 0.045, color: 'white'},
            ]}
            placeholder="Type your message"
            placeholderTextColor="white"
            multiline={true}
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
          />

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={isLoading}
            style={styles.sendButton2}>
            <Image
              source={require('../assets/send.png')}
              style={[
                styles.sendIcon2,
                {width: screenWidth * 0.07, height: screenWidth * 0.07},
              ]}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleMicPress} style={styles.micButton}>
          <Ionicons name="mic" size={24} color={micColor} />
        </TouchableOpacity>
      </View>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Ionicons name="image-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCrossPress}
            style={styles.iconButton}>
            <Ionicons name="close-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles for the chat system
const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // paddingHorizontal: 16,
    height: 50,
    // backgroundColor: 'red',
    // backgroundColor: '#fff', // Customize the background color
  },
  container: {
    flex: 1,
    backgroundColor: 'white', // Background color for the entire screen
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: '5%', // Padding to provide some horizontal space
    paddingVertical: 10, // Vertical padding for messages
  },
  messageBubble: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%', // Limit message bubble width to 80% of the screen width
  },
  userMessage: {
    backgroundColor: '#599CD3', // Color for user messages
    alignSelf: 'flex-end', // Align user messages to the right
  },
  botMessage: {
    backgroundColor: '#f0f0f0', // Color for bot messages
    alignSelf: 'flex-start', // Align bot messages to the left
  },
  messageText: {
    fontSize: 16,
    color: '#000000', // Text color for messages
  },
  fileIcon: {
    width: 50,
    height: 50,
    marginTop: 10,
    right: 10,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white', // Background color for input container
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: '4%',
  },
  container2: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.mainText, // Assuming colors.mainText is defined
    borderRadius: 40,
    right: 5,
  },
  textInput2: {
    flex: 1,
    color: 'black',
    marginLeft: 10,
    fontSize: 16,
  },
  sendButton2: {
    paddingHorizontal: 10,
  },
  sendIcon2: {
    width: 24,
    height: 24,
  },
  micButton: {
    padding: 4,
    backgroundColor: colors.mainText,
    borderRadius: 50,
  },
  iconButton: {
    backgroundColor: colors.mainText,
    padding: 5,
    borderRadius: 20,
    marginVertical: 5,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
    // left: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    // backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly transparent background
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    // marginLeft:'5%',
    fontWeight: 'bold',
    color: 'white',
  },
  threeDotButton: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  historyIcon: {
    width: 20,
    height: 20, // Adjust the size based on your design
    marginRight: 10, // To position it near the three dots
  },
  optionsMenu: {
    position: 'absolute',
    top: 70,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
});

export default ChatHistoryScreen;
