import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../constants/GlobalStyles';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({route, navigation}) => {
  const {botData} = route.params;
  console.log(botData?.is_default);

  const [logo, setLogo] = useState(null);
  const [name, setName] = useState(botData.bot_name || '');
  const [prompt, setPrompt] = useState(botData.prompt || '');
  const [baseBot, setBaseBot] = useState(botData.base_bot || '');
  const [pdf, setPdf] = useState(null);
  const [isToken, setIsToken] = useState('');
  const [greetingMessage, setGreetingMessage] = useState(
    botData.greeting_message || '',
  );
  const [suggestReplies, setSuggestReplies] = useState(
    !!botData.bot_recommendations,
  );
  const [bio, setBio] = useState(botData.bot_bio || '');
  const [isPublic, setIsPublic] = useState(!!botData.public_access);
  const [renderMarkdown, setRenderMarkdown] = useState(!!botData.show_prompt);
  const [loading, setLoading] = useState(false);

  // Function to delete the bot
  const deleteBot = async () => {
    try {
      const response = await fetch(
        `https://aitutor.schoolmgmtsys.com/api/bots/${botData.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${isToken}`,
          },
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Bot deleted successfully!', [
          {text: 'OK', onPress: () => navigation.replace('SplashScreen')},
        ]);
      } else {
        const result = await response.json();
        Alert.alert('Error', result.message || 'Failed to delete bot.');
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
      Alert.alert('Error', 'An error occurred while deleting the bot.');
    }
  };

  useEffect(() => {
    if (botData) {
      setName(botData.bot_name || '');
      setPrompt(botData.prompt || '');
      setBaseBot(botData.base_bot || '');
      setGreetingMessage(botData.greeting_message || '');
      setBio(botData.bot_bio || '');
      setSuggestReplies(!!botData.bot_recommendations);
      setIsPublic(!!botData.public_access);
      setRenderMarkdown(!!botData.show_prompt);

      // Set the profile image if it exists
      if (botData.bot_profile) {
        setLogo({
          uri: `https://aitutor.schoolmgmtsys.com/storage/${botData.bot_profile}`,
        });
      } else {
        setLogo(null);
      }

      // Set the knowledge base PDF if it exists
      if (botData.knowledge_base) {
        setPdf({
          uri: `https://aitutor.schoolmgmtsys.com/storage/${botData.knowledge_base}`,
        });
      } else {
        setPdf(null);
      }
    }
  }, [botData]);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required.');
      return false;
    }
    if (!prompt.trim()) {
      Alert.alert('Error', 'Prompt is required.');
      return false;
    }
    if (!greetingMessage.trim()) {
      Alert.alert('Error', 'Greeting message is required.');
      return false;
    }
    if (!bio.trim()) {
      Alert.alert('Error', 'Bio is required.');
      return false;
    }
    return true;
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImage = response.assets[0];
        setLogo(selectedImage);
        console.log(selectedImage);
      }
    });
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        try {
          const userToken = JSON.parse(storedToken);
          console.log(userToken.token);
          setIsToken(userToken.token);
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    };
    checkAdminStatus();
  }, []);

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdf(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log('DocumentPicker Error: ', err);
      }
    }
  };

  const submitForm = async () => {
    if (!validateForm()) return;
    setLoading(true); // Start loader
    const formData = new FormData();
    formData.append('is_default', botData?.is_default === 1 ? '1' : '0');
    formData.append('bot_name', name);
    formData.append('base_bot', baseBot);
    formData.append('prompt', prompt);
    formData.append('greeting_message', greetingMessage);
    formData.append('bot_bio', bio);
    formData.append('public_access', isPublic ? '1' : '0');
    formData.append('bot_recommendations', suggestReplies ? '1' : '0');
    formData.append('show_prompt', renderMarkdown ? '1' : '0');

    // Updated logo append logic
    if (logo) {
      formData.append('bot_profile', {
        uri: logo.uri,
        type: logo.type || 'image/jpeg', // Assume JPEG if no type is provided
        name: logo.fileName || `bot_profile_${Date.now()}.jpg`,
      });
    }

    // if (logo) {
    //   formData.append('bot_profile', {
    //     uri: logo.uri,
    //     type: logo.type || 'image/jpeg', // Assume JPEG if no type is provided
    //     name: logo.fileName || `bot_profile_${Date.now()}.jpg`,
    //   });
    // }

    // Updated PDF append logic without uri.startsWith('content://')
    if (pdf) {
      formData.append('knowledge_base', {
        uri: pdf.uri,
        type: 'application/pdf',
        name: pdf.name || `knowledge_base_${Date.now()}.pdf`,
      });
    }

    try {
      const response = await fetch(
        `https://aitutor.schoolmgmtsys.com/api/update/${botData.id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${isToken}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Bot updated successfully!');
        setLoading(false); // Start loader
        navigation.navigate('SplashScreen');
      } else {
        console.log('Error:', result);
        Alert.alert('Error', result.message || 'Failed to update bot');
      }
    } catch (error) {
      console.error('Error updating bot:', error);
      Alert.alert('Error', 'An error occurred while updating the bot.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Logo</Text>
      <View style={{flexDirection: 'row', height: '14%', alignItems: 'center'}}>
        <TouchableOpacity style={styles.logoPicker} onPress={pickImage}>
          {logo ? (
            <Image source={{uri: logo.uri}} style={styles.logo} />
          ) : (
            <Image
              source={require('../assets/profile.png')}
              style={styles.logo}
            />
          )}
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              marginLeft: '15%',
              marginBottom: '25%',
              color: 'black',
            }}>
            Edit Bot Profile
          </Text>
        </View>
      </View>

      <Text style={styles.label}>Name</Text>
      <Text style={styles.instructions}>
        Should be unique and use 4-20 characters, including letters, numbers,
        dashes, periods, and underscores.
      </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={'#A9A9A9'} 
      />

      <Text style={styles.label}>Base Bot</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={baseBot}
          onValueChange={itemValue => setBaseBot(itemValue)}>
          <Picker.Item
            label="GPT-4o-mini"
            value="GPT-4o-mini"
            style={{color: 'black'}}
          />
        </Picker>
      </View>

      <Text style={styles.label}>Prompt</Text>
      <Text style={styles.instructions}>
        Tell your bot how to behave and how to respond to user messages.
      </Text>
      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Prompt"
        placeholderTextColor={'#A9A9A9'}
      />

      <Text style={styles.label}>Knowledge Base</Text>
      <Text style={styles.instructions}>
        Provide custom knowledge that your bot will use to inform responses.
      </Text>
      <TouchableOpacity style={styles.filePicker} onPress={pickPdf}>
        {pdf ? (
          <Text>{pdf.name || pdf.uri.split('/').pop()}</Text>
        ) : (
          <Text style={{color: 'black'}}>+ Add knowledge source</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Greeting Message</Text>
      <Text style={styles.instructions}>
        This message will be sent at the beginning of every conversation.
      </Text>
      <TextInput
        style={styles.input}
        value={greetingMessage}
        onChangeText={setGreetingMessage}
        placeholder="Greeting Message"
        placeholderTextColor={'#A9A9A9'} 
      />

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Suggest Replies</Text>
        <Switch
          value={suggestReplies}
          onValueChange={setSuggestReplies}
          trackColor={{false: '#767577', true: '#5b9acf'}}
          thumbColor={suggestReplies ? '#0275d8' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.label}>Bio</Text>
      <Text style={styles.instructions}>
        Describe your bot. This will help people understand its capabilities.
      </Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Bot Bio"
        placeholderTextColor={'#A9A9A9'} 
      />

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Public Access</Text>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          trackColor={{false: '#767577', true: '#5b9acf'}}
          thumbColor={isPublic ? '#0275d8' : '#f4f3f4'}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Show Markdown Prompt</Text>
        <Switch
          value={renderMarkdown}
          onValueChange={setRenderMarkdown}
          trackColor={{false: '#767577', true: '#5b9acf'}}
          thumbColor={renderMarkdown ? '#0275d8' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          botData?.is_default === 1 ? {marginBottom: '20%'} : {marginBottom: 0},
        ]}
        onPress={submitForm}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" /> // Show loader if form is submitting
        ) : (
          <Text style={styles.submitButtonText}>Save Changes</Text> // Show button text if not loading
        )}
      </TouchableOpacity>
      {botData?.is_default === 0 ? (
        <TouchableOpacity
          style={[
            styles.submitButton,
            {backgroundColor: '#d9534f', marginTop: 20, marginBottom: '20%'},
          ]}
          onPress={() =>
            Alert.alert(
              'Delete Bot',
              'Are you sure you want to delete this bot?',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: deleteBot, style: 'destructive'},
              ],
            )
          }>
          <Text style={styles.submitButtonText}>Delete Bot</Text>
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#343a40', // Dark color for label text
    marginBottom: 8,
  },
  logoPicker: {
    // borderWidth: 1,
    // borderColor: '#ced4da',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    height: 100,

    borderRadius: 8,
    // backgroundColor: '#e9ecef',
  },
  optionLabel: {
    color: 'black',
  },
  filePicker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    height: 55,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    color: 'black',
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    borderRadius: 8,
    height: 100,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioText: {
    color: '#343a40',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 55, // round shape
    borderColor: '#343a40',
    borderWidth: 2,
  },
  submitButton: {
    backgroundColor: '#5b9acf',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  instructions: {
    fontSize: 14, // Updated font size for consistency
    color: '#6c757d', // Darker shade for instructions
    marginVertical: 5,
  },
});

export default EditProfile;
