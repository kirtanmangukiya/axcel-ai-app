import React, {useEffect, useState} from 'react';
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
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const CreateNewBot = () => {
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [baseBot, setBaseBot] = useState('');
  const [pdf, setPdf] = useState(null);
  const [greetingMessage, setGreetingMessage] = useState('');
  const [suggestReplies, setSuggestReplies] = useState(null);
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(null);
  const [renderMarkdown, setRenderMarkdown] = useState(false);
  const [customTemperature, setCustomTemperature] = useState(false);
  const [isAccess, setisAccess] = useState(false);
  const [isToken, setisToken] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Retrieve the user token from AsyncStorage
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        try {
          const userToken = JSON.parse(storedToken);
          console.log(userToken.token);
          setisToken(userToken.token);
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const validateForm = () => {
    // Required fields validation
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required.');
      return false;
    }
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please provide a prompt to guide the AI response');
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

    // Logo validation
    if (!logo) {
      Alert.alert('Error', 'Logo is required.');
      return false;
    }

    return true; // Form is valid if none of the above checks trigger
  };

  // Function to open the image picker
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
        setLogo(selectedImage); // Store the selected image
      }
    });
  };

  // const pickPdf = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf], // Restrict to PDF files
  //     });
  //     setPdf(res[0]); // Assuming the first file selected
  //     console.log('PDF Selected: ', res[0]);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled document picker');
  //     } else {
  //       console.log('DocumentPicker Error: ', err);
  //     }
  //   }
  // };

  const pickPdf = async () => {
    try {
      const options = {
        mediaType: 'photo', // Set media type to pick images
        includeBase64: false, // Set to true if you want base64 image data
      };

      const res = await launchImageLibrary(options);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.errorMessage) {
        console.log('ImagePicker Error: ', res.errorMessage);
      } else {
        setPdf(res.assets[0]); // Assuming the first image selected
        console.log('Image Selected: ', res.assets[0]);
      }
    } catch (err) {
      console.log('Error picking image: ', err);
    }
  };

  const resetForm = () => {
    setLogo(null);
    setName('');
    setPrompt('');
    setBaseBot('');
    setPdf(null);
    setGreetingMessage('');
    setSuggestReplies(null);
    setBio('');
    setIsPublic(null);
    setRenderMarkdown(false);
    setCustomTemperature(false);
    setisAccess(false);
  };

  const submitForm = async () => {
    if (!validateForm()) return;
    setLoading(true); // Start loader
    const formData = new FormData();
    formData.append('is_default', '0');
    formData.append('bot_name', name); // bot name
    formData.append('bot_type', name); // bot type (assuming it's selected in the 'Base Bot' picker)
    formData.append('base_bot', 'GPT-4o-mini'); // base bot
    formData.append('prompt', prompt); // bot prompt
    formData.append('greeting_message', greetingMessage); // greeting message
    formData.append('bot_bio', bio); // bot bio
    formData.append('public_access', isAccess ? '1' : '0'); // public access (1 for true, 0 for false)
    formData.append('bot_recommendations', suggestReplies ? '1' : '0'); // suggest replies (1 for true, 0 for false)
    formData.append('show_prompt', renderMarkdown ? '1' : '0'); // render markdown (1 for true, 0 for false)

    // Logo (bot profile image)
    if (logo) {
      formData.append('bot_profile', {
        uri: logo.uri,
        type: logo.type || 'image/jpeg', // Assume JPEG if no type is provided
        name: logo.fileName || `bot_profile_${Date.now()}.jpg`,
      });
    }

    // PDF (Knowledge base)
    if (pdf) {
      formData.append('knowledge_base', {
        uri: pdf.uri,
        type: pdf.type || 'image/jpeg', // Assume JPEG if no type is provided
        name: pdf.fileName || `bot_profile_${Date.now()}.jpg`,
      });
    }

    // Instead of logging formData.entries(), manually log the fields you're appending
    console.log('Form Data:');
    console.log('bot_name:', 'Bot_name');
    console.log('bot_type:', 'bot_type');

    console.log('base_bot:');
    console.log('prompt:', prompt);
    console.log('greeting_message:', greetingMessage);
    console.log('bot_bio:', bio);
    console.log('public_access:', isAccess ? '1' : '0');
    console.log('bot_recommendations:', suggestReplies ? '1' : '0');
    console.log('show_prompt:', renderMarkdown ? '1' : '0');

    if (logo) {
      console.log('bot_profile:', logo.uri);
    }
    if (pdf) {
      console.log('knowledge_base:', pdf.uri);
    }

    try {
      const response = await fetch(
        'https://aitutor.schoolmgmtsys.com/api/create-bot',
        {
          method: 'POST',
          headers: {
            // Remove 'Content-Type': 'multipart/form-data', let it be set automatically
            Accept: 'application/json',
            Authorization: `Bearer ${isToken}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Bot created successfully!');
        console.log('Response:', result);
        resetForm();
        navigation.navigate('SplashScreen');
        setLoading(false); // Start loader
      } else {
        console.error(result.errors.bot_profile[0]);
        Alert.alert(
          'Error',
          result.errors.bot_profile[0] || 'Failed to create bot',
        );
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      Alert.alert('Error', 'An error occurred while creating the bot.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Logo</Text>
        <View style={styles.logoContainer}>
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
            <Text style={styles.heading}>Create Bot</Text>
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
            onValueChange={itemValue => setBaseBot(itemValue)}
            style={{color: 'black'}}>
            <Picker.Item label="GPT-4o-mini" value={baseBot} />
          </Picker>
        </View>

        <Text style={styles.label}>Prompt</Text>
        <Text style={styles.instructions}>
          Tell your bot how to behave and how to respond to user messages. Try
          to be as clear and specific as possible.
        </Text>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Prompt"
          placeholderTextColor={'#A9A9A9'}        />

        <Text style={styles.label}>Knowledge Base </Text>
        <Text style={styles.instructions}>
          Provide custom knowledge That your bot will harness to inform
          responses.
        </Text>
        <TouchableOpacity style={styles.filePicker} onPress={pickPdf}>
          {pdf ? (
            <Text>{pdf.name || pdf.uri.split('/').pop()}</Text>
          ) : (
            <Text style={{color: 'black'}}>+Add knowledge source</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Greeting Message</Text>
        <Text style={styles.instructions}>
          The bot will send this message at the beginning of every conversation.
        </Text>
        <TextInput
          style={styles.input}
          value={greetingMessage}
          onChangeText={setGreetingMessage}
          placeholder="Greeting Message"
          placeholderTextColor={'#A9A9A9'}        />

        {/* Options */}
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Suggest Replies</Text>
          <Switch
            value={suggestReplies}
            onValueChange={setSuggestReplies}
            trackColor={{false: '#767577', true: '#5b9acf'}}
            thumbColor={suggestReplies ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Render Markdown Content</Text>
          <Switch
            value={renderMarkdown}
            onValueChange={setRenderMarkdown}
            trackColor={{false: '#767577', true: '#5b9acf'}}
            thumbColor={renderMarkdown ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Custom Temperature */}
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Custom Temperature</Text>
          <Switch
            value={customTemperature}
            onValueChange={setCustomTemperature}
            trackColor={{false: '#767577', true: '#5b9acf'}}
            thumbColor={customTemperature ? '#fff' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.instructions}>
          Controls the creativity of the bot's responses.
        </Text>

        <Text style={styles.label}>Bio Profile</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          placeholder="Your bot's bio"
          multiline
          placeholderTextColor={'#A9A9A9'}        />
        <Text style={styles.charCount}>{bio.length}/4000</Text>

        <Text style={styles.label}>Access</Text>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Make bot publicly accessible</Text>
          <Switch
            value={isAccess}
            onValueChange={setisAccess}
            trackColor={{false: '#767577', true: '#5b9acf'}}
            thumbColor={isAccess ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitForm}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05, // Responsive padding
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.05, // Responsive font size
    color: '#343a40',
    marginBottom: 8,
  },
  instructions: {
    fontSize: width * 0.04, // Responsive font size
    color: 'black',
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: width * 0.03, // Responsive padding
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: width * 0.04,
    color: 'black',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: width * 0.03,
    marginBottom: 15,
    color: 'black',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: width * 0.04,
    height: height * 0.2, // Dynamic height
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#666',
  },
  logoContainer: {
    flexDirection: 'row',
    height: height * 0.14, // Adjust height dynamically
    alignItems: 'center',
  },
  logoPicker: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    height: height * 0.12, // Responsive logo picker height
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  logo: {
    width: width * 0.22, // Dynamic logo size
    height: width * 0.22,
    borderRadius: width * 0.11, // Dynamic radius
    borderColor: '#343a40',
    borderWidth: 2,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: width * 0.06, // Responsive font size
    color: 'black',
    marginLeft: width * 0.15,
    // marginBottom: '25%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  filePicker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: width * 0.03,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  optionLabel: {
    fontSize: width * 0.045,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#5b9acf',
    paddingVertical: height * 0.017,
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});

export default CreateNewBot;
