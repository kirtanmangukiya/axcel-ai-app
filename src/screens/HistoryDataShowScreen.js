// import {StyleSheet, Text, View, ActivityIndicator, Alert} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const HistoryDataShowScreen = ({route}) => {
//     const {chatId} = route.params; // Extract chatId from route params
//     const [conversation, setConversation] = useState(null); // State to hold the conversation data
//     const [loading, setLoading] = useState(true); // State to handle loading
//     const [isToken, setisToken] = useState(''); // State for token

//     // Fetch the token from AsyncStorage
//     useEffect(() => {
//         const checkAdminStatus = async () => {
//         const storedToken = await AsyncStorage.getItem('userToken');
//         if (storedToken) {
//             try {
//             const userToken = JSON.parse(storedToken);
//             setisToken(userToken.token); // Set the token
//             } catch (error) {
//             console.error('Error parsing token:', error);
//             }
//         }
//         };

//         checkAdminStatus();
//     }, []);

//     // Fetch the conversation using chatId and token
//     useEffect(() => {
//         const fetchConversation = async () => {
//         if (!isToken) {
//             console.log('No token available, skipping API call.');
//             return;
//         }

//         try {
//             const url = `https://aitutor.schoolmgmtsys.com/api/full-conversation/${chatId}`;
//             const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${isToken}`, // Pass the token here
//             },
//             });

//             if (!response.ok) {
//             throw new Error('Failed to fetch conversation');
//             }

//             const data = await response.json();
//             setConversation(data); // Set the fetched conversation data
//             setLoading(false); // Stop loading
//             console.log(data?.conversation[0]);
//         } catch (error) {
//             console.error('Error fetching conversation:', error);
//             Alert.alert('Error', `Failed to load conversation. ${error.message}`);
//             setLoading(false);
//         }
//         };

//         if (chatId) {
//         fetchConversation(); // Call the function when chatId and token are available
//         }
//     }, [chatId, isToken]); // Run the effect when chatId or token changes

//   return (
//     <View style={styles.container}>
//     <Text>jfefwo</Text>
//     </View>
//   );
// };

// export default HistoryDataShowScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
// });
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  InteractionManager,
  AppState, // Added for responsiveness
} from 'react-native';
import {Platform} from 'react-native';
import {readFile} from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import throttle from 'lodash.throttle';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import {colors} from '../constants/GlobalStyles';
import LogoComponent from '../component/LogoComponent';
import {SettingsContext} from '../../App';
import axios from 'axios';
import {FlatList} from 'react-native-gesture-handler';
const {width: screenWidth} = Dimensions.get('window');
import {GiftedChat, Message} from 'react-native-gifted-chat';

const HistoryDataShowScreen = ({route}) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const {chatId} = route.params || {}; // Extract chatId from route params

  console.log(chatId);
  const [lastMessageTime, setLastMessageTime] = useState(null);

  const [conversation, setConversation] = useState(null); // State to hold the conversation data
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  // The rest of your existing code remains the same...
  const [showOptions, setShowOptions] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOptions2, setShowOptions2] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [micColor, setMicColor] = useState('white');
  const settings = useContext(SettingsContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBot, setBotData] = useState();
  console.log('react native 22222222222222222222222222222222222222', messages);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  const [systemMessage, setSystemMessage] = useState(
    isBot?.bot?.bot_bio ||
      'You are a helpful assistant. Only respond to questions related to music, such as music theory, song lyrics, and related topics.',
  );

  // const settings = useContext(SettingsContext);

  // console.log('----------------', isBot);
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // The app is going to the background due to system events like Home button press
        console.log('App is going to the background');
      }
      appStateRef.current = nextAppState;
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  // Throttle scrolling to the end to avoid unnecessary re-renders
  const throttleScrollToEnd = useCallback(
    throttle(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 300), // Limit how often the scroll happens
    [],
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        throttleScrollToEnd();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setTimeout(() => {
          throttleScrollToEnd();
        }, 200); // Delay ensures layout settles before scrolling
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [throttleScrollToEnd]);

  const [isToken, setisToken] = useState('');
  useEffect(() => {
    const checkAdminStatus = async () => {
      // Retrieve the user token from AsyncStorage
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        try {
          const userToken = JSON.parse(storedToken);
          // console.log('Token:', userToken.token);

          // Set the token correctly here
          setisToken(userToken.token);

          // Check if the user is an admin
          if (userToken.status === true && userToken.data?.is_admin === 1) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    };

    checkAdminStatus();
  }, []);

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

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };
  const scrollViewRef = useRef(); // Add a ref to the ScrollView

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

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
      setUserMessage(spokenText);
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

  const handleIconPress = () => {
    setShowOptions(!showOptions);
  };

  const handleCrossPress = () => {
    setShowOptions(false);
  };

  const pickImage = () => {
    setShowOptions(false);
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick the image.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || asset.uri.split('/').pop(),
        });
      }
    });
  };
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (result && result.length > 0) {
        setSelectedFile({uri: result[0].uri, type: 'document'});
        setShowOptions(false);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log('DocumentPicker Error: ', err);
        Alert.alert('Error', 'Failed to pick the document.');
        setShowOptions(false);
      }
    }
  };

  const handleSendPress = () => {
    if (selectedFile && selectedFile.type === 'image') {
      sendMessage(); // No parameters needed if you're using the component's state
    } else {
      sendMessage();
    }
  };
  const imageUrl =
    'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&w=600';

  useEffect(() => {
    // Using InteractionManager to ensure the scroll happens after rendering
    InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });
  }, [keyboardVisible, messages]);

  const convertImageToBase64 = async imageUri => {
    try {
      console.log('Converting image to Base64. Image URI:', imageUri);

      // On Android, file URIs sometimes have a 'file://' prefix, so remove it
      const filePath =
        Platform.OS === 'android' ? imageUri.replace('file://', '') : imageUri;

      // Convert the image at the given file path to a base64 string
      const base64String = await readFile(filePath, 'base64');

      console.log(
        'Image converted to Base64 successfully:',
        base64String.slice(0, 50),
        '...',
      ); // Log first 50 chars for debugging
      return `data:image/jpeg;base64,${base64String}`; // Return in proper data URL format
    } catch (error) {
      console.error('Error converting image to Base64:', error);
      return null; // Return null if conversion fails
    }
  };

  const escapeText = text => {
    // Escape special characters to prevent JSON formatting issues
    return text
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, '\\n'); // Escape new lines
  };

  const saveChatHistory = async chatId => {
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
          'Chat history API response: --------------------------- Chat history API response',
          historyResult,
          historyData,
        );
      } else {
        console.log('No token available, skipping chat history API call.');
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
      Alert.alert('Error', `Failed to save chat history. ${error.message}`);
    }
  };
  const sendMessage = async () => {
    if (!userMessage.trim() && !selectedFile) {
      Alert.alert(
        'Empty Message',
        'Please enter a message or select a file to send.',
      );
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      // Add the text message to the FormData if present
      if (userMessage.trim()) {
        formData.append('text', userMessage.trim());
      }

      // Add the selected file to the FormData if present
      if (selectedFile) {
        formData.append('file', {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
        });
      }

      // Check if token is valid
      if (!isToken) {
        console.error('Token is missing or invalid.');
        Alert.alert('Error', 'Authorization token is missing.');
        setIsLoading(false); // Stop loading
        return;
      }

      // Log the token and form data for debugging
      console.log('Sending request with token:', isToken);
      console.log('Form data:', formData);

      // Create a new message object for the user's message
      const newMessage = {
        id: Math.random().toString(),
        text: userMessage.trim() || '',
        image: selectedFile ? selectedFile.uri : null,
        createdAt: new Date().toISOString(),
        user: {
          _id: 1,
          name: 'User',
        },
      };

      // Append the user's message immediately to UI
      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, [newMessage]),
      );
      setUserMessage(''); // Clear input
      setSelectedFile(null); // Reset selected file
      setChatStarted(true);

      // Add a "Processing..." bot message
      const processingMessage = {
        id: Math.random().toString(),
        text: 'Processing...',
        createdAt: new Date().toISOString(),
        user: {
          _id: 2,
          name: 'Bot',
        },
      };

      // Append the "Processing..." message
      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, [processingMessage]),
      );

      // Store processing message ID to replace it later
      const processingMessageId = processingMessage.id;

      // Send API request
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

      // Check response status and content type
      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(
          `File and message upload failed: ${response.status} ${response.statusText}`,
        );
      }

      // If response contains JSON
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('API response:', result);

        // Update the "Processing..." message with the actual bot response
        const botMessage = {
          id: processingMessageId, // Use the same ID to replace the message
          text: result.assistance_response || 'No response received',
          createdAt: new Date().toISOString(),
          user: {
            _id: 2,
            name: 'Bot',
          },
        };

        // Replace the "Processing..." message with the bot's response
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === processingMessageId ? botMessage : msg,
          ),
        );
      } else {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        Alert.alert('Error', 'Received non-JSON response from server.');
      }
    } catch (error) {
      console.error('Error during sendMessage:', error);
      Alert.alert(
        'Error',
        `Failed to upload file and message. ${error.message}`,
      );
    } finally {
      setIsLoading(false); // Stop loading after process is complete
    }
  };

  useEffect(() => {
    console.log('Setting up blur listener'); // Log to check if listener is being set up

    // Add event listener for when the screen loses focus (navigating away)
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('blur event triggered. Saving chat history...'); // Log to check if event is triggered
      saveChatHistory(chatId); // Pass chatId when calling saveChatHistory
    });

    return () => {
      console.log('Cleaning up blur listener'); // Log to check cleanup
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, [navigation, messages, chatId]); // Include chatId and messages in the dependency array

  const handleThreeDotPress = () => {
    setShowOptions2(!showOptions2);
  };

  const handleOptionPress2 = option => {
    setShowOptions2(false);
    handleOptionSelect(option);
  };

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

  const handlePromptSelect = prompt => {
    setUserMessage(prompt);
  };

  const handlePressLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userProfile');
      navigation.navigate('SplashScreen');
    } catch (error) {
      console.error('Error removing userToken from AsyncStorage:', error);
    }
  };
  const scrollViewRef2 = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  Keyboard.addListener;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollViewRef.current?.scrollToEnd({animated: true});
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 200); // Delay ensures layout settles before scrolling
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });
  }, [keyboardVisible, messages]);

  // Voice and speech recognition setup
  const unescapeText = text => {
    // Unescape special characters to revert JSON formatting issues
    return text
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\"/g, '"') // Unescape double quotes
      .replace(/\\n/g, '\n') // Unescape new lines
      .replace(/\\'/g, "'"); // Unescape single quotes if needed
  };

  const fetchConversation = useCallback(async () => {
    console.log('fetchConversation called');
    console.log('Current chatId:', chatId);
    console.log('Current token:', isToken);

    setChatStarted(true);

    if (!chatId || !isToken) {
      console.log('chatId or token not available, skipping API call.');
      return;
    }

    setLoading(true);
    try {
      const url = `https://aitutor.schoolmgmtsys.com/api/full-conversation/${chatId}`;
      console.log('Fetching URL:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isToken}`,
        },
      });

      const data = await response.json(); // Parse the response
      if (!data?.conversation) {
        throw new Error('No conversation data found');
      }

      const userMessages =
        data?.conversation.filter(message => message.user._id === 1) || [];
      const botMessages =
        data?.conversation.filter(message => message.user._id === 2) || [];

      // Step 2: Sort user messages by 'id' in descending order
      const sortedUserMessages = userMessages
        .filter(message => message?.id)
        .sort((a, b) => a.id - b.id); // Sort by 'id' in ascending order
      // Step 3: Merge user and bot messages, ensuring bot messages come after the user message with the same 'id'
      const mergedConversation = sortedUserMessages.flatMap(userMsg => {
        // Find the corresponding bot message based on the user message's 'id'
        const botMsg = botMessages.find(bot => bot.id === userMsg.id);

        // Return user message first, then bot message (if exists)
        return botMsg ? [userMsg, botMsg] : [userMsg];
      });
      // Step 4: Map the merged conversation to the GiftedChat structure
      const formattedMessages = mergedConversation.map(msg => ({
        _id: msg.createdAt, // Use createdAt as the unique identifier
        text: msg.text,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.user._id,
          name: msg.user.name,
        },
        image: msg.image || null,
      }));

      // Update the state with formatted messages
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      Alert.alert('Error', `Failed to load conversation. ${error.message}`);
    } finally {
      setLoading(false);
      setIsLoading(false);
      console.log('Loading state set to false');
    }
  }, [chatId, isToken]);

  useEffect(() => {
    console.log('useEffect triggered for fetching conversation');
    fetchConversation(); // Fetch conversation when chatId or isToken changes
  }, [chatId, isToken, fetchConversation]);

  const [appState, setAppState] = React.useState(AppState.currentState);

  useEffect(() => {
    console.log('Setting up blur listener');

    // Add event listener for when the screen loses focus (navigating away)
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('blur event triggered. Saving chat history...');
      saveChatHistory(chatId);
    });

    return () => {
      console.log('Cleaning up blur listener');
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, [navigation, messages, chatId]);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log(`App state changed: ${appState} -> ${nextAppState}`);

      // Trigger when app moves to background or closes
      if (
        appState.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log(
          'App is going to background/closed. Saving chat history...',
        );
        saveChatHistory(chatId);
      }

      setAppState(nextAppState); // Update the app state
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      console.log('Cleaning up AppState listener');
      subscription.remove(); // Cleanup listener on unmount
    };
  }, [appState, messages, chatId]);
  const hasSufficientTimePassed = () => {
    if (!lastMessageTime) return true; // No previous messages, allow save
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastMessageTime; // Time passed since last message
    const timeThreshold = 10000; // 10 seconds threshold (example)

    return elapsedTime > timeThreshold;
  };

  useEffect(() => {
    // Update lastMessageTime whenever a message is sent
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      setLastMessageTime(new Date(latestMessage.createdAt).getTime());
    }
  }, [messages]);
  useFocusEffect(
    useCallback(() => {
      const onFocus = () => {
        // When the user enters the chat screen, clear the flag.
        setIsSavingHistory(false);
        console.log('Chat screen focused');
      };

      const onBlur = () => {
        // Only save chat history if the app is still active, not when it goes to the background
        if (appStateRef.current === 'active' && !isSavingHistory) {
          setIsSavingHistory(true);
          saveChatHistory(chatId);
          console.log('Chat screen blurred, saving history');
        }
      };

      // Add the focus and blur handlers
      navigation.addListener('focus', onFocus);
      navigation.addListener('blur', onBlur);

      return () => {
        navigation.removeListener('focus', onFocus);
        navigation.removeListener('blur', onBlur);
      };
    }, [messages, appState, chatId]),
  );

  return (
    <View onPress={() => setShowOptions2(false)} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        // keyboardVerticalOffset={100}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginLeft: '13%'}}
            onPress={() => saveChatHistory(chatId)}>
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

          <TouchableOpacity
            onPress={handleThreeDotPress}
            style={styles.threeDotButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={settings?.mainText || '#000'}
            />
          </TouchableOpacity>
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

        {!chatStarted && (
          <View style={{flex: 1}}>
            <View style={{alignItems: 'center'}}>
              <LogoComponent />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={[
                    styles.header,
                    {fontSize: screenWidth * 0.06, textAlign: 'center'},
                  ]}>
                  {isBot?.bot?.bot_name ? isBot?.bot?.bot_name : settings?.name}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    {fontSize: screenWidth * 0.04, textAlign: 'center'},
                  ]}>
                  {isBot?.bot?.bot_bio ? isBot?.bot?.bot_bio : settings?.name}{' '}
                  🌐
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.mainText,
                  paddingVertical: screenWidth * 0.02,
                  paddingHorizontal: screenWidth * 0.05,
                  borderRadius: 10,
                  marginTop: 20,
                  marginHorizontal: '5%',
                }}
                onPress={() =>
                  handlePromptSelect(
                    isBot?.bot?.greeting_message
                      ? isBot?.bot?.greeting_message
                      : settings?.prompt,
                  )
                }>
                <Text
                  style={{
                    color: 'white',
                    fontSize: screenWidth * 0.045,
                    textAlign: 'center',
                  }}>
                  {isBot?.bot?.greeting_message
                    ? isBot?.bot?.greeting_message
                    : settings?.prompt}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.messagesContainerWrapper}>
          {/* <GiftedChat
            messages={messages}
            user={{_id: 1}} // User's id
            renderInputToolbar={() => null} // Disable input toolbar if required
            alwaysShowSend={true}
            keyboardShouldPersistTaps="never"
            listViewProps={{showsVerticalScrollIndicator: false}}
          /> */}
          <GiftedChat
            messages={messages}
            user={{_id: 1}} // User's id
            renderInputToolbar={() => null} // Disable input toolbar if required
            alwaysShowSend={true}
            keyboardShouldPersistTaps="never"
            listViewProps={{showsVerticalScrollIndicator: false}}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {marginBottom: keyboardVisible ? 20 : 10},
          ]}>
          {selectedFile ? (
            <View style={styles.selectedFileContainer}>
              {selectedFile.type && selectedFile.type.startsWith('image') ? (
                <Image
                  source={{uri: selectedFile.uri}}
                  style={[
                    styles.fileIcon,
                    {width: screenWidth * 0.2, height: screenWidth * 0.2},
                  ]}
                />
              ) : selectedFile.type &&
                selectedFile.type.startsWith('document') ? (
                <Ionicons
                  name="document-outline"
                  size={screenWidth * 0.1}
                  color="black"
                />
              ) : null}
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleIconPress}
              style={styles.iconButton}>
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
              value={userMessage}
              onChangeText={text => setUserMessage(text)}
            />

            <TouchableOpacity
              onPress={handleSendPress}
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: '2%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // paddingHorizontal: 16,
    height: 50,
    // backgroundColor: 'red',
    // backgroundColor: '#fff', // Customize the background color
  },
  historyButton: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyIcon: {
    width: 20,
    height: 20, // Adjust the size based on your design
    marginRight: 10, // To position it near the three dots
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 10,
    // paddingHorizontal: '2%',

    backgroundColor: colors.mainText,
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
  optionText: {paddingVertical: 10, color: 'black'},
  // messagesContainerWrapper: {flex: 1,backgroundColor:'red'},
  messagesContainer: {flexGrow: 1},
  messageContainer: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
  },
  userMessage: {backgroundColor: 'grey', alignSelf: 'flex-end'},
  botMessage: {backgroundColor: '#599CD3', alignSelf: 'flex-start'},
  messageText: {fontSize: 16, color: 'white'},
  fileIcon: {width: 50, height: 50, marginTop: 10, right: '15%'},
  fileIcon2: {width: 50, height: 50, marginTop: 10, left: '1%'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: '4%',
  },
  container2: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.mainText,
    borderRadius: 40,
    right: 5,
  },
  textInput2: {flex: 1, color: 'black', marginLeft: 10},
  sendButton2: {paddingHorizontal: 10},
  sendIcon2: {width: 24, height: 24},
  micButton: {padding: 4, backgroundColor: colors.mainText, borderRadius: 50},
  selectedFileContainer: {flexDirection: 'row', alignItems: 'center'},

  optionsContainer: {
    position: 'absolute',

    bottom: 80,
    left: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
  },
  fullContentWrapper: {
    flex: 1, // Makes the view fill the entire screen
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
    // backgroundColor: 'red',
  },
  fullContent: {
    height: '100%',
    width: '100%', // Makes sure the content uses the full width
    // padding: 20, // Add some padding if needed
    alignItems: 'center', // Align content to center horizontally
  },
  header: {
    fontSize: 24,
    color: colors.mainText,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mainText,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  messagesContainerWrapper: {flex: 1},
  iconButton: {
    backgroundColor: colors.mainText,
    padding: 5,
    borderRadius: 20,
    right: '20%',
    marginVertical: 5,
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
});

export default HistoryDataShowScreen;
