// ChatGPTTest.tsx
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const ChatGPTTest = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const result = await axios.post(
        'https://api.openai.com/v1/engines/gpt-4-completions',
        {
          prompt: input,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
          },
        },
      );

      setResponse(result.data.choices[0].text);
    } catch (error) {
      console.error('Error:', error);
      setResponse(
        'Error fetching response. Please check your API key and try again.',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ChatGPT Test</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your question..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={handleSend} />
      <Text style={styles.responseTitle}>Response:</Text>
      <Text style={styles.response}>{response}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  response: {
    fontSize: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    minHeight: 100,
    textAlign: 'left',
  },
});

export default ChatGPTTest;
