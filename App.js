// App.js
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const API_URL = 'https://apihub.staging.appply.link/chatgpt';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [housing, setHousing] = useState('');
  const [parties, setParties] = useState('');
  const [goal, setGoal] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "What is the housing of your legal case?",
    "Who are the parties involved in the case?",
    "What is the goal or desired outcome of your case?"
  ];

  const handleSend = useCallback(async () => {
    let currentInput = '';
    switch (currentQuestion) {
      case 0:
        currentInput = housing;
        break;
      case 1:
        currentInput = parties;
        break;
      case 2:
        currentInput = goal;
        break;
    }

    if (currentInput.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: `${questions[currentQuestion]} ${currentInput}` }];
    setMessages(newMessages);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      try {
        const response = await axios.post(API_URL, {
          messages: [
            { role: "system", content: "You are a helpful legal assistant. Please provide a brief consultation based on the information given about a legal case." },
            ...newMessages
          ],
          model: "gpt-4o"
        });

        const assistantReply = response.data.response;
        setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
      } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
      }
    }
  }, [housing, parties, goal, messages, currentQuestion]);

  const renderInput = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <TextInput
            style={styles.input}
            value={housing}
            onChangeText={setHousing}
            placeholder={questions[0]}
            placeholderTextColor="#999"
          />
        );
      case 1:
        return (
          <TextInput
            style={styles.input}
            value={parties}
            onChangeText={setParties}
            placeholder={questions[1]}
            placeholderTextColor="#999"
          />
        );
      case 2:
        return (
          <TextInput
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
            placeholder={questions[2]}
            placeholderTextColor="#999"
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <Text style={styles.messageText}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        {renderInput()}
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  userMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  assistantMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
// End of App.js