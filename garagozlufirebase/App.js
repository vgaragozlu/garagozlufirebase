// CRUD (Create, Read, Update, Delete) Operations are demonstrated here !

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';

import auth, {firebase} from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

const App = () => {
  // burada state olarak tanımlıyoruz
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [usernameInput, setUsernameInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  const [usernameInputRegister, setUsernameInputRegister] = useState();
  const [passwordInputRegister, setPasswordInputRegister] = useState();

  const [name, setName] = useState();

  const [nameFromDatabase, setNameFromDatabase] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };
  // Register fonksiyonu içerisinde CREATE işlemi de gerçekleşmektedir.
  const register = async () => {
    await auth()
      .createUserWithEmailAndPassword(
        usernameInputRegister,
        passwordInputRegister,
      )
      .then(() => {
        console.log('Kullanıcı kayıt edildi ve oturum açıldı !');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log(
            'Girdiğiniz e-posta başka bir kullanıcı tarafından alındı !',
          );
          alert('Girdiğiniz e-posta başka bir kullanıcı tarafından alındı !');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('Yanlış e-posta girdiniz !');
          alert('Yanlış e-posta girdiniz !');
        }

        console.error(error);
      });
    const usersCollection = firestore().collection('Users');
    const currentUser = firebase.auth().currentUser;

    // CREATE
    await usersCollection.doc(currentUser.uid).set({
      email: currentUser.email,
    });
  };

  const signIn = async () => {
    await auth()
      .signInWithEmailAndPassword(usernameInput, passwordInput)
      .then(() => {
        console.log('Oturum açıldı !');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log(
            'Girdiğiniz e-posta başka bir kullanıcı tarafından alındı !',
          );
        }

        if (error.code === 'auth/invalid-email') {
          console.log('Yanlış e-posta girdiniz !');
        }

        console.error(error);
      });
  };

  const signOut = () => {
    auth().signOut().then(console.log('Kullanıcı oturum kapattı'));
  };

  // addNameToDatabase fonksiyonu içinde UPDATE işlemi de gerçekleşmekte
  const addNameToDatabase = async () => {
    const usersCollection = firestore().collection('Users');

    // UPDATE
    await usersCollection
      .doc(user.uid)
      .update({name: name})
      .then(() => {
        setName();
        alert('Isminiz veritabanına eklendi!');
      });
      
      const c_user = usersCollection.doc('SqmwBfh6iefTceL78wGdNfs6RGB3').get();
      
      console.log((await c_user).data());
      
      setNameFromDatabase((await c_user).data().name);
  };

  // deleteNameFromDatabase fonksiyonu içinde DELETE işlemi gerçekleşmekte
  const deleteNameFromDatabase = async () => {
    const usersCollection = firestore().collection('Users');

    // DELETE
    await usersCollection
      .doc(user.uid)
      .update({name: firebase.firestore.FieldValue.delete()})
      .then(() => {
        setName();
        alert('Isminiz veritabanından silindi !');
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#F1F1F1',
        }}>
        <Image
          source={require('./logo.png')}
          style={{
            width: 50,
            height: 90,
            marginTop: 20,
            alignSelf: 'center',
          }}
        />

        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            height: 270,
            width: 300,
            borderRadius: 10,
            borderColor: 'grey',
            marginTop: 10,
          }}>
          <View>
            <TextInput
              placeholder="kullanıcı adı"
              style={{
                paddingLeft: 10,
                width: 200,
                height: 40,
                borderWidth: 0.5,
                borderColor: 'grey',
                borderRadius: 10,
              }}
              value={usernameInput}
              onChangeText={setUsernameInput}
            />
          </View>

          <View style={{marginTop: 20}}>
            <TextInput
              placeholder="şifre"
              style={{
                paddingLeft: 10,
                width: 200,
                height: 40,
                borderWidth: 0.5,
                borderColor: 'grey',
                borderRadius: 10,
              }}
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity onPress={signIn}>
            <View
              style={{
                backgroundColor: '#63D18D',
                width: 200,
                height: 40,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <Text style={{color: 'white'}}>Oturum aç</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            height: 270,
            width: 300,
            borderRadius: 10,
            borderColor: 'grey',
            marginTop: 40,
          }}>
          <View style={{marginTop: 50}}>
            <TextInput
              placeholder="kullanıcı adı"
              style={{
                paddingLeft: 10,
                width: 200,
                height: 40,
                borderWidth: 0.5,
                borderColor: 'grey',
                borderRadius: 10,
              }}
              value={usernameInputRegister}
              onChangeText={setUsernameInputRegister}
            />
          </View>

          <View style={{marginTop: 20}}>
            <TextInput
              placeholder="şifre"
              style={{
                paddingLeft: 10,
                width: 200,
                height: 40,
                borderWidth: 0.5,
                borderColor: 'grey',
                borderRadius: 10,
              }}
              value={passwordInputRegister}
              onChangeText={setPasswordInputRegister}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity onPress={register}>
            <View
              style={{
                backgroundColor: '#63D18D',
                width: 200,
                height: 40,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text style={{color: 'white'}}>Kayıt ol</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hesaba bağlı e-posta: <Text style={{fontWeight:'bold'}}>{user.email}</Text></Text>
      <Text>Databaseden READ edilen isim: <Text style={{fontWeight:'bold'}}>{nameFromDatabase}</Text></Text>

      <View style={{marginTop: 20}}>
        <TextInput
          placeholder="Yeni isim giriniz"
          style={{
            paddingLeft: 10,
            width: 200,
            height: 40,
            borderWidth: 0.5,
            borderColor: 'grey',
            borderRadius: 10,
          }}
          value={name}
          onChangeText={setName}
        />
      </View>
      <TouchableOpacity onPress={addNameToDatabase}>
        <View
          style={{
            backgroundColor: '#63D18D',
            width: 200,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text style={{color: 'white'}}>Ekle/Update the Document</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={deleteNameFromDatabase}>
        <View
          style={{
            backgroundColor: '#63D18D',
            width: 200,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text style={{color: 'white'}}>Ismi Databaseden Sil/Delete</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOut}>
        <View
          style={{
            backgroundColor: '#E45B63',
            width: 200,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text style={{color: 'white'}}>Oturumu kapat</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    //backgroundColor: Colors.lighter,
  },
});

export default App;
