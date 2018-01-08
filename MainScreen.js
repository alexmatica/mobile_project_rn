/**
 * Created by Alex on 11/9/2017.
 */
import React from 'react'
import {StyleSheet, Text, View, TextInput, Button, ToastAndroid} from 'react-native';
import Communications from 'react-native-communications'
import firebase from 'react-native-firebase'

export default class MainScreen extends React.Component {

  static navigationOptions = {
    title: 'Welcome to Traveller React'
  };

  constructor(props){
    super(props);
    this.state = {email:'', password:'', isAuthenticated:false, crtUser: null};
  }

  signInAsGuest(){
      firebase.auth().signInAnonymously()
          .then(() => {
              this.setState({
                  isAuthenticated: true,
              });
          });
  }

  signOut(){
    firebase.auth().signOut()
        .then(()=>{
          this.setState({
              isAuthenticated: false,
          });
        });
  }

  signIn(){
    if (this.state.email === '' || this.state.password === ''){
      ToastAndroid.show("Email and password are mandatory!", ToastAndroid.SHORT);
      return;
    }
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
      //console.log("Logged in with email and password: " + user);
      //ToastAndroid.show("Logged in with email and password: " + user.email, ToastAndroid.LONG);
      this.setState({crtUser: user, isAuthenticated: true});

    }).catch((error) =>{
      ToastAndroid.show("Could not authenticate! " + error, ToastAndroid.SHORT);
    });
  }

  register(){
      if (this.state.email === '' || this.state.password === ''){
          ToastAndroid.show("Email and password are mandatory!", ToastAndroid.SHORT);
          return;
      }
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
        this.setState({crtUser: user});
        ToastAndroid.show("Successfully registered on email " + this.state.email, ToastAndroid.SHORT);
      }).catch((error) => {
        ToastAndroid.show("Could not create account: " + error, ToastAndroid.SHORT);
      });
  }

  render(){
    const {navigate} = this.props.navigation;
    if (this.state.isAuthenticated)
      return (
          <View style={styles.container}>
            <View style={styles.buttonsContainer}>
              <Button onPress={() => this.signOut()}
                      title="Sign out"
                      color='#e67e22'
                      style={styles.sendBtn}>
              </Button>
            </View>

            <View style={styles.buttonsContainer}>
              <Button onPress={() => Communications.email(['alexbv2301@gmail.com'], null, null, "Review", "Best app ever!!!")}
                      title="Send Email"
                      color='#e67e22'
                      style={styles.sendBtn}>
              </Button>
            </View>

            <View style={styles.buttonsContainer}>
              <Button onPress={() => navigate('Destinations')}
                      title="Continue"
                      color="#e67e22"
                      style={styles.sendBtn}>
              </Button>
            </View>
          </View>
      );

    return (
      <View style={styles.container}>

        <View style={styles.oneLineTextContainer}>
          <TextInput
            style={styles.textBoxSmall}
            keyboardType="email-address"
            placeholder="Email..."
            onChangeText={(text) => this.setState({email: text})}
          />
        </View>

        <View style={styles.oneLineTextContainer}>
          <TextInput
              style={styles.textBoxSmall}
              secureTextEntry={true}
              placeholder="Password..."
              onChangeText={(text) => this.setState({password: text})}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button onPress={() => this.register()}
                  title="Sign up"
                  color='#e67e22'
                  style={styles.sendBtn}>
          </Button>
        </View>

        <View style={styles.buttonsContainer}>
          <Button onPress={() => this.signIn()}
                  title="Log in"
                  color='#e67e22'
                  style={styles.sendBtn}>
          </Button>
        </View>

        <View style={styles.buttonsContainer}>
          <Button onPress={() => this.signInAsGuest()}
                  title="Guest user"
                  color='#e67e22'
                  style={styles.sendBtn}>
          </Button>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10%',
    paddingTop: '10%',
  },

  buttonsContainer: {
    flex: 1,
    width: '60%',
  },

  sendBtn:{
    flex: 1,
    width: '50%',
    padding: 20,
  },

  oneLineTextContainer: {
    flex: 1,
    alignItems: 'center',
    width: '60%',
  },

  textBoxSmall: {
    alignItems:'center',
    paddingBottom: 20,
    width: '90%',
  },

  multiLineTextContainer: {
    flex: 4,
    alignItems:'center',
    width: '60%',
    paddingBottom: 20,
  },

  textBoxLarge: {
    flex: 1,
    alignItems: 'center',
    width: '90%',
  }
});